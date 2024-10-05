import express from "express";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { BaseService } from "./BaseService";
import { Response as AiciResponse } from "common/src/models/aici/Response";
import { AiciLogic } from "../logic/AiciLogic";

export class AiciService extends BaseService {
    public constructor(app: express.Express) {
        super();

        console.log("AiciService.constructor()");

        app.post("/api/v0/aici/chat", (req, resp) => { this.methodWrapper(req, resp, this.postChat) });
    }

    public async postChat(req: express.Request, ds: EntitiesDataSource): Promise<AiciResponse> {
        console.log("AiciService.postChat()");
        await BaseService.checkSecurity("Aici:Chat", req, ds);

        const aiResponse: AiciResponse = await AiciLogic.chat(ds, req.body);
        return aiResponse;
    }
}