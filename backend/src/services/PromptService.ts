import express from "express";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { BaseService } from "./BaseService";
import { PromptDto } from "common/src/models/PromptDto";
import { PromptEntity } from "../data/PromptEntity";
import { Logger } from "../Logger";

export class PromptService extends BaseService {
    public constructor(logger: Logger, app: express.Express) {
        super();

        logger.trace();

        app.get("/api/v0/prompt/:guid", (req, resp) => { this.methodWrapper(req, resp, this.getGuid) });
        app.get("/api/v0/prompts", (req, resp) => { this.methodWrapper(req, resp, this.getList) });
        app.post("/api/v0/prompt", (req, resp) => { this.methodWrapper(req, resp, this.postSave) });
        app.delete("/api/v0/prompt/:guid", (req, resp) => { this.methodWrapper(req, resp, this.deleteGuid) });
    }

    public async getGuid(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<PromptDto | null> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Prompt:Read", req, ds);

        const guid = req.params["guid"];
        const ret = await ds.promptRepository().findOneBy({ guid: guid });
        return ret;
    }

    public async getList(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<PromptDto[]> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Prompt:List", req, ds);

        const ret = await ds.promptRepository().find();
        return ret;
    }

    public async postSave(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Prompt:Save", req, ds);

        const entity = new PromptEntity();
        entity.copyFrom(req.body as PromptDto);
        await ds.promptRepository().save([entity]);
    }

    public async deleteGuid(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Prompt:Delete", req, ds);

        const guid = req.params["guid"];
        await ds.promptRepository().delete({ guid: guid });
    }
}