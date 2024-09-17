import { LoginDto } from "common/src/models/LoginDto";

export class AuthService {
    public static async login(emailAddress: string, password: string): Promise<string> {
        const login: LoginDto = {
            emailAddress: emailAddress,
            password: password
        };

        const response = await fetch("/api/v0/auth/login", {
            method: "POST",
            body: JSON.stringify(login),
            headers: { "Content-Type": "application/json" }
        });

        const obj = await response.json();

        if(!response.ok) {
            if(obj && obj.error)
                throw obj.error;
            else
                throw new Error(`Response ${response.status} - ${response.statusText}`);
        }

        if(!obj.data)
            throw new Error("No data returned!");

        return obj.data as string;
    }

    public static async renew(token: string): Promise<string> {
        const response = await fetch("/api/v0/auth/renew", {
            method: "GET",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const obj = await response.json();

        if(!response.ok) {
            if(obj && obj.error)
                throw obj.error;
            else
                throw new Error(`Response ${response.status} - ${response.statusText}`);
        }

        if(!obj.data)
            throw new Error("No data returned!");

        return obj.data as string;
    }
}