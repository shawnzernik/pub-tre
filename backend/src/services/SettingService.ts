import express from "express";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { BaseService } from "./BaseService";
import { SettingDto } from "common/src/models/SettingDto";
import { SettingEntity } from "../data/SettingEntity";

export class SettingService extends BaseService {
    public constructor(app: express.Express) {
        super();

        console.log("SettingService.constructor()");

        app.get("/api/v0/setting/:guid", (req, resp) => { this.methodWrapper(req, resp, this.getGuid) });
        app.get("/api/v0/settings", (req, resp) => { this.methodWrapper(req, resp, this.getList) });
        app.post("/api/v0/setting", (req, resp) => { this.methodWrapper(req, resp, this.postSave) });
        app.delete("/api/v0/setting/:guid", (req, resp) => { this.methodWrapper(req, resp, this.deleteGuid) });
    }

    public async getGuid(req: express.Request, ds: EntitiesDataSource): Promise<SettingDto | null> {
        console.log("SettingService.getGuid()");
        await BaseService.checkSecurity("Setting:Read", req, ds);

        const guid = req.params["guid"];
        const ret = await ds.settingRepository().findOneBy({ guid: guid });
        return ret;
    }
    public async getList(req: express.Request, ds: EntitiesDataSource): Promise<SettingDto[]> {
        console.log("SettingService.getList()");
        await BaseService.checkSecurity("Setting:List", req, ds);

        const ret = await ds.settingRepository().find();
        return ret;
    }
    public async postSave(req: express.Request, ds: EntitiesDataSource): Promise<void> {
        console.log("SettingService.postSave()");
        await BaseService.checkSecurity("Setting:Save", req, ds);

        const entity = new SettingEntity();
        entity.copyFrom(req.body as SettingDto);
        await ds.settingRepository().save([entity]);
    }
    public async deleteGuid(req: express.Request, ds: EntitiesDataSource): Promise<void> {
        console.log("SettingService.deleteGuid()");
        await BaseService.checkSecurity("Setting:Delete", req, ds);

        const guid = req.params["guid"];
        await ds.settingRepository().delete({ guid: guid });
    }
}