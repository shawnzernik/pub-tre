import express from "express";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { BaseService } from "./BaseService";
import { AuthLogic } from "../logic/AuthLogic";

export class AuthService extends BaseService {
    public constructor(app: express.Express) {
        super();

        console.log("AuthService.constructor()");

        app.post("/api/v0/auth/login", (req, resp) => { this.methodWrapper(req, resp, this.postLogin) });
        app.get("/api/v0/auth/renew", (req, resp) => { this.methodWrapper(req, resp, this.postRenew) });
    }

    public async postLogin(req: express.Request, ds: EntitiesDataSource): Promise<string> {
        console.log("AuthService.postLogin()");

        const bodyJson = req.body;
        const auth = await AuthLogic.passwordLogin(ds, bodyJson["emailAddress"], bodyJson["password"]);
        return auth.tokenize();
    }
    public async postRenew(req: express.Request, ds: EntitiesDataSource): Promise<string> {
        console.log("AuthService.postRenew()");

        let bearer = req.headers["authorization"];
        if(!bearer)
            throw new Error("You must provide an Authorization header with the value of 'Bearer JWTTOKEN'!");
        bearer = bearer.replace("Bearer ", "").trim();
             
        const auth = await AuthLogic.tokenLogin(bearer);
        return auth.tokenize();
    }
}