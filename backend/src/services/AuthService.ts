import fs from "fs";
import express from "express";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { BaseService } from "./BaseService";
import { AuthLogic } from "../logic/AuthLogic";
import { Config } from "../Config";
import { UserDto } from "common/src/models/UserDto";
import { UserEntity } from "../data/UserEntity";
import { PasswordLogic } from "../logic/PasswordLogic";

export class AuthService extends BaseService {
    public constructor(app: express.Express) {
        super();

        console.log("AuthService.constructor()");

        app.post("/api/v0/auth/login", (req, resp) => { this.methodWrapper(req, resp, this.postLogin) });
        app.get("/api/v0/auth/renew", (req, resp) => { this.methodWrapper(req, resp, this.postRenew) });
        app.get("/api/v0/auth/public_key", (req, resp) => { this.methodWrapper(req, resp, this.getPublicKey) });
        app.get("/api/v0/auth/anonymous", (req, resp) => { this.methodWrapper(req, resp, this.getAnonymous) });
        app.get("/api/v0/auth/user", (req, resp) => { this.methodWrapper(req, resp, this.getUser) });
        app.post("/api/v0/auth/user", (req, resp) => { this.methodWrapper(req, resp, this.postUser) });
        app.post("/api/v0/auth/password", (req, resp) => { this.methodWrapper(req, resp, this.postPassword) });
    }

    public async getUser(req: express.Request, ds: EntitiesDataSource): Promise<UserDto> {
        console.log("AuthService.getUser()");
        const logic = await BaseService.checkSecurity("Auth:Get:User", req, ds);
        
        const ret = await ds.userRepository().findOneBy({ guid: logic.user!.guid });
        if (!ret)
            throw new Error("Could not locate user for token!");

        return ret;
    }
    public async postUser(req: express.Request, ds: EntitiesDataSource): Promise<void> {
        console.log("AuthService.postUser()");
        await BaseService.checkSecurity("Auth:Post:User", req, ds);

        const logic = await BaseService.checkSecurity("Auth:Get:User", req, ds);

        const entity = new UserEntity();
        entity.copyFrom(req.body as UserDto);

        if(entity.guid != logic.user!.guid)
            throw new Error("User being saved is not the active user!");

        await ds.userRepository().save([entity]);
    }
    public async postPassword(req: express.Request, ds: EntitiesDataSource): Promise<void> {
        console.log("AuthService.postPassword()");
        await BaseService.checkSecurity("Auth:Post:Password", req, ds);

        const logic = await BaseService.checkSecurity("Auth:Get:User", req, ds);
        const login = await AuthLogic.passwordLogin(ds, logic.user!.emailAddress, req.body["currentPassword"]);
        const passLogic = new PasswordLogic();
        const passEntity = await passLogic.reset(ds, login.user!.guid, req.body["newPassword"], req.body["confirmPassword"]);

        await ds.passwordRepository().save([passEntity]);
    }
    public async postLogin(req: express.Request, ds: EntitiesDataSource): Promise<string> {
        console.log("AuthService.postLogin()");

        const bodyJson = req.body;
        const auth = await AuthLogic.passwordLogin(ds, bodyJson["emailAddress"], bodyJson["password"]);
        return auth.tokenize();
    }
    public async getPublicKey(req: express.Request, ds: EntitiesDataSource): Promise<string> {
        console.log("AuthService.getPublicKey()");

        const content = fs.readFileSync(Config.jwtPublicKeyFile, { encoding: "utf8" });
        return content;
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
        if (!authToken)
            throw new Error("You must provide an Authorization header with the value of 'Bearer JWTTOKEN'!");

        const auth = await AuthLogic.tokenLogin(authToken);
        return auth.tokenize();
    }
}