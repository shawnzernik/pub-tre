import { ResponseDto } from "common/src/models/ResponseDto";
import express from "express";
import { AuthLogic } from "../logic/AuthLogic";
import { HttpStatus } from "common/src/HttpStatus";

export function CheckSecurity(securableName: string) {
    console.log(`CheckSecurity(${securableName})`);

    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        console.log(`CheckSecurity(${securableName}) - function()`);

        const originalMethod = descriptor.value;

        descriptor.value = async function (req: express.Request, resp: express.Response, ...args: any[]) {
            console.log(`CheckSecurity(${securableName}) - function() - function()`);
            
            // Type assertion to ensure resp is of type express.Response
            if (!(resp instanceof Response)) {
                return originalMethod.apply(this, [req, resp, ...args]);
            }

            const authHeader = req.headers["authorization"];
            const authToken = authHeader && authHeader.split(" ")[1];
            if(!authToken)
                return resp.status(401).json({ error: "Missing token" } as ResponseDto<any>);
    
            try {
                const auth = await AuthLogic.tokenLogin(authToken);
                await checkAuthorization(auth, securableName);
            }
            catch(err) {
                return resp.status(HttpStatus.FORBIDDEN).send({ error: `${err}` } as ResponseDto<any>);
            }
            
            return originalMethod.apply(this, [req, resp, ...args]);
        };

        return descriptor;
    };
}

async function checkAuthorization(auth: AuthLogic, securableName: string): Promise<boolean> {
    console.log("checkAuthentication()");
    
    if(!auth.securables || auth.securables.length < 1)
        throw new Error("No securables!");

    for(let cnt = 0; cnt < auth.securables.length; cnt++) {
        if(auth.securables[cnt].displayName.toLowerCase() === securableName.toLowerCase())
            return true;
    }

    throw new Error("Access Denied");
}