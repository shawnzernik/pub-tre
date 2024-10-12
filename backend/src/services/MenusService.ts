import express from "express";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { BaseService } from "./BaseService";
import { MenuDto } from "common/src/models/MenuDto";
import { MenuEntity } from "../data/MenuEntity";
import { Logger } from "../Logger";

export class MenuService extends BaseService {
    public constructor(logger: Logger, app: express.Express) {
        super();

        logger.trace();

        app.get("/api/v0/menu/:guid", (req, resp) => { this.methodWrapper(req, resp, this.getGuid) });
        app.get("/api/v0/menus", (req, resp) => { this.methodWrapper(req, resp, this.getList) });
        app.post("/api/v0/menu", (req, resp) => { this.methodWrapper(req, resp, this.postSave) });
        app.delete("/api/v0/menu/:guid", (req, resp) => { this.methodWrapper(req, resp, this.deleteGuid) });
    }

    public async getGuid(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<MenuDto | null> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Menu:Read", req, ds);

        const guid = req.params["guid"];
        const ret = await ds.menuRepository().findOneBy({ guid: guid });
        return ret;
    }
    public async getList(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<MenuDto[]> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Menu:List", req, ds);

        const ret = await ds.menuRepository().find();
        return ret;
    }
    public async postSave(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Menu:Save", req, ds);

        const entity = new MenuEntity();
        entity.copyFrom(req.body as MenuDto);
        await ds.menuRepository().save([entity]);
    }
    public async deleteGuid(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Menu:Delete", req, ds);

        const guid = req.params["guid"];
        const results = await ds.menuRepository().delete({ guid: guid });
        if (results.affected != 1)
            throw Error(`Affected rows = ${results.affected}!`);
    }
}