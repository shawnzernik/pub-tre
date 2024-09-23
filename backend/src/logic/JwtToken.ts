import * as jwt from "jsonwebtoken";
import { UUIDv4 } from "common/src/logic/UUIDv4";

export class JwtToken implements jwt.JwtPayload {
    public static expiresIn = "1h";
    public static audience = "lagovistatech.com";
    public static issuer = "lagovistatech.com";
    public static subject = "jwt_token";
    public static algorithm: "RS512" = "RS512";

    public data: any;

    public constructor(data: any = undefined) {
        this.data = data;
    }

    public sign(privateKey: string): string {
        return jwt.sign({ data: this.data }, privateKey, {
            expiresIn: JwtToken.expiresIn,
            audience: JwtToken.audience,
            issuer: JwtToken.issuer,
            subject: JwtToken.subject,
            algorithm: JwtToken.algorithm,
            jwtid: UUIDv4.generate()
        });
    }
    public static verify(token: string, publicKey: string) {
        const obj = jwt.verify(token, publicKey);

        const ret = new JwtToken();
        Object.assign(ret, obj);

        return ret;
    }
}