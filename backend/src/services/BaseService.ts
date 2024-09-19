import express from "express";
import { HttpStatus } from "common/src/HttpStatus"
import { ResponseDto } from "common/src/models/ResponseDto";
import { EntitiesDataSource } from "../data/EntitiesDataSource";

export type Method<T> = (req: express.Request, ds: EntitiesDataSource) => Promise<T>;

export class BaseService {
	public async methodWrapper<T>(req: express.Request, resp: express.Response, method: Method<T>): Promise<void> {
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