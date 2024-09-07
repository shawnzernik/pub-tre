import fs from "fs";
import * as jwt from "jsonwebtoken";
import { UUIDv4 } from "../logic/UUIDv4";

describe("jsonwebtoken", () => {
    const privateKeyFileContents = fs.readFileSync("../backend/private.key", { encoding: "utf8" });
    const publicKeyFileContents = fs.readFileSync("../frontend/static/public.key", { encoding: "utf8" });
    
    it("should make a JWT token", () => {
        const token = jwt.sign(
            {
                user: "shawn@localhost", 
                name: "Shawn Zernik"
            }, 
            privateKeyFileContents,
            { 
                expiresIn: "1h", 
                audience: "lagoviatatech.com",
                algorithm: "RS512",
                issuer: "lagovistatech.com",
                subject: "user",
                //notBefore: Math.round(Date.now() / 1000),
                jwtid: "BEADBEEFBEADBEEFBEADBEEFBEADBEEF"
            }
        );

        console.log("Token: " + token);        
        expect(token).toBeTruthy();
    });

    it("should signed and verify", () => {
        const token = jwt.sign(
            { data: {
                user: "shawn@localhost", 
                name: "Shawn Zernik"
            }}, 
            privateKeyFileContents,
            { 
                expiresIn: "1h", 
                audience: "lagoviatatech.com",
                algorithm: "RS512",
                issuer: "lagovistatech.com",
                subject: "user",
                // notBefore: Math.round(Date.now() / 1000) - 5,
                jwtid: UUIDv4.generate()
            }
        );

        const ret = jwt.verify(token, publicKeyFileContents);

        console.log("Verified: " + JSON.stringify(ret, null, 4));

        expect(ret).toBeTruthy();
    });
});