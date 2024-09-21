import express from "express";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { BaseService } from "./BaseService";
import { ListFilterDto } from "common/src/models/ListFilterDto";
import { ListFilterEntity } from "../data/ListFilterEntity";
import { CheckSecurity } from "./CheckSecurity";

export class ListFilterService extends BaseService {
    public constructor(app: express.Express) {
        super();

        console.log("ListFilterService.constructor()");

        app.get("/api/v0/list_filter/:guid", (req, resp) => { this.methodWrapper(req, resp, this.getGuid) });
        app.get("/api/v0/list_filters", (req, resp) => { this.methodWrapper(req, resp, this.getList) });
        app.post("/api/v0/list_filter", (req, resp) => { this.methodWrapper(req, resp, this.postSave) });
        app.delete("/api/v0/list_filter/:guid", (req, resp) => { this.methodWrapper(req, resp, this.deleteGuid) });
    }

    @CheckSecurity("ListFilter:Read")
    public async getGuid(req: express.Request, ds: EntitiesDataSource): Promise<ListFilterDto | null> {
        console.log("ListFilterService.getGuid()");
        const guid = req.params["guid"];
        const ret = await ds.listFilterRepository().findOneBy({ guid: guid });
        return ret;
    }

    @CheckSecurity("ListFilter:List")
    public async getList(req: express.Request, ds: EntitiesDataSource): Promise<ListFilterDto[]> {
        console.log("ListFilterService.getList()");
        const ret = await ds.listFilterRepository().find();
        return ret;
    }

    @CheckSecurity("ListFilter:Save")
    public async postSave(req: express.Request, ds: EntitiesDataSource): Promise<void> {
        console.log("ListFilterService.postSave()");
        const entity = new ListFilterEntity();
        entity.copyFrom(req.body as ListFilterDto);
        await ds.listFilterRepository().save([entity]);
    }

    @CheckSecurity("ListFilter:Delete")
    public async deleteGuid(req: express.Request, ds: EntitiesDataSource): Promise<void> {
        console.log("ListFilterService.deleteGuid()");
        const guid = req.params["guid"];
        await ds.listFilterRepository().delete({ guid: guid });
    }
}