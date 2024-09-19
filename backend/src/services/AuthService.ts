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
        app.get("/api/v0/auth/anonymous", (req, resp) => { this.methodWrapper(req, resp, this.getAnonymous) });
    }

    public async postLogin(req: express.Request, ds: EntitiesDataSource): Promise<string> {
        console.log("AuthService.postLogin()");

        const bodyJson = req.body;
        const auth = await AuthLogic.passwordLogin(ds, bodyJson["emailAddress"], bodyJson["password"]);
        return auth.tokenize();
    }
    public async getAnonymous(req: express.Request, ds: EntitiesDataSource): Promise<string> {
        console.log("AuthService.postLogin()");

        const auth = await AuthLogic.anonymousLogin(ds);
        return auth.tokenize();
    }
    public async postRenew(req: express.Request, ds: EntitiesDataSource): Promise<string> {
        console.log("AuthService.postRenew()");

        const authHeader = req.headers["authorization"];
        const authToken = authHeader && authHeader.split(" ")[1];
        if(!authToken)
            throw new Error("You must provide an Authorization header with the value of 'Bearer JWTTOKEN'!");
             
        const auth = await AuthLogic.tokenLogin(authToken);
        return auth.tokenize();
    }
}