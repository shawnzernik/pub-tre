import express from "express";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { MembershipEntity } from "../data/MembershipEntity";
import { BaseService } from "./BaseService";

export type Method<T> = (req: express.Request, ds: EntitiesDataSource) => Promise<T>;

export class MembershipService extends BaseService {
	public constructor(app: express.Express) {
		super();

		app.get("/api/v0/membership/:guid", (req, resp) => { this.methodWrapper(req, resp, this.getGuid) });
		app.get("/api/v0/memberships", (req, resp) => { this.methodWrapper(req, resp, this.getList) });
		app.put("/api/v0/membership", (req, resp) => { this.methodWrapper(req, resp, this.putSave) });
		app.delete("/api/v0/membership/:guid", (req, resp) => { this.methodWrapper(req, resp, this.deleteGuid) });
	}

	public async getGuid(req: express.Request, ds: EntitiesDataSource): Promise<MembershipEntity | null> {
		const guid = req.params["guid"];

		return await ds.membershipRepository().findOneBy({ guid: guid });
	}

	public async getList(req: express.Request, ds: EntitiesDataSource): Promise<MembershipEntity[]> {
		return await ds.membershipRepository().find();
	}

	public async putSave(req: express.Request, ds: EntitiesDataSource): Promise<void> {
		const entity = new MembershipEntity();
		entity.copyFrom(req.body as MembershipEntity);

		await ds.membershipRepository().save([entity]);
	}

	public async deleteGuid(req: express.Request, ds: EntitiesDataSource): Promise<void> {
		const guid = req.params["guid"];

		await ds.membershipRepository().delete({ guid: guid });
	}
}