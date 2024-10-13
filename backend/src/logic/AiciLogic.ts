import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { Response } from "common/src/models/aici/Response";
import { Message } from "common/src/models/aici/Message";
import { Config } from "../Config";
import path from "path";
import fs from "fs";
import AdmZip from "adm-zip";
import { UUIDv4 } from "common/src/logic/UUIDv4";
import { DatasetEntity } from "../data/DatasetEntity";
import { Logger } from "../Logger";
import { LogEntity } from "../data/LogEntity";
import { EmbeddingEntity } from "../data/EmbeddingEntity";
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
     * @returns A promise that resolves to the API response.
     * @throws Will throw an error if the HTTP request fails.
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
     * Handles the upload process, including saving the upload, extracting ZIP files, processing files,
     * generating explanations and embeddings, and saving the results to the database.
     * @param logger The logger instance for logging operations.
     * @param do_not_use The data source (deprecated parameter).
     * @param body The upload data containing the file and its contents.
     * @returns A promise that resolves when the upload process is complete.
     */
    public static async upload(logger: Logger, do_not_use: EntitiesDataSource, body: AiciUpload): Promise<void> {
        const ds = new EntitiesDataSource();
        await ds.initialize();
        try {
            const uploadedFile = this.saveUpload(body, "zip");
            const extractedZipFolder = await this.extractZip(uploadedFile);

            const includeSettingDto = await ds.settingRepository().findByKey("Aici:Upload:Include");
            const includeRexExes = this.createRegExes(includeSettingDto.value);

            const excludeSettingDto = await ds.settingRepository().findByKey("Aici:Upload:Exclude");
            const excludeRegExes = this.createRegExes(excludeSettingDto.value);

            const files = this.getFiles(logger, extractedZipFolder, includeRexExes, excludeRegExes);
            let logFile = "file,input,new,total,seconds,t/s\n";

            // store explain for finetune
            let promises: Promise<void>[] = [];
            files.forEach((file, cnt) => {
                promises.push(new Promise(async (resolve) => {
                    try {
                        await logger.log(`Explain ${cnt + 1} of ${files.length}`);
                        await logger.log(`Explain ${cnt + 1} of ${files.length} - ${file}`);

                        let userMarkdown = "Explain the file '%FILE%':\n\n```\n%CONTENT%\n```";

                        const mdFileName = path.join("~", file);
                        userMarkdown = userMarkdown.replace("%FILE%", mdFileName);

                        const fileContents = fs.readFileSync(path.join(extractedZipFolder, file), { encoding: "utf8" });
                        userMarkdown = userMarkdown.replace("%CONTENT%", fileContents.replace(/`/, "\\`"));

                        const messages: Message[] = [{
                            role: "user",
                            content: userMarkdown
                        }];

                        await logger.log(`Explain ${cnt + 1} of ${files.length} - AI to Explain`);
                        const started = Date.now();
                        const response = await AiciLogic.chat(ds, messages);
                        const ended = Date.now();

                        await logger.log(`Explain ${cnt + 1} of ${files.length} - Input: ${response.usage.prompt_tokens}; New: ${response.usage.completion_tokens}; Total: ${response.usage.total_tokens}`);
                        await logger.log(`Explain ${cnt + 1} of ${files.length} - Seconds: ${(ended - started) / 1000}; T/S: ${response.usage.total_tokens / ((ended - started) / 1000)}`);
                        logFile += `${mdFileName},${response.usage.prompt_tokens},${response.usage.completion_tokens},${response.usage.total_tokens},${ended - started / 1000},${response.usage.total_tokens / ((ended - started) / 1000)}\n`;

                        await logger.log(`Explain ${cnt + 1} of ${files.length} - Load/Create Dataset`);
                        messages.push({
                            role: response.choices[0].message.role,
                            content: response.choices[0].message.content
                        });

                        let dataset = await ds.datasetRepository().findOneBy({ title: mdFileName });
                        if (!dataset) {
                            dataset = new DatasetEntity();
                            dataset.guid = UUIDv4.generate();
                            dataset.title = mdFileName;
                            dataset.includeInTraining = true;
                        }
                        dataset.json = JSON.stringify(messages);

                        await logger.log(`Explain ${cnt + 1} of ${files.length} - Saving`);
                        await ds.datasetRepository().save(dataset);
                        resolve();
                    }
                    catch (err) {
                        new Error(`Explain ${cnt + 1} of ${files.length} - ${(err as Error).message}`);
                        await logger.error(err);
                        resolve();
                    }
                }));
            });
            await Promise.all(promises);

            // create embeddings
            const qdrantClient = new QdrantClient({
                url: Config.qdrantUrl
            });

            const collections = await qdrantClient.getCollections();
            let collectionExists = collections.collections.some((pred) => { return pred.name === Config.qdrantCollection });
            if (!collectionExists) {
                await qdrantClient.createCollection(
                    Config.qdrantCollection,
                    {
                        vectors: {
                            size: Config.qdrantVectorSize,
                            distance: "Cosine"
                        }
                    }
                );
            }

            promises = [];
            files.forEach((file, cnt) => {
                promises.push(new Promise(async (resolve) => {
                    try {
                        await logger.log(`Embedding ${cnt + 1} of ${files.length}`);
                        await logger.log(`Embedding ${cnt + 1} of ${files.length} - ${file}`);

                        let userMarkdown = "File '%FILE%':\n\n```\n%CONTENT%\n```";

                        const mdFileName = path.join("~", file);
                        userMarkdown = userMarkdown.replace("%FILE%", mdFileName);

                        const fileContents = fs.readFileSync(path.join(extractedZipFolder, file), { encoding: "utf8" });
                        userMarkdown = userMarkdown.replace("%CONTENT%", fileContents.replace(/`/, "\\`"));

                        const request: EmbeddingRequest = {
                            model: Config.embeddingModel,
                            input: userMarkdown
                        };

                        await logger.log(`Embedding ${cnt + 1} of ${files.length} - AI to Embed`);
                        const started = Date.now();
                        const response: EmbeddingList = await AiciLogic.embedding(ds, request);
                        const ended = Date.now();

                        await logger.log(`Embedding ${cnt + 1} of ${files.length} - Input: ${response.usage.prompt_tokens}; Total: ${response.usage.total_tokens}`);
                        await logger.log(`Embedding ${cnt + 1} of ${files.length} - Seconds: ${(ended - started) / 1000}; T/S: ${response.usage.total_tokens / ((ended - started) / 1000)}`);

                        await logger.log(`Embedding ${cnt + 1} of ${files.length} - Load/Create Dataset`);

                        let embedding = await ds.embeddingRepository().findOneBy({ title: mdFileName });
                        if (!embedding) {
                            embedding = new EmbeddingEntity();
                            embedding.guid = UUIDv4.generate();
                            embedding.title = mdFileName;
                        }
                        embedding.input = request.input as string;
                        embedding.promptTokens = response.usage.prompt_tokens;
                        embedding.totalTokens = response.usage.total_tokens;
                        embedding.embeddingJson = JSON.stringify(response.data[0].embedding);

                        await logger.log(`Embedding ${cnt + 1} of ${files.length} - Saving to Database`);
                        await ds.embeddingRepository().save(embedding);

                        await logger.log(`Embedding ${cnt + 1} of ${files.length} - Saving to Qdrant`);
                        await qdrantClient.upsert(
                            Config.qdrantCollection,
                            {
                                wait: true,
                                points: [
                                    {
                                        id: embedding.guid,
                                        vector: response.data[0].embedding,
                                        payload: {
                                            title: embedding.title,
                                            content: embedding.input,
                                            promptTokens: embedding.promptTokens,
                                            totalTokens: embedding.totalTokens
                                        }
                                    }
                                ]
                            }
                        );

                        resolve();
                    }
                    catch (err) {
                        new Error(`Explain ${cnt + 1} of ${files.length} - ${(err as Error).message}`);
                        await logger.error(err);
                        resolve();
                    }
                }));
            });
            await Promise.all(promises);

            await logger.log("ALL DONE!");
        }
        finally {
            await ds.destroy();
        }
    }

    /**
     * Performs a search by generating an embedding for the input content and querying Qdrant for similar embeddings.
     * Retrieves the top 10 matching datasets from the database based on the search results.
     * @param logger The logger instance for logging operations.
     * @param ds The data source containing settings and repositories.
     * @param content The input content to search for.
     * @returns A promise that resolves to an array of matching datasets.
     * @throws Will throw an error if the embedding generation or Qdrant search fails.
     */
    public static async search(logger: Logger, ds: EntitiesDataSource, content: string, limit: number): Promise<any> {
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
                Config.qdrantCollection,
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
     * Sends an embedding request to the Aici API.
     * @param ds The data source containing settings and repositories.
     * @param request The embedding request containing the model and input data.
     * @returns A promise that resolves to the list of embeddings.
     * @throws Will throw an error if the HTTP request fails.
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
     * @returns A promise that resolves to an array of log entities.
     */
    public static async getUploadLogs(logger: Logger, ds: EntitiesDataSource, corelation: string): Promise<LogEntity[]> {
        const logs = await ds.logRepository().find({ where: { corelation: corelation }, order: { epoch: "DESC", order: "DESC" } });

        logs.forEach((log) => {
            log.caller = "";
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
     * @returns An array of RegExp objects.
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
     */
    private static async extractZip(zipFileName: string): Promise<string> {
        const uploadFolder = path.join(Config.tempDirectory, zipFileName.replace(path.extname(zipFileName), ""));

        if (fs.existsSync(uploadFolder))
            fs.rmSync(uploadFolder, { recursive: true, force: true });
        fs.mkdirSync(uploadFolder, { recursive: true });

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
            throw new Error("File name does have needed " + extension + " extension!");

        const targetFile = path.join(Config.tempDirectory, fileName);
        if (fs.existsSync(targetFile))
            fs.rmSync(targetFile, { recursive: true, force: true });

        const buffer = Buffer.from(contents, "base64");
        fs.writeFileSync(targetFile, buffer);

        return targetFile;
    }

}