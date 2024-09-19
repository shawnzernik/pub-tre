import express from "express";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { MembershipEntity } from "../data/MembershipEntity";
import { BaseService } from "./BaseService";
import { CheckSecurity } from "./CheckSecurity";

export class MembershipService extends BaseService {
	public constructor(app: express.Express) {
		super();

        console.log("MembershipService.constructor()");

		app.get("/api/v0/membership/:guid", (req, resp) => { this.methodWrapper(req, resp, this.getGuid) });
		app.get("/api/v0/memberships", (req, resp) => { this.methodWrapper(req, resp, this.getList) });
		app.post("/api/v0/membership", (req, resp) => { this.methodWrapper(req, resp, this.postSave) });
		app.delete("/api/v0/membership/:guid", (req, resp) => { this.methodWrapper(req, resp, this.deleteGuid) });
	}

	@CheckSecurity("Membership:Read")
	public async getGuid(req: express.Request, ds: EntitiesDataSource): Promise<MembershipEntity | null> {
        console.log("MembershipService.getGuid()");
		const guid = req.params["guid"];
		const ret = await ds.membershipRepository().findOneBy({ guid: guid });
        return ret;
	}

	@CheckSecurity("Membership:List")
	public async getList(req: express.Request, ds: EntitiesDataSource): Promise<MembershipEntity[]> {
        console.log("MembershipService.getList()");
		const ret = await ds.membershipRepository().find();
        return ret;
	}

	@CheckSecurity("Membership:Save")
	public async postSave(req: express.Request, ds: EntitiesDataSource): Promise<void> {
        console.log("MembershipService.postSave()");
		const entity = new MembershipEntity();
		entity.copyFrom(req.body as MembershipEntity);
		await ds.membershipRepository().save([entity]);
	}

	@CheckSecurity("Membership:Delete")
	public async deleteGuid(req: express.Request, ds: EntitiesDataSource): Promise<void> {
        console.log("MembershipService.deleteGuid()");
		const guid = req.params["guid"];
		await ds.membershipRepository().delete({ guid: guid });
	}
}