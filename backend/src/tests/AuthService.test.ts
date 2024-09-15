import https from 'https';
import fetch from "node-fetch";

describe("AuthService", () => {
    let agent = new https.Agent({ rejectUnauthorized: false });

    test("POST /api/v0/auth/login should return token", async () => {
        const body = JSON.stringify({ 
            emailAddress: "administrator@localhost", 
            password: "Welcome123" 
        });
        const response = await fetch(
            "https://localhost:4433/api/v0/auth/login",
            {
                agent: agent,
                method: "POST",
                body: body,
                headers: { "Content-Type": "application/json" }
            }
        );

        if (!response.ok)
            throw new Error(`Response: ${response.status} - ${response.statusText}`);

        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);

        const obj = await response.json();
        const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
        expect(jwtRegex.test(obj["data"])).toBeTruthy();
    });
    test("POST /api/v0/auth/login should error", async () => {
        const body = JSON.stringify({ 
            emailAddress: "administrator@localhost", 
            password: "Welcome1234" 
        });
        const response = await fetch(
            "https://localhost:4433/api/v0/auth/login",
            {
                agent: agent,
                method: "POST",
                body: body,
                headers: { "Content-Type": "application/json" }
            }
        );

        expect(!response.ok).toBeTruthy();
        expect(response.status).toBe(400);

        const obj = await response.json();

        expect(obj["error"]).toEqual("Error: Invalid login!")
    });
    test("POST /api/v0/auth/token should return token", async () => {
        const body = JSON.stringify({ 
            emailAddress: "administrator@localhost", 
            password: "Welcome123" 
        });
        let response = await fetch(
            "https://localhost:4433/api/v0/auth/login",
            {
                agent: agent,
                method: "POST",
                body: body,
                headers: { "Content-Type": "application/json" }
            }
        );

        if (!response.ok)
            throw new Error(`Response: ${response.status} - ${response.statusText}`);

        let obj = await response.json();
        const token = obj["data"];

        response = await fetch(
            "https://localhost:4433/api/v0/auth/renew",
            {
                agent: agent,
                method: "GET",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (!response.ok)
            throw new Error(`Response: ${response.status} - ${response.statusText}`);

        obj = await response.json();
        const newToken = obj["data"];

        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);

        const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
        expect(jwtRegex.test(newToken)).toBeTruthy();
        expect(newToken).not.toEqual(token);
    });
    test("POST /api/v0/auth/token should error", async () => {
        const body = JSON.stringify({ 
            emailAddress: "administrator@localhost", 
            password: "Welcome123" 
        });
        let response = await fetch(
            "https://localhost:4433/api/v0/auth/login",
            {
                agent: agent,
                method: "POST",
                body: body,
                headers: { "Content-Type": "application/json" }
            }
        );

        if (!response.ok)
            throw new Error(`Response: ${response.status} - ${response.statusText}`);

        let obj = await response.json();
        const token = obj["data"];

        response = await fetch(
            "https://localhost:4433/api/v0/auth/renew",
            {
                agent: agent,
                method: "GET",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer bad${token}`
                }
            }
        );

        expect(!response.ok).toBeTruthy();
        expect(response.status).toBe(400);

        obj = await response.json();

        expect(obj["error"]).toEqual("Error: Invalid token!")
    });
});