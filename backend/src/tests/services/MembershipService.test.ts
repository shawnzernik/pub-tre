import https from 'https';
import fetch from "node-fetch";
import { MembershipDto } from 'common/src/models/MembershipDto';
import { Config } from '../../Config';
import { EntitiesDataSource } from '../../data/EntitiesDataSource';
import { MembershipEntity } from '../../data/MembershipEntity';
import { GroupEntity } from '../../data/GroupEntity';
import { UserEntity } from '../../data/UserEntity';

jest.setTimeout(Config.jestTimeoutSeconds * 1000);

describe("MembershipsService", () => {
    let agent = new https.Agent({ rejectUnauthorized: false });
    let entityGuid = "faf76b3d-ed66-4182-a7c2-7ea6562785fe";
    let token: string | undefined;
    let eds: EntitiesDataSource;

    let groupEntity = new GroupEntity();
    groupEntity.displayName = "Delete Me";
    groupEntity.guid = entityGuid;
    groupEntity.isAdministrator = false;

    let userEntity = new UserEntity();
    userEntity.guid = entityGuid;
    userEntity.displayName = "Delete Me";
    userEntity.emailAddress = "deleteme@localhost";
    userEntity.smsPhone = "555-555-5555";

    beforeAll(async () => {
        eds = new EntitiesDataSource();
        await eds.initialize();

        await eds.userRepository().save(userEntity);
        await eds.groupRepository().save(groupEntity);

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
        try { await eds.membershipRepository().delete({ guid: entityGuid }); }
        catch (err) { /* eat error */ }
        try { await eds.userRepository().delete({ guid: entityGuid }); }
        catch (err) { /* eat error */ }
        try { await eds.groupRepository().delete({ guid: entityGuid }); }
        catch (err) { /* eat error */ }

        await eds.destroy();
    }, Config.jestTimeoutSeconds * 1000);

    test("POST /api/v0/membership - save new should return 200", async () => {
        if (!token)
            throw new Error("No token - did beforeAll() fail?");

        const entity = new MembershipEntity();
        entity.guid = entityGuid;
        entity.groupsGuid = entityGuid;
        entity.usersGuid = entityGuid;
        entity.isIncluded = true;

        const response = await fetch("https://localhost:4433/api/v0/membership", {
            agent: agent,
            method: "POST",
            body: JSON.stringify(entity),
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        });

        if (!response.ok)
            throw new Error(`Response: ${response.status} - ${response.statusText}`);

        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);

        let reloaded = await eds.membershipRepository().findOneByOrFail({ guid: entityGuid });
        expect(entity).toEqual(reloaded);
    }, Config.jestTimeoutSeconds * 1000);
    test("POST /api/v0/membership overwrite should return 200", async () => {
        if (!token)
            throw new Error("No token - did beforeAll() fail?");

        const entity = new MembershipEntity();
        entity.guid = entityGuid;
        entity.groupsGuid = entityGuid;
        entity.usersGuid = entityGuid;
        entity.isIncluded = false;

        const response = await fetch("https://localhost:4433/api/v0/membership", {
            agent: agent,
            method: "POST",
            body: JSON.stringify(entity),
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        });

        if (!response.ok)
            throw new Error(`Response: ${response.status} - ${response.statusText}`);

        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);

        let reloaded = await eds.membershipRepository().findOneByOrFail({ guid: entityGuid });
        expect(entity).toEqual(reloaded);
    }, Config.jestTimeoutSeconds * 1000);
    test("GET /api/v0/memberships should return membership list", async () => {
        if (!token)
            throw new Error("No token - did beforeAll() fail?");

        const response = await fetch("https://localhost:4433/api/v0/memberships", {
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

        const data = obj["data"] as MembershipDto[];

        expect(data.length > 0).toBeTruthy();
        expect(data[0].guid).toBeTruthy();
        expect(data[0].groupsGuid).toBeTruthy();
        expect(data[0].usersGuid).toBeTruthy();
        expect(data[0].isIncluded === true || data[0].isIncluded === false).toBeTruthy();
    }, Config.jestTimeoutSeconds * 1000);
    test("GET /api/v0/membership/:guid should return membership and 200", async () => {
        if (!token)
            throw new Error("No token - did beforeAll() fail?");

        const response = await fetch("https://localhost:4433/api/v0/membership/" + entityGuid, {
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

        const data = obj["data"] as MembershipDto;

        expect(data.guid).toEqual(entityGuid);
    }, Config.jestTimeoutSeconds * 1000);
    test("DELETE /api/v0/membership/:guid should delete membership and return 200", async () => {
        if (!token)
            throw new Error("No token - did beforeAll() fail?");

        const response = await fetch("https://localhost:4433/api/v0/membership/" + entityGuid, {
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

        let entity = await eds.membershipRepository().findBy({ guid: entityGuid });
        expect(entity.length).toEqual(0);
    }, Config.jestTimeoutSeconds * 1000);
});