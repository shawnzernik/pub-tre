import express, { response } from "express";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { BaseService } from "./BaseService";
import { Response as AiciResponse } from "common/src/models/aici/Response";
import { Configuration as AiciConfiguration } from "common/src/models/aici/Configuration";
import { Dataset as AiciDataset } from "common/src/models/aici/Dataset";

export class AiciService extends BaseService {
    public constructor(app: express.Express) {
        super();

        console.log("AiciService.constructor()");

        app.post("/api/v0/aici/chat", (req, resp) => { this.methodWrapper(req, resp, this.postChat) });
        app.get("/api/v0/aici/reload", (req, resp) => { this.methodWrapper(req, resp, this.getReload) });
        app.get("/api/v0/aici/train", (req, resp) => { this.methodWrapper(req, resp, this.getTrain) });
        app.get("/api/v0/aici/push", (req, resp) => { this.methodWrapper(req, resp, this.getPush) });
        app.get("/api/v0/aici/config", (req, resp) => { this.methodWrapper(req, resp, this.getConfig) });
        app.post("/api/v0/aici/config", (req, resp) => { this.methodWrapper(req, resp, this.postConfig) });
        app.get("/api/v0/aici/datasets", (req, resp) => { this.methodWrapper(req, resp, this.getDatasets) });
        app.get("/api/v0/aici/dataset/:name", (req, resp) => { this.methodWrapper(req, resp, this.getDataset) });
        app.post("/api/v0/aici/dataset/:name", (req, resp) => { this.methodWrapper(req, resp, this.postDataset) });
        app.delete("/api/v0/aici/dataset/:name", (req, resp) => { this.methodWrapper(req, resp, this.deleteDataset) });
    }

    public async postChat(req: express.Request, ds: EntitiesDataSource): Promise<AiciResponse> {
        console.log("AiciService.postChat()");
        await BaseService.checkSecurity("Aici:Chat", req, ds);

        const response = await fetch("http://10.0.0.28:8080/api/v0/chat", {
            method: "POST",
            body: JSON.stringify(req.body),
            headers: {
                "AiciToken": "aici-f4cc1648-4af1-443c-835f-71cfe567cbc9"
            }
        });
        const json = await response.json();

        if (!response.ok)
            if (json.detail)
                throw new Error(json.detail);
            else
                throw new Error(`HTTP Status ${response.status} - ${response.statusText}`);

        return json as AiciResponse;
    }
    public async getReload(req: express.Request, ds: EntitiesDataSource): Promise<void> {
        console.log("AiciService.getReload()");
        await BaseService.checkSecurity("Aici:Reload", req, ds);

        const response = await fetch("http://10.0.0.28/api/v0/reload", {
            method: "GET",
            headers: {
                "AiciToken": "aici-f4cc1648-4af1-443c-835f-71cfe567cbc9"
            }
        });
        const json = await response.json();

        if (!response.ok)
            if (json.detail)
                throw new Error(json.detail);
            else
                throw new Error(`HTTP Status ${response.status} - ${response.statusText}`);
    }
    public async getTrain(req: express.Request, ds: EntitiesDataSource): Promise<void> {
        console.log("AiciService.getTrain()");
        await BaseService.checkSecurity("Aici:Train", req, ds);

        const response = await fetch("http://10.0.0.28/api/v0/train", {
            method: "GET",
            headers: {
                "AiciToken": "aici-f4cc1648-4af1-443c-835f-71cfe567cbc9"
            }
        });
        const json = await response.json();

        if (!response.ok)
            if (json.detail)
                throw new Error(json.detail);
            else
                throw new Error(`HTTP Status ${response.status} - ${response.statusText}`);
    }
    public async getPush(req: express.Request, ds: EntitiesDataSource): Promise<void> {
        console.log("AiciService.getPush()");
        await BaseService.checkSecurity("Aici:Train", req, ds);

        const response = await fetch("http://10.0.0.28/api/v0/push", {
            method: "GET",
            headers: {
                "AiciToken": "aici-f4cc1648-4af1-443c-835f-71cfe567cbc9"
            }
        });
        const json = await response.json();

        if (!response.ok)
            if (json.detail)
                throw new Error(json.detail);
            else
                throw new Error(`HTTP Status ${response.status} - ${response.statusText}`);
    }
    public async getConfig(req: express.Request, ds: EntitiesDataSource): Promise<AiciConfiguration> {
        console.log("AiciService.getConfig()");
        await BaseService.checkSecurity("Aici:Config:Read", req, ds);

        const response = await fetch("http://10.0.0.28/api/v0/config", {
            method: "GET",
            headers: {
                "AiciToken": "aici-f4cc1648-4af1-443c-835f-71cfe567cbc9"
            }
        });
        const json = await response.json();

        if (!response.ok)
            if (json.detail)
                throw new Error(json.detail);
            else
                throw new Error(`HTTP Status ${response.status} - ${response.statusText}`);

        return json as AiciConfiguration;
    }
    public async postConfig(req: express.Request, ds: EntitiesDataSource): Promise<void> {
        console.log("AiciService.postConfig()");
        await BaseService.checkSecurity("Aici:Config:Save", req, ds);

        const response = await fetch("http://10.0.0.28/api/v0/config", {
            method: "PUT",
            body: JSON.stringify(req.body),
            headers: {
                "AiciToken": "aici-f4cc1648-4af1-443c-835f-71cfe567cbc9"
            }
        });
        const json = await response.json();

        if (!response.ok)
            if (json.detail)
                throw new Error(json.detail);
            else
                throw new Error(`HTTP Status ${response.status} - ${response.statusText}`);
    }
    public async getDatasets(req: express.Request, ds: EntitiesDataSource): Promise<string[]> {
        console.log("AiciService.getConfig()");
        await BaseService.checkSecurity("Aici:Config:Read", req, ds);

        const response = await fetch("http://10.0.0.28/api/v0/datasets", {
            method: "GET",
            headers: {
                "AiciToken": "aici-f4cc1648-4af1-443c-835f-71cfe567cbc9"
            }
        });
        const json = await response.json();

        if (!response.ok)
            if (json.detail)
                throw new Error(json.detail);
            else
                throw new Error(`HTTP Status ${response.status} - ${response.statusText}`);

        return json as string[];
    }
    public async getDataset(req: express.Request, ds: EntitiesDataSource): Promise<AiciDataset> {
        console.log("AiciService.getDataset()");
        await BaseService.checkSecurity("Aici:Dataset:Read", req, ds);

        const name = req.params["name"]
        const response = await fetch(`http://10.0.0.28/api/v0/dataset/${name}`, {
            method: "GET",
            headers: {
                "AiciToken": "aici-f4cc1648-4af1-443c-835f-71cfe567cbc9"
            }
        });
        const json = await response.json();

        if (!response.ok)
            if (json.detail)
                throw new Error(json.detail);
            else
                throw new Error(`HTTP Status ${response.status} - ${response.statusText}`);

        return json as AiciDataset;
    }
    public async postDataset(req: express.Request, ds: EntitiesDataSource): Promise<void> {
        console.log("AiciService.postDataset()");
        await BaseService.checkSecurity("Aici:Dataset:Save", req, ds);

        const name = req.params["name"]
        const response = await fetch(`http://10.0.0.28/api/v0/dataset/${name}`, {
            method: "PUT",
            body: JSON.stringify(req.body),
            headers: {
                "AiciToken": "aici-f4cc1648-4af1-443c-835f-71cfe567cbc9"
            }
        });
        const json = await response.json();

        if (!response.ok)
            if (json.detail)
                throw new Error(json.detail);
            else
                throw new Error(`HTTP Status ${response.status} - ${response.statusText}`);
    }
    public async deleteDataset(req: express.Request, ds: EntitiesDataSource): Promise<void> {
        console.log("AiciService.deleteDataset()");
        await BaseService.checkSecurity("Aici:Dataset:Delete", req, ds);

        const name = req.params["name"]
        const response = await fetch(`http://10.0.0.28/api/v0/dataset/${name}`, {
            method: "DELETE",
            headers: {
                "AiciToken": "aici-f4cc1648-4af1-443c-835f-71cfe567cbc9"
            }
        });
        const json = await response.json();

        if (!response.ok)
            if (json.detail)
                throw new Error(json.detail);
            else
                throw new Error(`HTTP Status ${response.status} - ${response.statusText}`);
    }
}