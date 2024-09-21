import express from "express";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { BaseService } from "./BaseService";
import { PermissionDto } from "common/src/models/PermissionDto";
import { PermissionEntity } from "../data/PermissionEntity";
import { CheckSecurity } from "./CheckSecurity";

export class PermissionService extends BaseService {
	public constructor(app: express.Express) {
		super();

        console.log("PermissionService.constructor()");

		app.get("/api/v0/permission/:guid", (req, resp) => { this.methodWrapper(req, resp, this.getGuid) });
        app.get("/api/v0/permissions", (req, resp) => { this.methodWrapper(req, resp, this.getList) });
		app.post("/api/v0/permission", (req, resp) => { this.methodWrapper(req, resp, this.postSave) });
		app.delete("/api/v0/permission/:guid", (req, resp) => { this.methodWrapper(req, resp, this.deleteGuid) });
	}

    @CheckSecurity("Permission:Read")
	public async getGuid(req: express.Request, ds: EntitiesDataSource): Promise<PermissionDto | null> {
        console.log("PermissionService.getGuid()");
		const guid = req.params["guid"];
		const ret = await ds.permissionRepository().findOneBy({ guid: guid });
        return ret;
	}

	@CheckSecurity("Permission:List")
	public async getList(req: express.Request, ds: EntitiesDataSource): Promise<PermissionDto[]> {
        console.log("PermissionService.getList()");
		const ret = await ds.permissionRepository().find();
        return ret;
	}

	@CheckSecurity("Permission:Save")
	public async postSave(req: express.Request, ds: EntitiesDataSource): Promise<void> {
        console.log("PermissionService.postSave()");
		const entity = new PermissionEntity();
		entity.copyFrom(req.body as PermissionDto);
		await ds.permissionRepository().save([entity]);
	}

	@CheckSecurity("Permission:Delete")
	public async deleteGuid(req: express.Request, ds: EntitiesDataSource): Promise<void> {
        console.log("PermissionService.deleteGuid()");
		const guid = req.params["guid"];
		await ds.permissionRepository().delete({ guid: guid });
	}
}