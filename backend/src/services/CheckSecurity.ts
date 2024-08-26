import { ResponseDto } from "common/src/models/ResponseDto";
import express from "express";

export function CheckSecurity(securableName: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (req: express.Request, resp: express.Response, ...args: any[]) {
            const authHeader = req.headers["authorization"];
            const authToken = authHeader && authHeader.split(" ")[1];

            if (!authToken)
                return resp.status(401).json({ error: "Unauthorized: Missing token" } as ResponseDto<any>);

            const isAuthenticated = await checkAuthentication(authToken);
            if (!isAuthenticated)
                return resp.status(401).json({ error: "Unauthorized: Invalid token" } as ResponseDto<any>);

            const hasPermission = await checkAuthorization(authToken, securableName);
            if (!hasPermission)
                return resp.status(403).json({ message: "Forbidden: Insufficient permissions" });

            return originalMethod.apply(this, [req, resp, ...args]);
        };

        return descriptor;
    };
}

async function checkAuthentication(token: string): Promise<boolean> {
    return true;
}

async function checkAuthorization(token: string, securableName: string): Promise<boolean> {
    return true;
}