import express from "express";
import { HttpStatus } from "common/src/HttpStatus"
import { ResponseDto } from "common/src/models/ResponseDto";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { AuthLogic } from "../logic/AuthLogic";

export type Method<T> = (req: express.Request, ds: EntitiesDataSource) => Promise<T>;

export class BaseService {
    protected static async checkSecurity(securableName: string, req: express.Request, ds: EntitiesDataSource): Promise<AuthLogic> {
        console.log(`BaseService.checkSecurity(${securableName})`);
        const authHeader = req.headers["authorization"];
        const authToken = authHeader && authHeader.split(" ")[1];
        if (!authToken)
            throw new Error("Missing token");

        const auth = await AuthLogic.tokenLogin(authToken);

        if (!auth.securables || auth.securables.length < 1)
            throw new Error("No securables!");

        for (let cnt = 0; cnt < auth.securables.length; cnt++) {
            if (auth.securables[cnt].displayName.toLowerCase() === securableName.toLowerCase())
                return auth;
        }

        throw new Error(`Access denied for securable '${securableName}'!`);
    }

    protected async methodWrapper<T>(req: express.Request, resp: express.Response, method: Method<T>): Promise<void> {
        console.log("BaseService.methodWrapper()");

        if(!resp.status) {
            console.log("BaseService.methodWrapper() - no resp.status");
            return;
        }

        const ds = new EntitiesDataSource();

		try {
			await ds.initialize();
			const ret = await method(req, ds);
			resp.status(HttpStatus.OK).send({ data: ret } as ResponseDto<any>);
		} catch (err: any) {
			resp.status(HttpStatus.BAD_REQUEST).send({ error: err["message"] } as ResponseDto<any>);
		} finally {
			await ds.destroy();
		}
	}
}