import path from "path";
import fs from "fs";
import AdmZip from "adm-zip";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { Response } from "common/src/models/aici/Response";
import { Message } from "common/src/models/aici/Message";
import { Config } from "../Config";
import { UUIDv4 } from "common/src/logic/UUIDv4";
import { DatasetEntity } from "../data/DatasetEntity";
import { Logger } from "../Logger";
import { LogEntity } from "../data/LogEntity";
import { QdrantClient } from "@qdrant/js-client-rest";

/**
 * Represents an upload to the Aici system.
 */
export interface AiciUpload {
    /** The name of the file being uploaded. */
    file: string;
    /** The base64-encoded contents of the file. */
    contents: string;
}

/**
 * Represents a request for generating embeddings.
 */
interface EmbeddingRequest {
    /** The model to use for generating embeddings. */
    model: string;
    /** The input data for which embeddings are to be generated. */
    input: string | string[] | number[] | number[][];
}

/**
 * Represents a list of embeddings returned from the API.
 */
interface EmbeddingList {
    /** The type of the object returned. */
    object: string;
    /** The array of embeddings. */
    data: Embedding[];
    /** The model used to generate the embeddings. */
    model: string;
    /** Usage statistics for the embedding request. */
    usage: {
        /** Number of prompt tokens used. */
        prompt_tokens: number;
        /** Total number of tokens used. */
        total_tokens: number;
    }
}

/**
 * Represents a single embedding.
 */
interface Embedding {
    /** The type of the object returned. */
    object: string;
    /** The embedding vector. */
    embedding: number[];
    /** The index of the embedding in the list. */
    index: number;
}

/**
 * Contains logic for interacting with the Aici API, including chat and embedding functionalities.
 */
export class AiciLogic {
    /**
     * Sends a chat request to the Aici API.
     * @param ds The data source containing settings and repositories.
     * @param body An array of messages to send in the chat.
     * @returns A promise that resolves to the API response containing chat results.
     * @throws Will throw an error if the HTTP request fails or if the response is not ok.
     */
    public static async chat(ds: EntitiesDataSource, body: Message[]): Promise<Response> {
        const modelSetting = await ds.settingRepository().findByKey("Aici:Model");
        const urlSetting = await ds.settingRepository().findByKey("Aici:URL");
        const apiKeySetting = await ds.settingRepository().findByKey("Aici:API Key");

        const request = {
            model: modelSetting.value,
            messages: body
        };

        const fetchResponse = await fetch(`${urlSetting.value}/v1/chat/completions`, {
            method: "POST",
            body: JSON.stringify(request),
            headers: {
                "Authorization": `Bearer ${apiKeySetting.value}`,
                "Content-Type": "application/json"
            }
        });

        if (!fetchResponse.ok) {
            const details = await fetchResponse.text();
            throw new Error(`HTTP Status ${fetchResponse.status} - ${fetchResponse.statusText} - ${details}`);
        }

        const aiResponse = await fetchResponse.json();
        return aiResponse as Response;
    }

    /**
     * Handles the upload process, including saving the uploaded file, extracting ZIP files,
     * processing each file, generating explanations and embeddings, and saving results to the database.
     * @param logger The logger instance for logging operations.
     * @param do_not_use The data source (deprecated parameter) that is not used in this method.
     * @param body The upload data containing the file name and its contents in base64 format.
     * @returns A promise that resolves when the entire upload process is complete.
     * @throws Will throw an error if file processing fails or database operations encounter issues.
     */
    public static async upload(logger: Logger, do_not_use: EntitiesDataSource, body: AiciUpload): Promise<void> {
        const ds = new EntitiesDataSource();
        await ds.initialize();
        try {
            // prepare database
            await ds.datasetRepository().createQueryBuilder().delete()
                .from("datasets")
                .where("is_uploaded = TRUE")
                .execute();

            // prepare vector db
            const qdrantClient = new QdrantClient({
                url: Config.qdrantUrl
            });

            await this.deleteAndCreateCollections(qdrantClient, Config.qdrantContentCollection);
            await this.deleteAndCreateCollections(qdrantClient, Config.qdrantExplanationCollection);
            await this.deleteAndCreateCollections(qdrantClient, Config.qdrantNameCollection);

            // extract file
            const uploadedFile = this.saveUpload(body, "zip");
            const extractedZipFolder = await this.extractZip(uploadedFile);

            const includeSettingDto = await ds.settingRepository().findByKey("Aici:Upload:Include");
            const includeRexExes = this.createRegExes(includeSettingDto.value);

            const excludeSettingDto = await ds.settingRepository().findByKey("Aici:Upload:Exclude");
            const excludeRegExes = this.createRegExes(excludeSettingDto.value);

            const files = this.getFiles(logger, extractedZipFolder, includeRexExes, excludeRegExes);
            const errors: string[] = [];
            let promises: Promise<void>[] = [];
            let resolved = 0;
            files.forEach((file, cnt) => {
                promises.push(new Promise(async (resolve) => {
                    const fileName = path.join("~", file);
                    try {
                        await logger.log(`Aici.upload() - ${cnt + 1} of ${files.length} - ${file}`);

                        const fileContents = fs.readFileSync(path.join(extractedZipFolder, file), { encoding: "utf8" });

                        await logger.log(`Aici.upload() - ${cnt + 1} of ${files.length} - ${fileName} - Explain`);
                        const messages: Message[] = await this.getExplanation(cnt + 1, files.length, logger, ds, fileName, fileContents);
                        await this.saveMessagesToDataset(cnt + 1, files.length, logger, ds, fileName, messages);

                        let embeddingResponse;
                        try {
                            await logger.log(`Aici.upload() - ${cnt + 1} of ${files.length} - ${fileName} - Embed name`);
                            embeddingResponse = await this.getEmbedding(cnt + 1, files.length, logger, ds, fileName);
                            await this.saveToVectorDb(cnt + 1, files.length, logger, qdrantClient, Config.qdrantNameCollection, embeddingResponse, fileName, fileContents);
                        }
                        catch (err) {
                            errors.push(`Aici.upload() - ${cnt + 1} of ${files.length} - ${fileName} - name ERROR: ${(err as Error).message}`);
                        }

                        try {
                            if (fileContents.length / Config.embeddingBytesPerToken > Config.embeddingMaxTokens) {
                                errors.push(`Aici.upload() - ${cnt + 1} of ${files.length} - ${fileName} - content.tokens > ${Config.embeddingMaxTokens}`);
                            } else {
                                await logger.log(`Aici.upload() - ${cnt + 1} of ${files.length} - ${fileName} - Embed content`);
                                embeddingResponse = await this.getEmbedding(cnt + 1, files.length, logger, ds, fileContents);
                                await this.saveToVectorDb(cnt + 1, files.length, logger, qdrantClient, Config.qdrantContentCollection, embeddingResponse, fileName, fileContents);
                            }
                        }
                        catch (err) {
                            errors.push(`Aici.upload() - ${cnt + 1} of ${files.length} - ${fileName} - content ERROR: ${(err as Error).message}`);
                        }

                        try {
                            if (fileContents.length / Config.embeddingBytesPerToken > Config.embeddingMaxTokens) {
                                errors.push(`Aici.upload() - ${cnt + 1} of ${files.length} - ${fileName} - explanation.tokens > ${Config.embeddingMaxTokens}`);
                            } else {
                                await logger.log(`Aici.upload() - ${cnt + 1} of ${files.length} - ${fileName} - Embed explanation`);
                                const explanation = messages[messages.length - 1].content;
                                embeddingResponse = await this.getEmbedding(cnt + 1, files.length, logger, ds, explanation);
                                await this.saveToVectorDb(cnt + 1, files.length, logger, qdrantClient, Config.qdrantExplanationCollection, embeddingResponse, fileName, explanation);
                            }
                        }
                        catch (err) {
                            errors.push(`Aici.upload() - ${cnt + 1} of ${files.length} - ${fileName} - explanation ERROR: ${(err as Error).message}`);
                        }

                        await logger.log(`Aici.upload() - ${cnt + 1} of ${files.length} - ${fileName} - COMPLETED ${resolved + 1} of ${files.length}`);
                        resolved += 1;
                        resolve();
                    }
                    catch (err) {
                        errors.push(`Aici.upload() - ${cnt + 1} of ${files.length} - ${fileName} - ERROR: ${(err as Error).message}`);
                        resolve();
                    }
                }));
            });
            await Promise.all(promises);

            for (let cnt = 0; cnt < errors.length; cnt++)
                await logger.log(errors[cnt]);

            await logger.log("ALL DONE!");
        }
        finally {
            await ds.destroy();
        }
    }

    /**
     * Saves an embedding response to the specified vector database collection.
     * @param current The current index in the processing list for logging.
     * @param max The total number of items being processed, used for logging.
     * @param logger The logger instance for logging operations.
     * @param qdrantClient The Qdrant client used to interact with the vector database.
     * @param collection The name of the collection to save the embedding.
     * @param embeddingResponse The response containing the embeddings to save.
     * @param fileName The name of the processed file.
     * @param fileContents The contents of the processed file.
     */
    private static async saveToVectorDb(current: number, max: number, logger: Logger, qdrantClient: QdrantClient, collection: string, embeddingResponse: EmbeddingList, fileName: string, fileContents: string) {
        await logger.log(`AiciLogic.saveToVectorDb() - ${current} of ${max} - Saving`);
        await qdrantClient.upsert(
            collection,
            {
                wait: true,
                points: [
                    {
                        id: UUIDv4.generate(),
                        vector: embeddingResponse.data[0].embedding,
                        payload: {
                            title: fileName,
                            content: fileContents,
                            promptTokens: embeddingResponse.usage.prompt_tokens,
                            totalTokens: embeddingResponse.usage.total_tokens
                        }
                    }
                ]
            }
        );
    }

    /**
     * Retrieves an embedding for the given input content and logs relevant information about the operation.
     * @param current The current index in the batch for logging.
     * @param max The total number of embeddings being processed.
     * @param logger The logger instance for logging operations.
     * @param ds The data source to fetch settings and other data.
     * @param fileName The name of the file for which the embedding is generated.
     * @returns A promise that resolves to the embedding list for the specified content.
     * @throws Will throw an error if the embedding generation fails.
     */
    private static async getEmbedding(current: number, max: number, logger: Logger, ds: EntitiesDataSource, fileName: string): Promise<EmbeddingList> {
        const request: EmbeddingRequest = {
            model: Config.embeddingModel,
            input: fileName
        };

        const started = Date.now();
        const response: EmbeddingList = await AiciLogic.embedding(ds, request);
        const ended = Date.now();

        await logger.log(`AiciLogic.getEmbedding() - ${current} of ${max} - Input: ${response.usage.prompt_tokens}; Total: ${response.usage.total_tokens}`);
        await logger.log(`AiciLogic.getEmbedding() - ${current} of ${max} - Seconds: ${(ended - started) / 1000}; T/S: ${response.usage.total_tokens / ((ended - started) / 1000)}`);

        return response;
    }

    /**
     * Saves the generated messages to the dataset repository.
     * @param current The current index of processing for logging purposes.
     * @param max The total number of items being processed.
     * @param logger The logger instance for logging operations.
     * @param ds The data source having access to the dataset repository.
     * @param fileName The name of the file associated with the messages.
     * @param messages The array of messages to save.
     * @throws Will throw an error if saving to the dataset repository fails.
     */
    private static async saveMessagesToDataset(current: number, max: number, logger: Logger, ds: EntitiesDataSource, fileName: string, messages: Message[]) {
        let dataset = await ds.datasetRepository().findOneBy({ title: fileName });
        if (!dataset) {
            dataset = new DatasetEntity();
            dataset.guid = UUIDv4.generate();
            dataset.title = fileName;
            dataset.includeInTraining = true;
        }
        dataset.json = JSON.stringify(messages);

        await logger.log(`AiciLogic.saveMessagesToDataset() - ${current} of ${max} - Saving`);
        await ds.datasetRepository().save(dataset);
    }

    /**
     * Generates an explanation for the given file's content by sending a request to the Aici API.
     * @param current The current index in the processing list for logging.
     * @param max The total number of items being processed, used for logging.
     * @param logger The logger instance for logging operations.
     * @param ds The data source to fetch settings and other data.
     * @param fileName The name of the file to be explained.
     * @param fileContents The content of the file to be explained.
     * @returns A promise that resolves to an array of messages containing the explanation.
     * @throws Will throw an error if the chat request fails.
     */
    private static async getExplanation(current: number, max: number, logger: Logger, ds: EntitiesDataSource, fileName: string, fileContents: string): Promise<Message[]> {
        let userMarkdown = "Explain the file '%FILE%':\n\n```\n%CONTENT%\n```";
        userMarkdown = userMarkdown.replace("%FILE%", fileName);
        userMarkdown = userMarkdown.replace("%CONTENT%", fileContents.replace(/`/, "\\`"));

        const messages: Message[] = [{
            role: "user",
            content: userMarkdown
        }];

        const started = Date.now();
        const response = await AiciLogic.chat(ds, messages);
        const ended = Date.now();

        await logger.log(`AiciLogic.getExplanation() - ${current} of ${max} - Input: ${response.usage.prompt_tokens}; New: ${response.usage.completion_tokens}; Total: ${response.usage.total_tokens}`);
        await logger.log(`AiciLogic.getExplanation() - ${current} of ${max} - Seconds: ${(ended - started) / 1000}; T/S: ${response.usage.total_tokens / ((ended - started) / 1000)}`);

        messages.push({
            role: response.choices[0].message.role,
            content: response.choices[0].message.content
        });

        return messages;
    }

    /**
     * Deletes a specified collection from Qdrant and creates a new one with appropriate settings.
     * @param qdrantClient The Qdrant client used to interact with the vector database.
     * @param name The name of the collection to create or recreate.
     * @throws Will throw an error if collection creation or deletion fails.
     */
    private static async deleteAndCreateCollections(qdrantClient: QdrantClient, name: string) {
        let collections = await qdrantClient.getCollections();
        let collectionExists = collections.collections.some((pred) => { return pred.name === name });
        if (collectionExists)
            await qdrantClient.deleteCollection(name);

        await qdrantClient.createCollection(
            name,
            {
                vectors: {
                    size: Config.qdrantVectorSize,
                    distance: "Cosine"
                }
            }
        );
    }

    /**
     * Performs a search by generating an embedding for the input content and querying Qdrant for similar embeddings.
     * Retrieves the top `limit` matching datasets from the database based on the search results.
     * @param logger The logger instance for logging operations.
     * @param ds The data source containing settings and repositories.
     * @param collection The name of the collection to search within.
     * @param content The input content to search for.
     * @param limit The maximum number of results to return from the search.
     * @returns A promise that resolves to an array of matching datasets.
     * @throws Will throw an error if the embedding generation or Qdrant search fails.
     */
    public static async search(logger: Logger, ds: EntitiesDataSource, collection: string, content: string, limit: number): Promise<any> {
        try {
            // Generate embedding for the search content
            const embeddingRequest: EmbeddingRequest = {
                model: Config.embeddingModel,
                input: content
            };
            const embeddingResponse: EmbeddingList = await this.embedding(ds, embeddingRequest);
            const embeddingVector = embeddingResponse.data[0].embedding;

            const qdrantClient = new QdrantClient({
                url: Config.qdrantUrl
            });

            // Perform vector search in Qdrant
            await logger.log(`Performing vector search in Qdrant for content: "${content}"`);
            const searchResponse = await qdrantClient.search(
                collection,
                {
                    vector: embeddingVector,
                    limit: limit
                }
            );

            return searchResponse;
        }
        catch (err) {
            await logger.error(new Error(`Search failed - ${(err as Error).message}`));
            throw err; // Re-throw the error after logging
        }
    }

    /**
     * Sends an embedding request to the Aici API and retrieves the embeddings for the specified input.
     * @param ds The data source containing settings and repositories.
     * @param request The embedding request containing the model and input data.
     * @returns A promise that resolves to the list of embeddings retrieved from the Aici API.
     * @throws Will throw an error if the HTTP request fails or if the response is not ok.
     */
    private static async embedding(ds: EntitiesDataSource, request: EmbeddingRequest): Promise<EmbeddingList> {
        const urlSetting = await ds.settingRepository().findByKey("Aici:URL");
        const apiKeySetting = await ds.settingRepository().findByKey("Aici:API Key");
        const fetchResponse = await fetch(`${urlSetting.value}/v1/embeddings`, {
            method: "POST",
            body: JSON.stringify(request),
            headers: {
                "Authorization": `Bearer ${apiKeySetting.value}`,
                "Content-Type": "application/json"
            }
        });

        if (!fetchResponse.ok) {
            const details = await fetchResponse.text();
            throw new Error(`HTTP Status ${fetchResponse.status} - ${fetchResponse.statusText} - ${details}`);
        }

        const aiResponse = await fetchResponse.json();
        return aiResponse as EmbeddingList;
    }

    /**
     * Retrieves upload logs based on a correlation identifier.
     * @param logger The logger instance for logging operations.
     * @param ds The data source containing repositories.
     * @param corelation The correlation identifier to filter logs.
     * @returns A promise that resolves to an array of log entities corresponding to the correlation identifier.
     */
    public static async getUploadLogs(logger: Logger, ds: EntitiesDataSource, corelation: string): Promise<LogEntity[]> {
        const logs = await ds.logRepository().find({ where: { corelation: corelation }, order: { epoch: "DESC", order: "DESC" } });

        logs.forEach((log) => {
            log.caller = ""; // Anonymizing caller information from logs
        });

        return logs;
    }

    /**
     * Retrieves and filters files from a base directory based on include and exclude regular expressions.
     * @param logger The logger instance for logging operations.
     * @param base The base directory to search for files.
     * @param includeRexExes An array of regular expressions to include files.
     * @param excludeRexExes An array of regular expressions to exclude files.
     * @returns An array of file names that match the include criteria and do not match the exclude criteria.
     */
    private static getFiles(logger: Logger, base: string, includeRexExes: RegExp[], excludeRexExes: RegExp[]): string[] {
        const ret: string[] = [];

        const files = fs.readdirSync(base, { recursive: true, encoding: "utf8" });
        files.sort();

        files.forEach((name: string) => {
            let include = false;
            includeRexExes.forEach((regex) => {
                include = include || regex.test(name.toLowerCase());
            });
            if (!include) {
                logger.log("Not Included - " + name);
                return;
            }

            let exclude = false;
            excludeRexExes.forEach((regex) => {
                exclude = exclude || regex.test(name.toLowerCase());
            });
            if (exclude) {
                logger.log("Excluded - " + name);
                return;
            }

            logger.log("Included - " + name);
            ret.push(name);
        });

        return ret;
    }

    /**
     * Creates an array of regular expressions from a newline-separated string list.
     * @param newlineSepList The newline-separated string list of regex patterns.
     * @returns An array of RegExp objects derived from the input string.
     */
    private static createRegExes(newlineSepList: string): RegExp[] {
        let strs = newlineSepList.trim().split("\n");

        let regexes: RegExp[] = [];
        strs.forEach((str) => {
            const trimmed = str.trim();
            regexes.push(new RegExp(trimmed));
        });

        return regexes;
    }

    /**
     * Extracts a ZIP file to a temporary directory.
     * @param zipFileName The path to the ZIP file to extract.
     * @returns A promise that resolves to the path of the extracted folder.
     * @throws Will throw an error if extraction fails.
     */
    private static async extractZip(zipFileName: string): Promise<string> {
        let uploadFolder = path.join(Config.tempDirectory, zipFileName.replace(path.extname(zipFileName), ""));
        if (fs.existsSync(uploadFolder))
            fs.rmSync(uploadFolder, { recursive: true, force: true });
        fs.mkdirSync(uploadFolder, { recursive: true });

        const ret = uploadFolder;

        uploadFolder = Config.tempDirectory;
        return new Promise((resolve, reject) => {
            const zip = new AdmZip(zipFileName);
            zip.extractAllToAsync(uploadFolder, true, false, () => {
                resolve(uploadFolder);
            });
        });
    }

    /**
     * Saves an uploaded file to the temporary directory after validating its extension.
     * @param upload The upload data containing the file name and contents.
     * @param extension The required file extension.
     * @returns The path to the saved file.
     * @throws Will throw an error if the file name or contents are empty, or if the file extension does not match.
     */
    private static saveUpload(upload: AiciUpload, extension: string | undefined): string {
        const fileName = upload.file;
        const contents = upload.contents;
        if (!fileName || !contents)
            throw new Error("File and/or contents is empty!");

        if (extension && !fileName.toLowerCase().endsWith("." + extension.toLowerCase()))
            throw new Error("File name does not have needed " + extension + " extension!");

        const targetFile = path.join(Config.tempDirectory, fileName);
        if (fs.existsSync(targetFile))
            fs.rmSync(targetFile, { recursive: true, force: true });

        const buffer = Buffer.from(contents, "base64");
        fs.writeFileSync(targetFile, buffer);

        return targetFile;
    }

}