import express from "express";
import { HttpStatus } from "common/src/models/HttpStatus"
import { ResponseDto } from "common/src/models/ResponseDto";
import { EntitiesDataSource } from "../data/EntitiesDataSource";

export type Method<T> = (req: express.Request, ds: EntitiesDataSource) => Promise<T>;

export class BaseService {
	public async methodWrapper<T>(req: express.Request, resp: express.Response, method: Method<T>): Promise<void> {
		const ds = new EntitiesDataSource();

		try {
			await ds.initialize();
			const ret = await method(req, ds);
			resp.status(HttpStatus.OK).send({ data: ret } as ResponseDto<any>);
		} catch (err) {
			resp.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ err: JSON.stringify(err) } as ResponseDto<any>);
		} finally {
			await ds.destroy();
		}
	}
}