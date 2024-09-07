import fs from "fs";
import { JwtToken } from "../logic/JwtToken";

const privateKeyFileContents = fs.readFileSync("../backend/private.key", { encoding: "utf8" });
const publicKeyFileContents = fs.readFileSync("../frontend/static/public.key", { encoding: "utf8" });

test("jwt tokens", () => {
    const jwt = new JwtToken({ user: "shawn@localhost", name: "Shawn Zernik" });
    const token = jwt.sign(privateKeyFileContents);
    const newJwt = JwtToken.verify(token, publicKeyFileContents);

    expect(newJwt).toBeTruthy();
});

describe('JwtToken', () => {
    it('should sign and verify a JWT token', () => {
        const payload = { user: 'shawn@localhost', name: 'Shawn Zernik' };
        const privateKey = fs.readFileSync('../backend/private.key', 'utf8');
        const publicKey = fs.readFileSync('../frontend/static/public.key', 'utf8');

        const jwt = new JwtToken(payload);
        const token = jwt.sign(privateKey);
        const isValid = JwtToken.verify(token, publicKey);

        expect(isValid).toBeTruthy();
    });
});