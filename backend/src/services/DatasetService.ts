import express from "express";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { BaseService } from "./BaseService";
import { DatasetDto } from "common/src/models/DatasetDto";
import { DatasetEntity } from "../data/DatasetEntity";
import { Logger } from "../Logger";

export class DatasetService extends BaseService {
    public constructor(logger: Logger, app: express.Express) {
        super();

        logger.trace();

        app.get("/api/v0/dataset/:guid", (req, resp) => { this.methodWrapper(req, resp, this.getGuid) });
        app.get("/api/v0/datasets", (req, resp) => { this.methodWrapper(req, resp, this.getList) });
        app.post("/api/v0/dataset", (req, resp) => { this.methodWrapper(req, resp, this.postSave) });
        app.delete("/api/v0/dataset/:guid", (req, resp) => { this.methodWrapper(req, resp, this.deleteGuid) });
    }

    public async getGuid(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<DatasetDto | null> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Dataset:Read", req, ds);

        const guid = req.params["guid"];
        const ret = await ds.datasetRepository().findOneBy({ guid: guid });
        return ret;
    }

    public async getList(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<DatasetDto[]> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Dataset:List", req, ds);

        const ret = await ds.datasetRepository().find();
        return ret;
    }

    public async postSave(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Dataset:Save", req, ds);

        const entity = new DatasetEntity();
        entity.copyFrom(req.body as DatasetDto);
        await ds.datasetRepository().save([entity]);
    }

    public async deleteGuid(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Dataset:Delete", req, ds);

        const guid = req.params["guid"];
        await ds.datasetRepository().delete({ guid: guid });
    }
}