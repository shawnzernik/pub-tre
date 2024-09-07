import express from "express";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { BaseService } from "./BaseService";
import { GroupDto } from "common/src/models/GroupDto";

export class AuthService extends BaseService {
	public constructor(app: express.Express) {
		super();

		app.post("/api/v0/auth/login", (req, resp) => { this.methodWrapper(req, resp, this.postLogin) });
		app.post("/api/v0/auth/renew", (req, resp) => { this.methodWrapper(req, resp, this.postRenew) });
	}

	public async postLogin(req: express.Request, ds: EntitiesDataSource): Promise<GroupDto | null> {
		const guid = req.params["guid"];

		return await ds.groupRepository().findOneBy({ guid: guid });
	}
	public async postRenew(req: express.Request, ds: EntitiesDataSource): Promise<GroupDto | null> {
		const guid = req.params["guid"];

		return await ds.groupRepository().findOneBy({ guid: guid });
	}
}