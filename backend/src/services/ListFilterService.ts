import express from "express";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { BaseService } from "./BaseService";
import { ListFilterDto } from "common/src/models/ListFilterDto";
import { ListFilterEntity } from "../data/ListFilterEntity";

export class ListFilterService extends BaseService {
    public constructor(app: express.Express) {
        super();

        console.log("ListFilterService.constructor()");

        app.get("/api/v0/list_filter/:guid", (req, resp) => { this.methodWrapper(req, resp, this.getGuid) });
        app.get("/api/v0/list_filters", (req, resp) => { this.methodWrapper(req, resp, this.getList) });
        app.post("/api/v0/list_filter", (req, resp) => { this.methodWrapper(req, resp, this.postSave) });
        app.delete("/api/v0/list_filter/:guid", (req, resp) => { this.methodWrapper(req, resp, this.deleteGuid) });
    }

    public async getGuid(req: express.Request, ds: EntitiesDataSource): Promise<ListFilterDto | null> {
        console.log("ListFilterService.getGuid()");
        await BaseService.checkSecurity("ListFilter:Read", req, ds);

        const guid = req.params["guid"];
        const ret = await ds.listFilterRepository().findOneBy({ guid: guid });
        return ret;
    }
    public async getList(req: express.Request, ds: EntitiesDataSource): Promise<ListFilterDto[]> {
        console.log("ListFilterService.getList()");
        await BaseService.checkSecurity("ListFilter:List", req, ds);

        const ret = await ds.listFilterRepository().find();
        return ret;
    }
    public async postSave(req: express.Request, ds: EntitiesDataSource): Promise<void> {
        console.log("ListFilterService.postSave()");
        await BaseService.checkSecurity("ListFilter:Save", req, ds);

        const entity = new ListFilterEntity();
        entity.copyFrom(req.body as ListFilterDto);
        await ds.listFilterRepository().save([entity]);
    }
    public async deleteGuid(req: express.Request, ds: EntitiesDataSource): Promise<void> {
        console.log("ListFilterService.deleteGuid()");
        await BaseService.checkSecurity("ListFilter:Delete", req, ds);

        const guid = req.params["guid"];
        await ds.listFilterRepository().delete({ guid: guid });
    }
}