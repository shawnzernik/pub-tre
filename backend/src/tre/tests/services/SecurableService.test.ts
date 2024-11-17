import https from 'https';
import fetch from "node-fetch";
import { SecurableDto } from 'common/src/tre/models/SecurableDto';
import { Config } from '../../../Config';
import { EntitiesDataSource } from '../../data/EntitiesDataSource';
import { SecurableEntity } from '../../data/SecurableEntity';
import { SecurableRepository } from '../../data/SecurableRepository';

jest.setTimeout(Config.jestTimeoutSeconds * 1000);

describe("SecurableService", () => {
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

        const response = await fetch(Config.appUrl + "/api/v0/auth/login", {
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
        try { await new SecurableRepository(eds).delete({ guid: entityGuid }); }
        catch (err) { /* eat error */ }

        await eds.destroy();
    }, Config.jestTimeoutSeconds * 1000);

    test("POST /api/v0/securable - save new should return 200", async () => {
        if (!token)
            throw new Error("No token - did beforeAll() fail?");

        const entity = new SecurableEntity();
        entity.guid = entityGuid;
        entity.displayName = "Delete Me";

        const response = await fetch(Config.appUrl + "/api/v0/securable", {
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

        let reloaded = await new SecurableRepository(eds).findOneByOrFail({ guid: entityGuid });
        expect(entity.guid).toEqual(reloaded.guid);
    }, Config.jestTimeoutSeconds * 1000);
    test("POST /api/v0/securable overwrite should return 200", async () => {
        if (!token)
            throw new Error("No token - did beforeAll() fail?");

        const entity = new SecurableEntity();
        entity.guid = entityGuid;
        entity.displayName = "Delete Me Dupe";

        const response = await fetch(Config.appUrl + "/api/v0/securable", {
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

        let reloaded = await new SecurableRepository(eds).findOneByOrFail({ guid: entityGuid });
        expect(entity.guid).toEqual(reloaded.guid);
    }, Config.jestTimeoutSeconds * 1000);
    test("GET /api/v0/securables should return securable list", async () => {
        if (!token)
            throw new Error("No token - did beforeAll() fail?");

        const response = await fetch(Config.appUrl + "/api/v0/securables", {
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

        const data = obj["data"] as SecurableDto[];

        expect(data.length > 0).toBeTruthy();
        expect(data[0].guid).toBeTruthy();
        expect(data[0].displayName).toBeTruthy();
    }, Config.jestTimeoutSeconds * 1000);
    test("GET /api/v0/securable/:guid should return securable and 200", async () => {
        if (!token)
            throw new Error("No token - did beforeAll() fail?");

        const response = await fetch(Config.appUrl + "/api/v0/securable/" + entityGuid, {
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

        const data = obj["data"] as SecurableDto;

        expect(data.guid).toEqual(entityGuid);
    }, Config.jestTimeoutSeconds * 1000);
    test("DELETE /api/v0/securable/:guid should delete securable and return 200", async () => {
        if (!token)
            throw new Error("No token - did beforeAll() fail?");

        const response = await fetch(Config.appUrl + "/api/v0/securable/" + entityGuid, {
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

        let entity = await new SecurableRepository(eds).findBy({ guid: entityGuid });
        expect(entity.length).toEqual(0);
    }, Config.jestTimeoutSeconds * 1000);
});