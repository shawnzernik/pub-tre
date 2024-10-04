import express from "express";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { BaseService } from "./BaseService";
import { Response as AiciResponse } from "common/src/models/aici/Response";

export class AiciService extends BaseService {
    public constructor(app: express.Express) {
        super();

        console.log("AiciService.constructor()");

        app.post("/api/v0/aici/chat", (req, resp) => { this.methodWrapper(req, resp, this.postChat) });
    }

    public async postChat(req: express.Request, ds: EntitiesDataSource): Promise<AiciResponse> {
        console.log("AiciService.postChat()");
        await BaseService.checkSecurity("Aici:Chat", req, ds);

        const modelSetting = await ds.settingRepository().findByKey("Aici:Model");
        const urlSetting = await ds.settingRepository().findByKey("Aici:URL");
        const apiKeySetting = await ds.settingRepository().findByKey("Aici:API Key");

        const request = {
            model: modelSetting.value,
            messages: req.body
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
        return aiResponse as AiciResponse;
    }
}