import https from 'https';
import fetch from "node-fetch";
import { GroupEntity } from '../data/GroupEntity';
import { EntitiesDataSource } from '../data/EntitiesDataSource';
import { Config } from '../Config';
import { GroupDto } from 'common/src/models/GroupDto';

jest.setTimeout(Config.jestTimeoutSeconds * 1000);

describe("GroupsService", () => {
    let agent = new https.Agent({ rejectUnauthorized: false });
    let groupGuid = "faf76b3d-ed66-4182-a7c2-7ea6562785fe";
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

        if (!response.ok)
            throw new Error(`Response: ${response.status} - ${response.statusText}`);

        const obj = await response.json();
        if (!obj["data"])
            throw new Error("Return from login did not provide a 'data' with the token!");

        token = obj["data"] as string;
    }, Config.jestTimeoutSeconds * 1000);
    afterAll(async () => {
        try { await eds.groupRepository().delete({ guid: groupGuid }); }
        finally { await eds.destroy(); }
    }, Config.jestTimeoutSeconds * 1000);

    test("POST /api/v0/groups/save new should return 200", async () => {
        if (!token)
            throw new Error("No token - did beforeAll() fail?");

        const group = new GroupEntity();
        group.guid = groupGuid;
        group.displayName = "Delete Me";
        group.isAdministrator = false;

        const response = await fetch("https://localhost:4433/api/v0/group", {
            agent: agent,
            method: "POST",
            body: JSON.stringify(group),
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        });

        if (!response.ok)
            throw new Error(`Response: ${response.status} - ${response.statusText}`);

        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);

        let reloadedGroup = await eds.groupRepository().findOneByOrFail({ guid: groupGuid });
        expect(group).toEqual(reloadedGroup);
    }, Config.jestTimeoutSeconds * 1000);
    test("POST /api/v0/groups/save overwrite return 200", async () => {
        if (!token)
            throw new Error("No token - did beforeAll() fail?");

        const group = new GroupEntity();
        group.guid = groupGuid;
        group.displayName = "Delete Me - Duplicate";
        group.isAdministrator = false;

        const response = await fetch("https://localhost:4433/api/v0/group", {
            agent: agent,
            method: "POST",
            body: JSON.stringify(group),
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        });

        if (!response.ok)
            throw new Error(`Response: ${response.status} - ${response.statusText}`);

        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);

        let reloadedGroup = await eds.groupRepository().findOneByOrFail({ guid: groupGuid });
        expect(group).toEqual(reloadedGroup);
    }, Config.jestTimeoutSeconds * 1000);
    test("POST /api/v0/groups/list should return groups", async () => {
        if (!token)
            throw new Error("No token - did beforeAll() fail?");

        const response = await fetch("https://localhost:4433/api/v0/groups", {
            agent: agent,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        });

        if (!response.ok)
            throw new Error(`Response: ${response.status} - ${response.statusText}`);

        const obj = await response.json();
        if (!obj["data"])
            throw new Error("No data returned!");

        const data = obj["data"] as GroupDto[];

        expect(data.length > 0).toBeTruthy();
        expect(data[0].guid).toBeTruthy();
        expect(data[0].displayName).toBeTruthy();
        expect(data[0].isAdministrator).toBeTruthy();
    }, Config.jestTimeoutSeconds * 1000);
    test("POST /api/v0/groups/get/guid should return group", async () => {
        if (!token)
            throw new Error("No token - did beforeAll() fail?");

        const response = await fetch("https://localhost:4433/api/v0/group/" + groupGuid, {
            agent: agent,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        });

        if (!response.ok)
            throw new Error(`Response: ${response.status} - ${response.statusText}`);

        const obj = await response.json();
        if (!obj["data"])
            throw new Error("No data returned!");

        const data = obj["data"] as GroupDto;

        expect(data.guid).toEqual(groupGuid);
        expect(data.displayName).toContain("Delete Me");
        expect(data.isAdministrator).toEqual(false);
    }, Config.jestTimeoutSeconds * 1000);
    test("POST /api/v0/groups/delete should return OK", async () => {
        if (!token)
            throw new Error("No token - did beforeAll() fail?");

        const response = await fetch("https://localhost:4433/api/v0/group/" + groupGuid, {
            agent: agent,
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        });

        if (!response.ok)
            throw new Error(`Response: ${response.status} - ${response.statusText}`);

        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);

        let reloadedGroup = await eds.groupRepository().findBy({ guid: groupGuid });
        expect(reloadedGroup.length).toEqual(0);
    }, Config.jestTimeoutSeconds * 1000);
});