import express from "express";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { BaseService } from "./BaseService";
import { Response as AiciResponse } from "common/src/models/aici/Response";
import { AiciLogic } from "../logic/AiciLogic";
import { Logger } from "../Logger";
import { LogDto } from "common/src/models/LogDto";

export class AiciService extends BaseService {
    public constructor(logger: Logger, app: express.Express) {
        super();

        logger.trace()

        app.post("/api/v0/aici/chat", (req, resp) => { this.methodWrapper(req, resp, this.postChat) });
        app.post("/api/v0/aici/upload", (req, resp) => { this.methodWrapper(req, resp, this.postUpload) });
        app.get("/api/v0/aici/upload/:corelation", (req, resp) => { this.methodWrapper(req, resp, this.getUpload) });
        app.post("/api/v0/aici/embedding", (req, resp) => { this.methodWrapper(req, resp, this.postEmbedding) });
    }

    public async postChat(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<AiciResponse> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Aici:Chat", req, ds);

        const aiResponse: AiciResponse = await AiciLogic.chat(ds, req.body);
        return aiResponse;
    }
    public async postUpload(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Aici:Upload", req, ds);

        AiciLogic.upload(logger, ds, req.body);
    }
    public async getUpload(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<LogDto[]> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Aici:Upload", req, ds);

        const corelation = req.params["corelation"];
        const ret = await AiciLogic.getUploadLogs(logger, ds, corelation);
        return ret;
    }
    public async postEmbedding(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Aici:Embedding", req, ds);

        await AiciLogic.upload(logger, ds, req.body);
    }
}