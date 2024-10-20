import express from "express";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { BaseService } from "./BaseService";
import { FinetuneDto } from "common/src/models/FinetuneDto";
import { FinetuneEntity } from "../data/FinetuneEntity";
import { Logger } from "../Logger";
import { ApiLogic } from "../logic/aici/ApiLogic";
import { DatasetLogic } from "../logic/aici/DatasetLogic";

export class FinetuneService extends BaseService {
    public constructor(logger: Logger, app: express.Express) {
        super();

        logger.trace();

        app.get("/api/v0/finetune/:guid", (req, resp) => { this.methodWrapper(req, resp, this.getGuid) });
        app.get("/api/v0/finetunes", (req, resp) => { this.methodWrapper(req, resp, this.getList) });
        app.post("/api/v0/finetune", (req, resp) => { this.methodWrapper(req, resp, this.postSave) });
        app.delete("/api/v0/finetune/:guid", (req, resp) => { this.methodWrapper(req, resp, this.deleteGuid) });
    }

    public async getGuid(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<FinetuneDto | null> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Finetune:Read", req, ds);

        const guid = req.params["guid"];
        const ret = await ds.finetuneRepository().findOneBy({ guid: guid });
        return ret;
    }

    public async getList(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<FinetuneDto[]> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Finetune:List", req, ds);

        const ret = await ds.finetuneRepository().find();
        return ret;
    }

    public async postSave(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Finetune:Save", req, ds);

        const requestDto = req.body as FinetuneDto;

        const entity = new FinetuneEntity();
        entity.copyFrom(requestDto);
        entity.trainingData = await DatasetLogic.createDataset(ds);
        await ds.finetuneRepository().save([entity]);

        entity.trainingFile = await ApiLogic.finetuneUpload(ds, entity.trainingData);
        entity.id = await ApiLogic.finetune(ds, entity);

        await ds.finetuneRepository().save([entity]);
    }

    public async deleteGuid(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Finetune:Delete", req, ds);

        const guid = req.params["guid"];
        await ds.finetuneRepository().delete({ guid: guid });
    }
}