import express from "express";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { BaseService } from "./BaseService";
import { GroupDto } from "common/src/models/GroupDto";
import { GroupEntity } from "../data/GroupEntity";
import { CheckSecurity } from "./CheckSecurity";

export class GroupService extends BaseService {
	public constructor(app: express.Express) {
		super();

		app.get("/api/v0/groups", (req, resp) => { this.methodWrapper(req, resp, this.getList) });
		app.put("/api/v0/group", (req, resp) => { this.methodWrapper(req, resp, this.putSave) });
		app.delete("/api/v0/group/:guid", (req, resp) => { this.methodWrapper(req, resp, this.deleteGuid) });
	}

	@CheckSecurity("Group:Read")
	public async getGuid(req: express.Request, ds: EntitiesDataSource): Promise<GroupDto | null> {
		const guid = req.params["guid"];

		return await ds.groupRepository().findOneBy({ guid: guid });
	}

	@CheckSecurity("Group:List")
	public async getList(req: express.Request, ds: EntitiesDataSource): Promise<GroupDto[]> {
		return await ds.groupRepository().find();
	}

	@CheckSecurity("Group:Save")
	public async putSave(req: express.Request, ds: EntitiesDataSource): Promise<void> {
		const entity = new GroupEntity();
		entity.copyFrom(req.body as GroupDto);

		await ds.groupRepository().save([entity]);
	}

	@CheckSecurity("Group:Delete")
	public async deleteGuid(req: express.Request, ds: EntitiesDataSource): Promise<void> {
		const guid = req.params["guid"];

		await ds.groupRepository().delete({ guid: guid });
	}
}