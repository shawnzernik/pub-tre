import express from "express";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { BaseService } from "./BaseService";
import { PermissionDto } from "common/src/models/PermissionDto";
import { PermissionEntity } from "../data/PermissionEntity";
import { PermissionLogic } from "../logic/PermissionLogic";

export class PermissionService extends BaseService {
    public constructor(app: express.Express) {
        super();

        console.log("PermissionService.constructor()");

        app.get("/api/v0/permission/:guid", (req, resp) => { this.methodWrapper(req, resp, this.getGuid) });
        app.get("/api/v0/permissions", (req, resp) => { this.methodWrapper(req, resp, this.getList) });
        app.post("/api/v0/permission", (req, resp) => { this.methodWrapper(req, resp, this.postSave) });
        app.delete("/api/v0/permission/:guid", (req, resp) => { this.methodWrapper(req, resp, this.deleteGuid) });

        app.get("/api/v0/group/:guid/permissions", (req, resp) => { this.methodWrapper(req, resp, this.getGroupPermissions) });
        app.get("/api/v0/securable/:guid/permissions", (req, resp) => { this.methodWrapper(req, resp, this.getSecurablePermissions) });
    }

    public async getGroupPermissions(req: express.Request, ds: EntitiesDataSource): Promise<PermissionDto[]> {
        console.log("PermissionService.getGroupPermissions()");
        await BaseService.checkSecurity("Permission:Read", req, ds);

        const guid = req.params["guid"];
        const ret = await PermissionLogic.getGroupPermissions(ds, guid);
        return ret;
    }
    public async getSecurablePermissions(req: express.Request, ds: EntitiesDataSource): Promise<PermissionDto[]> {
        console.log("PermissionService.getSecurablePermissions()");
        await BaseService.checkSecurity("Permission:Read", req, ds);

        const guid = req.params["guid"];
        const ret = await PermissionLogic.getSecurablePermissions(ds, guid);
        return ret;
    }
    public async getGuid(req: express.Request, ds: EntitiesDataSource): Promise<PermissionDto | null> {
        console.log("PermissionService.getGuid()");
        await BaseService.checkSecurity("Permission:Read", req, ds);

        const guid = req.params["guid"];
        const ret = await ds.permissionRepository().findOneBy({ guid: guid });
        return ret;
    }
    public async getList(req: express.Request, ds: EntitiesDataSource): Promise<PermissionDto[]> {
        console.log("PermissionService.getList()");
        await BaseService.checkSecurity("Permission:List", req, ds);

        const ret = await ds.permissionRepository().find();
        return ret;
    }
    public async postSave(req: express.Request, ds: EntitiesDataSource): Promise<void> {
        console.log("PermissionService.postSave()");
        await BaseService.checkSecurity("Permission:Save", req, ds);

        const entity = new PermissionEntity();
        entity.copyFrom(req.body as PermissionDto);
        await ds.permissionRepository().save([entity]);
    }
    public async deleteGuid(req: express.Request, ds: EntitiesDataSource): Promise<void> {
        console.log("PermissionService.deleteGuid()");
        await BaseService.checkSecurity("Permission:Delete", req, ds);

        const guid = req.params["guid"];
        await ds.permissionRepository().delete({ guid: guid });
    }
}