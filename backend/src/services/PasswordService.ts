import express from "express";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { BaseService } from "./BaseService";
import { PasswordDto } from "common/src/models/PasswordDto";
import { PasswordEntity } from "../data/PasswordEntity";

export class PasswordService extends BaseService {
	public constructor(app: express.Express) {
		super();

        console.log("PasswordService.constructor()");

		app.get("/api/v0/password/:guid", (req, resp) => { this.methodWrapper(req, resp, this.getGuid) });
        app.get("/api/v0/passwords", (req, resp) => { this.methodWrapper(req, resp, this.getList) });
		app.post("/api/v0/password", (req, resp) => { this.methodWrapper(req, resp, this.postSave) });
		app.delete("/api/v0/password/:guid", (req, resp) => { this.methodWrapper(req, resp, this.deleteGuid) });
	}

	public async getGuid(req: express.Request, ds: EntitiesDataSource): Promise<PasswordDto | null> {
        console.log("PasswordService.getGuid()");
        await BaseService.checkSecurity("Password:Read", req, ds);

		const guid = req.params["guid"];
		const ret = await ds.passwordRepository().findOneBy({ guid: guid });
        return ret;
	}
	public async getList(req: express.Request, ds: EntitiesDataSource): Promise<PasswordDto[]> {
        console.log("PasswordService.getList()");
        await BaseService.checkSecurity("Password:List", req, ds);

		const ret = await ds.passwordRepository().find();
        return ret;
	}
	public async postSave(req: express.Request, ds: EntitiesDataSource): Promise<void> {
        console.log("PasswordService.postSave()");
        await BaseService.checkSecurity("Password:Save", req, ds);

		const entity = new PasswordEntity();
		entity.copyFrom(req.body as PasswordDto);
		await ds.passwordRepository().save([entity]);
	}
	public async deleteGuid(req: express.Request, ds: EntitiesDataSource): Promise<void> {
        console.log("PasswordService.deleteGuid()");
        await BaseService.checkSecurity("Password:Delete", req, ds);

		const guid = req.params["guid"];
		await ds.passwordRepository().delete({ guid: guid });
	}
}