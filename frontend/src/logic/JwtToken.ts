import { SignJWT, jwtVerify, importSPKI, importPKCS8 } from 'jose';

export class JwtToken {
    public static expiresIn = "1h";
    public static audience = "lagovistatech.com";
    public static issuer = "lagovistatech.com";
    public static subject = "jwt_token";

    public data: any;
    
    public constructor(data: any = undefined) {
        this.data = data;
    }

    // private static async importPublicKey(pemKey: string): Promise<CryptoKey> {
    //     const keyData = pemKey
    //         .replace(/-----BEGIN PUBLIC KEY-----/, '')
    //         .replace(/-----END PUBLIC KEY-----/, '')
    //         .replace(/\n/g, '');

    //     const binaryDerString = window.atob(keyData);
    //     const binaryDer = Uint8Array.from(binaryDerString, char => char.charCodeAt(0));

    //     return await importSPKI(binaryDer, 'RS512');
    // }
    private static async importPublicKey(pemKey: string): Promise<CryptoKey> {
        return await importSPKI(pemKey, 'RS512');
    }
    
    public static async verify(token: string, publicKeyPem: string) {
        const publicKey = await JwtToken.importPublicKey(publicKeyPem);

        const { payload } = await jwtVerify(token, publicKey, {
            audience: JwtToken.audience,
            issuer: JwtToken.issuer,
            subject: JwtToken.subject,
        });

        const ret = new JwtToken(payload.data);
        return ret;
    }
}