import express from "express";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { BaseService } from "./BaseService";
import { PermissionDto } from "common/src/models/PermissionDto";
import { PermissionEntity } from "../data/PermissionEntity";
import { CheckSecurity } from "./CheckSecurity";

export class PermissionService extends BaseService {
	public constructor(app: express.Express) {
		super();

		app.get("/api/v0/permissions", (req, resp) => { this.methodWrapper(req, resp, this.getList) });
		app.put("/api/v0/permission", (req, resp) => { this.methodWrapper(req, resp, this.putSave) });
		app.delete("/api/v0/permission/:guid", (req, resp) => { this.methodWrapper(req, resp, this.deleteGuid) });
	}

	@CheckSecurity("Permission:List")
	public async getList(req: express.Request, ds: EntitiesDataSource): Promise<PermissionDto[]> {
		return await ds.permissionRepository().find();
	}

	@CheckSecurity("Permission:Save")
	public async putSave(req: express.Request, ds: EntitiesDataSource): Promise<void> {
		const entity = new PermissionEntity();
		entity.copyFrom(req.body as PermissionDto);

		await ds.permissionRepository().save([entity]);
	}

	@CheckSecurity("Permission:Delete")
	public async deleteGuid(req: express.Request, ds: EntitiesDataSource): Promise<void> {
		const guid = req.params["guid"];

		await ds.permissionRepository().delete({ guid: guid });
	}
}