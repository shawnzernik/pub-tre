import express from "express";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { BaseService } from "./BaseService";
import { DatasetDto } from "common/src/models/DatasetDto";
import { DatasetEntity } from "../data/DatasetEntity";

export class DatasetService extends BaseService {
    public constructor(app: express.Express) {
        super();

        console.log("DatasetService.constructor()");

        app.get("/api/v0/dataset/:guid", (req, resp) => { this.methodWrapper(req, resp, this.getGuid) });
        app.get("/api/v0/datasets", (req, resp) => { this.methodWrapper(req, resp, this.getList) });
        app.post("/api/v0/dataset", (req, resp) => { this.methodWrapper(req, resp, this.postSave) });
        app.delete("/api/v0/dataset/:guid", (req, resp) => { this.methodWrapper(req, resp, this.deleteGuid) });
    }

    public async getGuid(req: express.Request, ds: EntitiesDataSource): Promise<DatasetDto | null> {
        console.log("DatasetService.getGuid()");
        await BaseService.checkSecurity("Dataset:Read", req, ds);

        const guid = req.params["guid"];
        const ret = await ds.datasetRepository().findOneBy({ guid: guid });
        return ret;
    }

    public async getList(req: express.Request, ds: EntitiesDataSource): Promise<DatasetDto[]> {
        console.log("DatasetService.getList()");
        await BaseService.checkSecurity("Dataset:List", req, ds);

        const ret = await ds.datasetRepository().find();
        return ret;
    }

    public async postSave(req: express.Request, ds: EntitiesDataSource): Promise<void> {
        console.log("DatasetService.postSave()");
        await BaseService.checkSecurity("Dataset:Save", req, ds);

        const entity = new DatasetEntity();
        entity.copyFrom(req.body as DatasetDto);
        await ds.datasetRepository().save([entity]);
    }

    public async deleteGuid(req: express.Request, ds: EntitiesDataSource): Promise<void> {
        console.log("DatasetService.deleteGuid()");
        await BaseService.checkSecurity("Dataset:Delete", req, ds);

        const guid = req.params["guid"];
        await ds.datasetRepository().delete({ guid: guid });
    }
}