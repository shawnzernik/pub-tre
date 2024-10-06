import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { Response } from "common/src/models/aici/Response";
import { Message } from "common/src/models/aici/Message";
import { Config } from "../Config";
import path from "path";
import fs from "fs"

export interface AiciUpload {
    file: string;
    contents: string;
}

export class AiciLogic {
    static async chat(ds: EntitiesDataSource, body: Message[]): Promise<Response> {
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

    static async upload(ds: EntitiesDataSource, body: AiciUpload): Promise<void> {
        const fileName = body.file;
        const contents = body.contents;
        if (!fileName || !contents)
            throw new Error("File and/or contents is empty!");

        const uploadedFile = path.join(Config.tempDirectory, fileName);
        const buffer = Buffer.from(contents, "base64");
        fs.writeFileSync(uploadedFile, buffer);
    }
}