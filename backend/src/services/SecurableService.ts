import express from "express";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { BaseService } from "./BaseService";
import { SecurableDto } from "common/src/models/SecurableDto";
import { SecurableEntity } from "../data/SecurableEntity";

export class SecurableService extends BaseService {
	public constructor(app: express.Express) {
		super();

        console.log("SecurableService.constructor()");

		app.get("/api/v0/securable/:guid", (req, resp) => { this.methodWrapper(req, resp, this.getGuid) });
        app.get("/api/v0/securables", (req, resp) => { this.methodWrapper(req, resp, this.getList) });
		app.post("/api/v0/securable", (req, resp) => { this.methodWrapper(req, resp, this.postSave) });
		app.delete("/api/v0/securable/:guid", (req, resp) => { this.methodWrapper(req, resp, this.deleteGuid) });
	}

	public async getGuid(req: express.Request, ds: EntitiesDataSource): Promise<SecurableDto | null> {
        console.log("SecurableService.getGuid()");
        await BaseService.checkSecurity("Securable:Read", req, ds);

		const guid = req.params["guid"];
		const ret = await ds.securableRepository().findOneBy({ guid: guid });
        return ret;
	}
	public async getList(req: express.Request, ds: EntitiesDataSource): Promise<SecurableDto[]> {
        console.log("SecurableService.getList()");
        await BaseService.checkSecurity("Securable:List", req, ds);

		const ret = await ds.securableRepository().find();
        return ret;
	}
	public async postSave(req: express.Request, ds: EntitiesDataSource): Promise<void> {
        console.log("SecurableService.postSave()");
        await BaseService.checkSecurity("Securable:Save", req, ds);

		const entity = new SecurableEntity();
		entity.copyFrom(req.body as SecurableDto);
		await ds.securableRepository().save([entity]);
	}
	public async deleteGuid(req: express.Request, ds: EntitiesDataSource): Promise<void> {
        console.log("SecurableService.deleteGuid()");
        await BaseService.checkSecurity("Securable:Delete", req, ds);

		const guid = req.params["guid"];
		await ds.securableRepository().delete({ guid: guid });
	}
}