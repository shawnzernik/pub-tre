import { LoginDto } from "common/src/models/LoginDto";
import { FetchWrapper } from "./FetchWrapper";

export class AuthService {
    public static async publicKey(): Promise<string> {
        const response = await fetch("/static/public.key", {method: "GET"});
        if (!response.ok)
                throw new Error(`Response ${response.status} - ${response.statusText}`);

        const ret = await response.text();
        return ret;
    }
    public static async anonymous(): Promise<string> {
        const ret = FetchWrapper.get<string>('/api/v0/auth/anonymous');
        return ret;
    }
    public static async login(emailAddress: string, password: string): Promise<string> {
        const login: LoginDto = {
            emailAddress: emailAddress,
            password: password
        };

        const ret = FetchWrapper.post<string>('/api/v0/auth/login', login);
        return ret;
    }

    public static async renew(token: string): Promise<string> {
        const ret = FetchWrapper.get<string>('/api/v0/auth/renew', token);
        return ret;
    }

    public static setToken(value: string): void {
        window.localStorage.setItem("AuthService.token", value);
    }
    public static getToken(): string {
        return window.localStorage.getItem("AuthService.token");
    }
}