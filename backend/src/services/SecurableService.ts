import express from "express";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { BaseService } from "./BaseService";
import { SecurableDto } from "common/src/models/SecurableDto";
import { SecurableEntity } from "../data/SecurableEntity";
import { CheckSecurity } from "./CheckSecurity";

export class SecurableService extends BaseService {
	public constructor(app: express.Express) {
		super();

        console.log("SecurableService.constructor()");

		app.get("/api/v0/securable/:guid", (req, resp) => { this.methodWrapper(req, resp, this.getGuid) });
        app.get("/api/v0/securables", (req, resp) => { this.methodWrapper(req, resp, this.getList) });
		app.post("/api/v0/securable", (req, resp) => { this.methodWrapper(req, resp, this.postSave) });
		app.delete("/api/v0/securable/:guid", (req, resp) => { this.methodWrapper(req, resp, this.deleteGuid) });
	}

	@CheckSecurity("Securable:Read")
	public async getGuid(req: express.Request, ds: EntitiesDataSource): Promise<SecurableEntity | null> {
        console.log("SecurableService.getGuid()");
		const guid = req.params["guid"];
		const ret = await ds.securableRepository().findOneBy({ guid: guid });
        return ret;
	}

    @CheckSecurity("Securable:List")
	public async getList(req: express.Request, ds: EntitiesDataSource): Promise<SecurableDto[]> {
        console.log("SecurableService.getList()");
		const ret = await ds.securableRepository().find();
        return ret;
	}

	@CheckSecurity("Securable:Save")
	public async postSave(req: express.Request, ds: EntitiesDataSource): Promise<void> {
        console.log("SecurableService.postSave()");
		const entity = new SecurableEntity();
		entity.copyFrom(req.body as SecurableDto);
		await ds.securableRepository().save([entity]);
	}

	@CheckSecurity("Securable:Delete")
	public async deleteGuid(req: express.Request, ds: EntitiesDataSource): Promise<void> {
        console.log("SecurableService.deleteGuid()");
		const guid = req.params["guid"];
		await ds.securableRepository().delete({ guid: guid });
	}
}