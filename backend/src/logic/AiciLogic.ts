import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { Response } from "common/src/models/aici/Response";
import { Message } from "common/src/models/aici/Message";
import { Config } from "../Config";
import path from "path";
import fs from "fs";
import AdmZip from "adm-zip";
import { DatasetDto } from "common/src/models/DatasetDto";
import { UUIDv4 } from "common/src/logic/UUIDv4";
import { DatasetEntity } from "../data/DatasetEntity";

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

    public static async upload(ds: EntitiesDataSource, body: AiciUpload): Promise<void> {
        const uploadedFile = this.saveUpload(body, "zip");
        const extractedZipFolder = this.extractZip(uploadedFile);

        const includeSettingDto = await ds.settingRepository().findByKey("Aici:Upload:Include");
        const includeRexExes = this.createRegExes(includeSettingDto.value);

        const excludeSettingDto = await ds.settingRepository().findByKey("Aici:Upload:Exclude");
        const excludeRegExes = this.createRegExes(excludeSettingDto.value);

        const files = this.getFiles(extractedZipFolder, includeRexExes, excludeRegExes);
        let logFile = "file,input,new,total,seconds,t/s\n";

        let cnt = 0
        for (let file in files) {
            console.log(`AiciLogic.upload() - ${cnt++} of ${file.length}`);
            console.log(`AiciLogic.upload() - File - ${file}`);

            let userMarkdown = "Explain the file '%FILE%':\n\n```\n%CONTENT%\n```";

            const mdFileName = path.join("~", uploadedFile, file.replace(extractedZipFolder, ""))
            userMarkdown = userMarkdown.replace("%FILE%", mdFileName);

            const fileContents = fs.readFileSync(file, { encoding: "utf8" });
            userMarkdown = userMarkdown.replace("%CONTENT%", fileContents);

            const messages: Message[] = [{
                role: "user",
                content: userMarkdown
            }];

            console.log(`AiciLogic.upload() - AI to Explain`);
            const started = Date.now();
            const response = await AiciLogic.chat(ds, messages);
            const ended = Date.now();

            console.log(`Input: ${response.usage.prompt_tokens}; New: ${response.usage.completion_tokens}; Total: ${response.usage.total_tokens}`);
            console.log(`Seconds: ${(ended - started) / 1000}; T/S: ${response.usage.total_tokens / ((ended - started) / 1000)}`);
            logFile += `${mdFileName},${response.usage.prompt_tokens},${response.usage.completion_tokens},${response.usage.total_tokens},${ended - started / 1000},${response.usage.total_tokens / ((ended - started) / 1000)}\n`;

            console.log(`AiciLogic.upload() - Load/Create Dataset`);
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

            console.log(`AiciLogic.upload() - Saving`);
            ds.datasetRepository().save(dataset);
        }
    }
    private static getFiles(base: string, includeRexExes: RegExp[], excludeRexExes: RegExp[]): string[] {
        const ret: string[] = [];

        const files = fs.readdirSync(base, { recursive: true, encoding: "utf8" });
        files.sort();

        files.forEach((name: string) => {
            let include = false;
            includeRexExes.forEach((regex) => {
                include = include || regex.test(name.toLowerCase());
            });

            if (!include) {
                console.log("AiciLogic.getFiles() - Not Included - " + name);
                return;
            }

            let exclude = false;
            excludeRexExes.forEach((regex) => {
                exclude = exclude || regex.test(name.toLowerCase());
            });

            if (exclude) {
                console.log("AiciLogic.getFiles() - Excluded - " + name);
                return;
            }

            console.log("AiciLogic.getFiles() - Included - " + name);
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
    private static extractZip(zipFileName: string): string {
        const uploadFolder = path.join(Config.tempDirectory, zipFileName.replace(path.extname(zipFileName), ""));

        if (fs.existsSync(uploadFolder))
            fs.rmSync(uploadFolder, { recursive: true, force: true });
        fs.mkdirSync(uploadFolder, { recursive: true });

        const zip = new AdmZip(zipFileName);
        zip.extractAllToAsync(uploadFolder, true, false);

        return uploadFolder;
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