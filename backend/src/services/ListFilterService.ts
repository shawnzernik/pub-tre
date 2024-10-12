import express from "express";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { BaseService } from "./BaseService";
import { ListFilterDto } from "common/src/models/ListFilterDto";
import { ListFilterEntity } from "../data/ListFilterEntity";
import { Logger } from "../Logger";

export class ListFilterService extends BaseService {
    public constructor(logger: Logger, app: express.Express) {
        super();

        logger.trace();

        app.get("/api/v0/list_filter/:guid", (req, resp) => { this.methodWrapper(req, resp, this.getGuid) });
        app.get("/api/v0/list_filters", (req, resp) => { this.methodWrapper(req, resp, this.getList) });
        app.post("/api/v0/list_filter", (req, resp) => { this.methodWrapper(req, resp, this.postSave) });
        app.delete("/api/v0/list_filter/:guid", (req, resp) => { this.methodWrapper(req, resp, this.deleteGuid) });
    }

    public async getGuid(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<ListFilterDto | null> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "ListFilter:Read", req, ds);

        const guid = req.params["guid"];
        const ret = await ds.listFilterRepository().findOneBy({ guid: guid });
        return ret;
    }
    public async getList(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<ListFilterDto[]> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "ListFilter:List", req, ds);

        const ret = await ds.listFilterRepository().find();
        return ret;
    }
    public async postSave(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "ListFilter:Save", req, ds);

        const entity = new ListFilterEntity();
        entity.copyFrom(req.body as ListFilterDto);
        await ds.listFilterRepository().save([entity]);
    }
    public async deleteGuid(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "ListFilter:Delete", req, ds);

        const guid = req.params["guid"];
        await ds.listFilterRepository().delete({ guid: guid });
    }
}