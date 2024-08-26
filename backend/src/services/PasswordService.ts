import express from "express";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { BaseService } from "./BaseService";
import { PasswordDto } from "common/src/models/PasswordDto";
import { PasswordEntity } from "../data/PasswordEntity";
import { CheckSecurity } from "./CheckSecurity";

export class PasswordService extends BaseService {
	public constructor(app: express.Express) {
		super();

		app.get("/api/v0/passwords", (req, resp) => { this.methodWrapper(req, resp, this.getList) });
		app.put("/api/v0/password", (req, resp) => { this.methodWrapper(req, resp, this.putSave) });
		app.delete("/api/v0/password/:guid", (req, resp) => { this.methodWrapper(req, resp, this.deleteGuid) });
	}

	@CheckSecurity("Password:List")
	public async getList(req: express.Request, ds: EntitiesDataSource): Promise<PasswordDto[]> {
		return await ds.passwordRepository().find();
	}

	@CheckSecurity("Password:Save")
	public async putSave(req: express.Request, ds: EntitiesDataSource): Promise<void> {
		const entity = new PasswordEntity();
		entity.copyFrom(req.body as PasswordDto);

		await ds.passwordRepository().save([entity]);
	}

	@CheckSecurity("Password:Delete")
	public async deleteGuid(req: express.Request, ds: EntitiesDataSource): Promise<void> {
		const guid = req.params["guid"];

		await ds.passwordRepository().delete({ guid: guid });
	}
}