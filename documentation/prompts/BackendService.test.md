# Prompt

The following is my user entity:

```
import { Entity, PrimaryColumn, Column } from 'typeorm';
import { CopyInterface } from "common/src/logic/CopyInterface";
import { UserDto } from "common/src/models/UserDto";

@Entity('users')
export class UserEntity implements UserDto, CopyInterface<UserDto> {
	@PrimaryColumn({ name: "guid" })
	public guid: string = "";

	@Column({ name: 'display_name' })
	public displayName: string = "";

	@Column({ name: 'email_address' })
	public emailAddress: string = "";

	@Column({ name: 'sms_phone' })
	public smsPhone: string = "";

	public copyFrom(source: UserDto): void {
		this.guid = source.guid;
		this.displayName = source.displayName;
		this.emailAddress = source.emailAddress;
		this.smsPhone = source.smsPhone;
	}
	public copyTo(dest: UserDto): void {
		dest.guid = this.guid;
		dest.displayName = this.displayName;
		dest.emailAddress = this.emailAddress;
		dest.smsPhone = this.smsPhone;
	}
}
```

The following is my user service:

```
import express from "express";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { BaseService } from "./BaseService";
import { UserDto } from "common/src/models/UserDto";
import { UserEntity } from "../data/UserEntity";
import { CheckSecurity } from "./CheckSecurity";

export class UserService extends BaseService {
	public constructor(app: express.Express) {
		super();

        console.log("UserService.constructor()");

		app.get("/api/v0/user/:guid", (req, resp) => { this.methodWrapper(req, resp, this.getGuid) });
        app.get("/api/v0/users", (req, resp) => { this.methodWrapper(req, resp, this.getList) });
		app.post("/api/v0/user", (req, resp) => { this.methodWrapper(req, resp, this.postSave) });
		app.delete("/api/v0/user/:guid", (req, resp) => { this.methodWrapper(req, resp, this.deleteGuid) });
	}

    @CheckSecurity("User:Read")
	public async getGuid(req: express.Request, ds: EntitiesDataSource): Promise<UserEntity | null> {
        console.log("UserService.getGuid()");
		const guid = req.params["guid"];
		const ret = await ds.userRepository().findOneBy({ guid: guid });
        return ret;
	}

	@CheckSecurity("User:List")
	public async getList(req: express.Request, ds: EntitiesDataSource): Promise<UserDto[]> {
        console.log("UserService.getList()");
		const ret = await ds.userRepository().find();
        return ret;
	}

	@CheckSecurity("User:Save")
	public async postSave(req: express.Request, ds: EntitiesDataSource): Promise<void> {
        console.log("UserService.postSave()");
		const entity = new UserEntity();
		entity.copyFrom(req.body as UserDto);
		await ds.userRepository().save([entity]);
	}

	@CheckSecurity("User:Delete")
	public async deleteGuid(req: express.Request, ds: EntitiesDataSource): Promise<void> {
        console.log("UserService.deleteGuid()");
		const guid = req.params["guid"];
		await ds.userRepository().delete({ guid: guid });
	}
}
```

The following is my jest unit test for my user service:

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

Using the following entity:

```
import { Entity, PrimaryColumn, Column } from 'typeorm';
import { CopyInterface } from "common/src/logic/CopyInterface";
import { ListDto } from "common/src/models/ListDto";

@Entity('lists')
export class ListEntity implements ListDto, CopyInterface<ListDto> {
	@PrimaryColumn({ name: "guid" })
	public guid: string = "";

	@Column({ name: 'title' })
	public title: string = "";

	@Column({ name: 'url_key' })
	public urlKey: string = "";

	@Column({ name: 'sql', type: 'text' })
	public sql: string = "";

	@Column({ name: 'list_url' })
	public listUrl: string = "";

	@Column({ name: 'edit_url', nullable: true })
	public editUrl?: string = "";

	@Column({ name: 'delete_url', nullable: true })
	public deleteUrl?: string = "";

	@Column({ name: 'autoload', default: false })
	public autoload: boolean = false;

	public copyFrom(source: ListDto): void {
		this.guid = source.guid;
		this.title = source.title;
        this.urlKey = source.urlKey;
		this.sql = source.sql;
		this.listUrl = source.listUrl;
		this.editUrl = source.editUrl;
		this.deleteUrl = source.deleteUrl;
		this.autoload = source.autoload;
	}

	public copyTo(dest: ListDto): void {
		dest.guid = this.guid;
		dest.title = this.title;
        dest.urlKey = this.urlKey;
		dest.sql = this.sql;
		dest.listUrl = this.listUrl;
		dest.editUrl = this.editUrl;
		dest.deleteUrl = this.deleteUrl;
		dest.autoload = this.autoload;
	}
}
```

And the following service:

```
import express from "express";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { BaseService } from "./BaseService";
import { ListDto } from "common/src/models/ListDto";
import { ListEntity } from "../data/ListEntity";
import { CheckSecurity } from "./CheckSecurity";

export class ListService extends BaseService {
    public constructor(app: express.Express) {
        super();

        console.log("ListService.constructor()");

        app.get("/api/v0/list/:guid", (req, resp) => { this.methodWrapper(req, resp, this.getGuid) });
        app.get("/api/v0/list/url_key/:url_key", (req, resp) => { this.methodWrapper(req, resp, this.getUrlKey) });
        app.get("/api/v0/lists", (req, resp) => { this.methodWrapper(req, resp, this.getList) });
        app.post("/api/v0/list", (req, resp) => { this.methodWrapper(req, resp, this.postSave) });
        app.delete("/api/v0/list/:guid", (req, resp) => { this.methodWrapper(req, resp, this.deleteGuid) });
    }

    @CheckSecurity("List:Read")
    public async getGuid(req: express.Request, ds: EntitiesDataSource): Promise<ListDto | null> {
        console.log("ListService.getGuid()");
        const guid = req.params["guid"];
        const ret = await ds.listRepository().findOneBy({ guid: guid });
        return ret;
    }
    public async getUrlKey(req: express.Request, ds: EntitiesDataSource): Promise<ListDto | null> {
        console.log("ListService.getUrlKey()");
        const urlKey = req.params["url_key"];
        const ret = await ds.listRepository().findOneBy({ urlKey: urlKey });
        return ret;
    }

    @CheckSecurity("List:List")
    public async getList(req: express.Request, ds: EntitiesDataSource): Promise<ListDto[]> {
        console.log("ListService.getList()");
        const ret = await ds.listRepository().find();
        return ret;
    }

    @CheckSecurity("List:Save")
    public async postSave(req: express.Request, ds: EntitiesDataSource): Promise<void> {
        console.log("ListService.postSave()");
        const entity = new ListEntity();
        entity.copyFrom(req.body as ListDto);
        await ds.listRepository().save([entity]);
    }

    @CheckSecurity("List:Delete")
    public async deleteGuid(req: express.Request, ds: EntitiesDataSource): Promise<void> {
        console.log("ListService.deleteGuid()");
        const guid = req.params["guid"];
        await ds.listRepository().delete({ guid: guid });
    }
}
```

Create me a jest unit test like I did for the user service.