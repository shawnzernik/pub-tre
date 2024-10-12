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

export interface AiciUpload {
    file: string;
    contents: string;
}

export class AiciLogic {
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

            const promises: Promise<void>[] = [];
            files.forEach((file, cnt) => {
                promises.push(new Promise(async (resolve) => {
                    try {
                        await logger.log(`File ${cnt + 1} of ${files.length}`);
                        await logger.log(`File ${cnt + 1} of ${files.length} - ${file}`);

                        let userMarkdown = "Explain the file '%FILE%':\n\n```\n%CONTENT%\n```";

                        const mdFileName = path.join("~", file);
                        userMarkdown = userMarkdown.replace("%FILE%", mdFileName);

                        const fileContents = fs.readFileSync(path.join(extractedZipFolder, file), { encoding: "utf8" });
                        userMarkdown = userMarkdown.replace("%CONTENT%", fileContents.replace(/`/, "\\`"));

                        const messages: Message[] = [{
                            role: "user",
                            content: userMarkdown
                        }];

                        await logger.log(`File ${cnt + 1} of ${files.length} - AI to Explain`);
                        const started = Date.now();
                        const response = await AiciLogic.chat(ds, messages);
                        const ended = Date.now();

                        await logger.log(`File ${cnt + 1} of ${files.length} - Input: ${response.usage.prompt_tokens}; New: ${response.usage.completion_tokens}; Total: ${response.usage.total_tokens}`);
                        await logger.log(`File ${cnt + 1} of ${files.length} - Seconds: ${(ended - started) / 1000}; T/S: ${response.usage.total_tokens / ((ended - started) / 1000)}`);
                        logFile += `${mdFileName},${response.usage.prompt_tokens},${response.usage.completion_tokens},${response.usage.total_tokens},${ended - started / 1000},${response.usage.total_tokens / ((ended - started) / 1000)}\n`;

                        await logger.log(`File ${cnt + 1} of ${files.length} - Load/Create Dataset`);
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

                        await logger.log(`File ${cnt + 1} of ${files.length} - Saving`);
                        await ds.datasetRepository().save(dataset);
                        resolve();
                    }
                    catch (err) {
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
    public static async getUploadLogs(logger: Logger, ds: EntitiesDataSource, corelation: string): Promise<LogEntity[]> {
        const logs = await ds.logRepository().find({ where: { corelation: corelation }, order: { epoch: "DESC", order: "DESC" } });

        logs.forEach((log) => {
            log.caller = "";
        });

        return logs;
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
    private static createRegExes(newlineSepList: string) {
        let strs = newlineSepList.trim().split("\n");

        let regexes: RegExp[] = [];
        strs.forEach((str) => {
            const trimmed = str.trim();
            regexes.push(new RegExp(trimmed));
        });

        return regexes;
    }
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