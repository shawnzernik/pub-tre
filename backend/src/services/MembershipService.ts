import express from "express";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { BaseService } from "./BaseService";
import { MembershipDto } from "common/src/models/MembershipDto";
import { MembershipEntity } from "../data/MembershipEntity";
import { CheckSecurity } from "./CheckSecurity";

export class MembershipService extends BaseService {
	public constructor(app: express.Express) {
		super();

		app.get("/api/v0/memberships", (req, resp) => { this.methodWrapper(req, resp, this.getList) });
		app.put("/api/v0/membership", (req, resp) => { this.methodWrapper(req, resp, this.putSave) });
		app.delete("/api/v0/membership/:guid", (req, resp) => { this.methodWrapper(req, resp, this.deleteGuid) });
	}

	@CheckSecurity("Membership:List")
	public async getList(req: express.Request, ds: EntitiesDataSource): Promise<MembershipDto[]> {
		return await ds.membershipRepository().find();
	}

	@CheckSecurity("Membership:Save")
	public async putSave(req: express.Request, ds: EntitiesDataSource): Promise<void> {
		const entity = new MembershipEntity();
		entity.copyFrom(req.body as MembershipDto);

		await ds.membershipRepository().save([entity]);
	}

	@CheckSecurity("Membership:Delete")
	public async deleteGuid(req: express.Request, ds: EntitiesDataSource): Promise<void> {
		const guid = req.params["guid"];

		await ds.membershipRepository().delete({ guid: guid });
	}
}