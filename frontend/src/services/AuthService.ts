import { LoginDto } from "common/src/models/LoginDto";
import { FetchWrapper } from "./FetchWrapper";
import { JwtToken } from "../logic/JwtToken";
import { UserDto } from "common/src/models/UserDto";

export class AuthService {
    private static myPublicKey: string;
    public static async publicKey(): Promise<string> {
        if (AuthService.myPublicKey)
            return AuthService.myPublicKey;

        const ret = await FetchWrapper.get<string>("/api/v0/auth/public_key");
        AuthService.myPublicKey = ret;
        return ret;
    }
    public static async anonymous(): Promise<string> {
        const ret = await FetchWrapper.get<string>("/api/v0/auth/anonymous");

        const key = await AuthService.publicKey();
        JwtToken.verify(ret, key);

        return ret;
    }
    public static async login(emailAddress: string, password: string): Promise<string> {
        const login: LoginDto = {
            emailAddress: emailAddress,
            password: password
        };

        const ret = await FetchWrapper.post<string>("/api/v0/auth/login", login);

        const key = await AuthService.publicKey();
        JwtToken.verify(ret, key);

        return ret;
    }
    public static async getUser(): Promise<UserDto> {
        const token = await this.getToken();
        const ret = await FetchWrapper.get<UserDto>("/api/v0/auth/user", token);
        return ret;
    }
    public static async postUser(user: UserDto): Promise<void> {
        const token = await this.getToken();
        const ret = await FetchWrapper.post("/api/v0/auth/user", user, token);
    }
    public static async postPassword(current: string, newPass: string, confirm: string): Promise<void> {
        const obj = {
            currentPassword: current, newPassword: newPass, confirmPassword: confirm
        };
        const token = await this.getToken();
        await FetchWrapper.post("/api/v0/auth/password", obj, token);
    }

    public static async renew(token: string): Promise<string> {
        const ret = await FetchWrapper.get<string>("/api/v0/auth/renew", token);

        const key = await AuthService.publicKey();
        JwtToken.verify(ret, key);

        return ret;
    }

    public static setToken(value: string): void {
        window.localStorage.setItem("AuthService.token", value);
    }
    public static async getToken(): Promise<string> {
        const token = window.localStorage.getItem("AuthService.token");
        if (!token)
            return token;

        const key = await AuthService.publicKey();
        let jwt;
        try { jwt = await JwtToken.verify(token, key); }
        catch (err) { window.location.assign("/"); }

        const now = Date.now();
        const expiresMinutesLeft = (jwt.expires - now) / 1000 / 60;
        if (expiresMinutesLeft > 2)
            return token;
        if (expiresMinutesLeft < 0)
            throw new Error("Token has expired! Please log in again.");

        const newToken = await AuthService.renew(token);
        AuthService.setToken(newToken);
        return newToken;
    }
}