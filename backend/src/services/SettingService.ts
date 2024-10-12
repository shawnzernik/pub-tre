import express from "express";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { BaseService } from "./BaseService";
import { SettingDto } from "common/src/models/SettingDto";
import { SettingEntity } from "../data/SettingEntity";
import { Logger } from "../Logger";

export class SettingService extends BaseService {
    public constructor(logger: Logger, app: express.Express) {
        super();

        logger.trace();

        app.get("/api/v0/setting/:guid", (req, resp) => { this.methodWrapper(req, resp, this.getGuid) });
        app.get("/api/v0/settings", (req, resp) => { this.methodWrapper(req, resp, this.getList) });
        app.post("/api/v0/setting", (req, resp) => { this.methodWrapper(req, resp, this.postSave) });
        app.delete("/api/v0/setting/:guid", (req, resp) => { this.methodWrapper(req, resp, this.deleteGuid) });
    }

    public async getGuid(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<SettingDto | null> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Setting:Read", req, ds);

        const guid = req.params["guid"];
        const ret = await ds.settingRepository().findOneBy({ guid: guid });
        return ret;
    }
    public async getList(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<SettingDto[]> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Setting:List", req, ds);

        const ret = await ds.settingRepository().find();
        return ret;
    }
    public async postSave(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Setting:Save", req, ds);

        const entity = new SettingEntity();
        entity.copyFrom(req.body as SettingDto);
        await ds.settingRepository().save([entity]);
    }
    public async deleteGuid(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Setting:Delete", req, ds);

        const guid = req.params["guid"];
        await ds.settingRepository().delete({ guid: guid });
    }
}