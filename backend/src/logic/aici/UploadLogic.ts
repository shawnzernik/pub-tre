import fs from "fs";
import path from "path";
import { QdrantClient } from "@qdrant/js-client-rest";
import { Config } from "../../Config";
import { VectorLogic } from "./VectorLogic";
import { EntitiesDataSource } from "../../data/EntitiesDataSource";
import { Logger } from "../../Logger";
import { UploadDto } from "../../models/UploadDto";
import AdmZip from "adm-zip";
import { Message } from "common/src/models/aici/Message";
import { DatasetEntity } from "../../data/DatasetEntity";
import { UUIDv4 } from "common/src/logic/UUIDv4";
import { LogEntity } from "../../data/LogEntity";
import { ApiLogic } from "./ApiLogic";

export class UploadLogic {
    public static async getUploadLogs(ds: EntitiesDataSource, corelation: string): Promise<LogEntity[]> {
        const logs = await ds.logRepository().find({ where: { corelation: corelation }, order: { epoch: "DESC", order: "DESC" } });

        logs.forEach((log) => {
            log.caller = "";
        });

        return logs;
    }
    public static async upload(logger: Logger, body: UploadDto): Promise<void> {
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
    private static saveUpload(upload: UploadDto, extension: string | undefined): string {
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