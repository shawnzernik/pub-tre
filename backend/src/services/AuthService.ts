import express from "express";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { BaseService } from "./BaseService";
import { AuthLogic } from "../logic/AuthLogic";

export class AuthService extends BaseService {
	public constructor(app: express.Express) {
		super();

		app.post("/api/v0/auth/login", (req, resp) => { this.methodWrapper(req, resp, this.postLogin) });
		app.post("/api/v0/auth/renew", (req, resp) => { this.methodWrapper(req, resp, this.postRenew) });
	}

	public async postLogin(req: express.Request, ds: EntitiesDataSource): Promise<string> {
        const bodyString = req.body;
        const bodyJson = JSON.parse(bodyString);

        const auth = await AuthLogic.passwordLogin(ds, bodyJson["emailAddress"], bodyJson["password"]);
        return auth.tokenize();
	}
	public async postRenew(req: express.Request, ds: EntitiesDataSource): Promise<string> {
        const bodyString = req.body;
        const bodyJson = JSON.parse(bodyString);

        const auth = await AuthLogic.tokenLogin(bodyJson["token"]);
        return auth.tokenize();
	}
}