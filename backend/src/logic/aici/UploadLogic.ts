import fs from "fs";
import path from "path";
import AdmZip from "adm-zip";
import { QdrantClient } from "@qdrant/js-client-rest";
import { Config } from "../../Config";
import { VectorLogic } from "./VectorLogic";
import { EntitiesDataSource } from "../../data/EntitiesDataSource";
import { Logger } from "../../Logger";
import { Message } from "common/src/models/aici/Message";
import { DatasetEntity } from "../../data/DatasetEntity";
import { UUIDv4 } from "common/src/logic/UUIDv4";
import { LogEntity } from "../../data/LogEntity";
import { ApiLogic } from "./ApiLogic";
import { File as AiciFile } from "common/src/models/aici/File";

export class UploadLogic {
    public static async getUploadLogs(ds: EntitiesDataSource, corelation: string): Promise<LogEntity[]> {
        const logs = await ds.logRepository().find({ where: { corelation: corelation }, order: { epoch: "DESC", order: "DESC" } });

        logs.forEach((log) => {
            log.caller = "";
        });

        return logs;
    }
    public static async download(logger: Logger, ds: EntitiesDataSource, body: AiciFile): Promise<AiciFile> {
        if (!body.file || body.file === "undefined")
            throw new Error("You must provide a file name!");

        let file: AiciFile | null = null;
        file = UploadLogic.downloadFile(ds, body.file);
        if (file)
            return file;

        file = await UploadLogic.downloadVector(ds, Config.qdrantNameCollection, body.file);
        if (file)
            return file;

        throw new Error(`Could not locate file or embedding by name '${body.file}'!`);
    }
    private static async downloadVector(ds: EntitiesDataSource, collection: string, file: string): Promise<AiciFile | null> {
        let vector = await VectorLogic.search(ds, collection, file, 1);

        if (vector[0].score < 0.75)
            throw new Error(`File '${file}' not found with confidence!`);

        return {
            file: vector[0].payload.title,
            contents: vector[0].payload.content
        };
    }
    private static downloadFile(ds: EntitiesDataSource, requested: string): AiciFile | null {
        let file = requested;
        if (file.startsWith("~/"))
            file = path.join(Config.tempDirectory, file.substring(2, file.length));

        file = path.resolve(file);
        const temp = path.resolve(Config.tempDirectory);
        if (!file.startsWith(temp))
            return null;
        if (!fs.existsSync(file))
            return null;

        return {
            file: file,
            contents: fs.readFileSync(file, { encoding: "utf8" })
        }
    }
    public static async upload(logger: Logger, body: AiciFile): Promise<void> {
        const ds = new EntitiesDataSource();
        await ds.initialize();
        try {
            await ds.datasetRepository().createQueryBuilder().delete()
                .from("datasets")
                .where("is_uploaded = TRUE")
                .execute();

            const qdrantClient = new QdrantClient({
                url: Config.qdrantUrl
            });

            await VectorLogic.deleteAndCreateCollections(qdrantClient, Config.qdrantContentCollection);
            await VectorLogic.deleteAndCreateCollections(qdrantClient, Config.qdrantExplanationCollection);
            await VectorLogic.deleteAndCreateCollections(qdrantClient, Config.qdrantNameCollection);

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

                        const messages: Message[] = await ApiLogic.getExplanation(cnt + 1, files.length, logger, ds, fileName, fileContents);
                        await this.saveMessagesToDataset(ds, fileName, messages);

                        let embeddingResponse;
                        if (fileContents.length / Config.embeddingBytesPerToken > Config.embeddingMaxTokens)
                            errors.push(`Aici.upload() - ${cnt + 1} of ${files.length} - ${fileName} - content.tokens > ${Config.embeddingMaxTokens}`);
                        if (fileContents.length / Config.embeddingBytesPerToken > Config.embeddingMaxTokens)
                            errors.push(`Aici.upload() - ${cnt + 1} of ${files.length} - ${fileName} - explanation.tokens > ${Config.embeddingMaxTokens}`);

                        if (!(
                            fileContents.length / Config.embeddingBytesPerToken > Config.embeddingMaxTokens
                            || fileContents.length / Config.embeddingBytesPerToken > Config.embeddingMaxTokens
                        )) {
                            try {
                                embeddingResponse = await ApiLogic.getEmbedding(ds, fileName);
                                await VectorLogic.saveToVectorDb(qdrantClient, Config.qdrantNameCollection, embeddingResponse, fileName, fileContents);
                            }
                            catch (err) {
                                errors.push(`Aici.upload() - ${cnt + 1} of ${files.length} - ${fileName} - name ERROR: ${(err as Error).message}`);
                            }

                            try {
                                embeddingResponse = await ApiLogic.getEmbedding(ds, fileContents);
                                await VectorLogic.saveToVectorDb(qdrantClient, Config.qdrantContentCollection, embeddingResponse, fileName, fileContents);
                            }
                            catch (err) {
                                errors.push(`Aici.upload() - ${cnt + 1} of ${files.length} - ${fileName} - content ERROR: ${(err as Error).message}`);
                            }

                            try {
                                const explanation = messages[messages.length - 1].content;
                                embeddingResponse = await ApiLogic.getEmbedding(ds, explanation);
                                await VectorLogic.saveToVectorDb(qdrantClient, Config.qdrantExplanationCollection, embeddingResponse, fileName, explanation);
                            }
                            catch (err) {
                                errors.push(`Aici.upload() - ${cnt + 1} of ${files.length} - ${fileName} - explanation ERROR: ${(err as Error).message}`);
                            }
                        }

                        await logger.log(`Aici.upload() - COMPLETED ${resolved + 1} of ${files.length}`);
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
                await logger.error(errors[cnt]);

            await logger.log("ALL DONE!");
        }
        finally {
            await ds.destroy();
        }
    }
    private static saveUpload(upload: AiciFile, extension: string | undefined): string {
        if (!fs.existsSync(Config.tempDirectory))
            fs.mkdirSync(Config.tempDirectory, { recursive: true });

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
                logger.log("(-) " + name);
                return;
            }

            let exclude = false;
            excludeRexExes.forEach((regex) => {
                exclude = exclude || regex.test(name.toLowerCase());
            });
            if (exclude) {
                logger.log("(-) " + name);
                return;
            }

            logger.log("(+) " + name);
            ret.push(name);
        });

        return ret;
    }
    private static async saveMessagesToDataset(ds: EntitiesDataSource, fileName: string, messages: Message[]) {
        let dataset = await ds.datasetRepository().findOneBy({ title: fileName });
        if (!dataset) {
            dataset = new DatasetEntity();
            dataset.guid = UUIDv4.generate();
            dataset.title = fileName;
            dataset.includeInTraining = true;
        }
        dataset.json = JSON.stringify(messages);

        await ds.datasetRepository().save(dataset);
    }
    private static createRegExes(newlineSepList: string): RegExp[] {
        let strs = newlineSepList.trim().split("\n");

        let regexes: RegExp[] = [];
        strs.forEach((str) => {
            const trimmed = str.trim();
            regexes.push(new RegExp(trimmed));
        });

        return regexes;
    }
}