# Prompt

The following is my backend Menu service:

```
import express from "express";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { BaseService } from "./BaseService";
import { MenuDto } from "common/src/models/MenuDto";
import { MenuEntity } from "../data/MenuEntity";
import { CheckSecurity } from "./CheckSecurity";

export class MenuService extends BaseService {
	public constructor(app: express.Express) {
		super();

        console.log("MenuService.constructor()");

		app.get("/api/v0/menu/:guid", (req, resp) => { this.methodWrapper(req, resp, this.getGuid) });
        app.get("/api/v0/menus", (req, resp) => { this.methodWrapper(req, resp, this.getList) });
		app.post("/api/v0/menu", (req, resp) => { this.methodWrapper(req, resp, this.postSave) });
		app.delete("/api/v0/menu/:guid", (req, resp) => { this.methodWrapper(req, resp, this.deleteGuid) });
	}

    @CheckSecurity("Menu:Read")
	public async getGuid(req: express.Request, ds: EntitiesDataSource): Promise<MenuEntity | null> {
        console.log("MenuService.getGuid()");
		const guid = req.params["guid"];
		const ret = await ds.menuRepository().findOneBy({ guid: guid });
        return ret;
	}

	@CheckSecurity("Menu:List")
	public async getList(req: express.Request, ds: EntitiesDataSource): Promise<MenuDto[]> {
        console.log("MenuService.getList()");
		const ret = await ds.menuRepository().find();
        return ret;
	}

	@CheckSecurity("Menu:Save")
	public async postSave(req: express.Request, ds: EntitiesDataSource): Promise<void> {
        console.log("MenuService.postSave()");
		const entity = new MenuEntity();
		entity.copyFrom(req.body as MenuDto);
		await ds.menuRepository().save([entity]);
	}

	@CheckSecurity("Menu:Delete")
	public async deleteGuid(req: express.Request, ds: EntitiesDataSource): Promise<void> {
        console.log("MenuService.deleteGuid()");
		const guid = req.params["guid"];
		await ds.menuRepository().delete({ guid: guid });
	}
}
```

And the following frontend Menu service was created to access the backend Menu service.  Not that the class name is singular.

```
import { MenuDto } from "common/src/models/MenuDto";
import { FetchWrapper } from "./FetchWrapper";

export class MenuService {
    public static async get(token: string, guid: string): Promise<MenuDto> {
        const ret = await FetchWrapper.get<MenuDto>("/api/v0/menu/" + guid, token);
        return ret;
    }
    public static async list(token: string): Promise<MenuDto[]> {
        const ret = await FetchWrapper.get<MenuDto[]>("/api/v0/menus", token);
        return ret;
    }
    public static async save(dto: MenuDto, token: string): Promise<void> {
        await FetchWrapper.post("/api/v0/menu", dto, token);
    }
    public static async delete(token: string, guid: string): Promise<void> {
        await FetchWrapper.delete<MenuDto>("/api/v0/menu/" + guid, token);
    }
}
```

Please create me a frontend service for the following backend service:

```
import https from 'https';
import fetch from "node-fetch";
import { UserDto } from 'common/src/models/UserDto';
import { Config } from '../../Config';
import { EntitiesDataSource } from '../../data/EntitiesDataSource';
import { UserEntity } from '../../data/UserEntity';

jest.setTimeout(Config.jestTimeoutSeconds * 1000);

describe("UsersService", () => {
    let agent = new https.Agent({ rejectUnauthorized: false });
    let entityGuid = "faf76b3d-ed66-4182-a7c2-7ea6562785fe";
    let token: string | undefined;
    let eds: EntitiesDataSource;

    beforeAll(async () => {
        eds = new EntitiesDataSource();
        await eds.initialize();

        const body = JSON.stringify({
            emailAddress: "administrator@localhost",
            password: "Welcome123"
        });

        const response = await fetch("https://localhost:4433/api/v0/auth/login", {
            agent: agent,
            method: "POST",
            body: body,
            headers: { "Content-Type": "application/json" }
        });

        const obj = await response.json();
        if (!response.ok)
            throw new Error(`Response: ${response.status} - ${response.statusText} - ${obj.error}`);

        if (!obj["data"])
            throw new Error("Return from login did not provide a 'data' with the token!");

        token = obj["data"] as string;
    }, Config.jestTimeoutSeconds * 1000);
    afterAll(async () => {
        try { await eds.userRepository().delete({ guid: entityGuid }); }
        finally { await eds.destroy(); }
    }, Config.jestTimeoutSeconds * 1000);

    test("POST /api/v0/user - save new should return 200", async () => {
        if (!token)
            throw new Error("No token - did beforeAll() fail?");

        const entity = new UserEntity();
        entity.guid = entityGuid;
        entity.displayName = "Delete Me";
        entity.emailAddress = "deleteme@localhost";
        entity.smsPhone = "555-555-5555";

        const response = await fetch("https://localhost:4433/api/v0/user", {
            agent: agent,
            method: "POST",
            body: JSON.stringify(entity),
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        });

        const obj = await response.json();
        if (!response.ok)
            throw new Error(`Response: ${response.status} - ${response.statusText} - ${obj.error}`);

        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);

        let reloaded = await eds.userRepository().findOneByOrFail({ guid: entityGuid });
        expect(entity).toEqual(reloaded);
    }, Config.jestTimeoutSeconds * 1000);
    test("POST /api/v0/user overwrite should return 200", async () => {
        if (!token)
            throw new Error("No token - did beforeAll() fail?");

        const entity = new UserEntity();
        entity.guid = entityGuid;
        entity.displayName = "Delete Me Dupe";
        entity.emailAddress = "deleteme@localhost";
        entity.smsPhone = "555-555-5555";

        const response = await fetch("https://localhost:4433/api/v0/user", {
            agent: agent,
            method: "POST",
            body: JSON.stringify(entity),
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        });

        const obj = await response.json();
        if (!response.ok)
            throw new Error(`Response: ${response.status} - ${response.statusText} - ${obj.error}`);

        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);

        let reloaded = await eds.userRepository().findOneByOrFail({ guid: entityGuid });
        expect(entity).toEqual(reloaded);
    }, Config.jestTimeoutSeconds * 1000);
    test("GET /api/v0/users should return user list", async () => {
        if (!token)
            throw new Error("No token - did beforeAll() fail?");

        const response = await fetch("https://localhost:4433/api/v0/users", {
            agent: agent,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        });

        const obj = await response.json();
        if (!response.ok)
            throw new Error(`Response: ${response.status} - ${response.statusText} - ${obj.error}`);

        if (!obj["data"])
            throw new Error("No data returned!");

        const data = obj["data"] as UserDto[];

        expect(data.length > 0).toBeTruthy();
        expect(data[0].guid).toBeTruthy();
    }, Config.jestTimeoutSeconds * 1000);
    test("GET /api/v0/user/:guid should return user and 200", async () => {
        if (!token)
            throw new Error("No token - did beforeAll() fail?");

        const response = await fetch("https://localhost:4433/api/v0/user/" + entityGuid, {
            agent: agent,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        });

        const obj = await response.json();
        if (!response.ok)
            throw new Error(`Response: ${response.status} - ${response.statusText} - ${obj.error}`);

        if (!obj["data"])
            throw new Error("No data returned!");

        const data = obj["data"] as UserDto;

        expect(data.guid).toEqual(entityGuid);
    }, Config.jestTimeoutSeconds * 1000);
    test("DELETE /api/v0/user/:guid should delete user and return 200", async () => {
        if (!token)
            throw new Error("No token - did beforeAll() fail?");

        const response = await fetch("https://localhost:4433/api/v0/user/" + entityGuid, {
            agent: agent,
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        });

        const obj = await response.json();
        if (!response.ok)
            throw new Error(`Response: ${response.status} - ${response.statusText} - ${obj.error}`);

        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);

        let entity = await eds.userRepository().findBy({ guid: entityGuid });
        expect(entity.length).toEqual(0);
    }, Config.jestTimeoutSeconds * 1000);
});
```
