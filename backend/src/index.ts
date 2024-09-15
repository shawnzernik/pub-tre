import express from "express";
import { Config } from "./Config";
import fs from "fs";
import https from "https";
import { ResponseDto } from "common/src/models/ResponseDto";
import { AuthService } from "./services/AuthService";
import path from "path";
import { GroupService } from "./services/GroupService";
import { MembershipService } from "./services/MembershipService";
import { PasswordService } from "./services/PasswordService";
import { PermissionService } from "./services/PermissionService";
import { SecurableService } from "./services/SecurableService";
import { UserService } from "./services/UserService";
import morgan from "morgan";

export class WebApp {
    private app: express.Express = express();
    public server: https.Server | undefined;

    public execute() {
        console.log("WebApp.execute() - ts-react-express");
        console.log(`WebApp.execute() - Version: 0.0.0`);
        console.log("WebApp.execute() - (c) Copyright Shawn Zernik 2024");

        this.app.use(morgan('combined'));
        this.app.use(express.json());

        console.log(`WebApp.execute() - Static Directory: ${path.resolve(Config.staticDirectory)}`);
        this.app.use("/static", express.static(Config.staticDirectory));
    
        console.log(`WebApp.execute() - JavaScript Directory: ${path.resolve(Config.javascriptDirectory)}`);
        this.app.use("/scripts", express.static(Config.javascriptDirectory));

        this.app.get("/api/v0/health", this.getHealth.bind(this));
        this.app.get("/api/v0/liveness", this.getLiveliness.bind(this));

        // Initialize services
        new AuthService(this.app);
        new GroupService(this.app);
        new MembershipService(this.app);
        new PasswordService(this.app);
        new PermissionService(this.app);
        new SecurableService(this.app);
        new UserService(this.app);

        console.log(`WebApp.execute() - HTTPS Cert Path: ${path.resolve(Config.httpsCertPath)}`);
        console.log(`WebApp.execute() - HTTPS Key Path: ${path.resolve(Config.httpsKeyPath)}`);
        const options = {
            key: fs.readFileSync(Config.httpsKeyPath),
            cert: fs.readFileSync(Config.httpsCertPath),
        };
        this.server = https.createServer(options, this.app);
        this.server.listen(Config.httpsPort, () => {
            console.log(`WebApp.execute() - HTTPS Port: ${Config.httpsPort}`);
            console.log("WebApp.execute() - Started");
        });
    }

    public getHealth(req: express.Request, res: express.Response) {
        console.log("WebApp.getHealth()");
        res.status(200).send({ data: "OK" } as ResponseDto<string>)
    }

    public getLiveliness(req: express.Request, res: express.Response) {
        console.log("WebApp.getLiveliness()");
        res.status(200).send({ data: "OK" } as ResponseDto<string>)
    }
}

const app = new WebApp();
app.execute();