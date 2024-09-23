import express from "express";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { BaseService } from "./BaseService";
import { GroupDto } from "common/src/models/GroupDto";
import { GroupEntity } from "../data/GroupEntity";

export class GroupService extends BaseService {
	public constructor(app: express.Express) {
		super();

        console.log("GroupService.constructor()");

		app.get("/api/v0/group/:guid", (req, resp) => { this.methodWrapper(req, resp, this.getGuid) });
		app.get("/api/v0/groups", (req, resp) => { this.methodWrapper(req, resp, this.getList) });
		app.post("/api/v0/group", (req, resp) => { this.methodWrapper(req, resp, this.postSave) });
		app.delete("/api/v0/group/:guid", (req, resp) => { this.methodWrapper(req, resp, this.deleteGuid) });
	}

	public async getGuid(req: express.Request, ds: EntitiesDataSource): Promise<GroupDto | null> {
        console.log("GroupService.getGuid()");
        await BaseService.checkSecurity("Group:Read", req, ds);

        const guid = req.params["guid"];
		const ret = await ds.groupRepository().findOneBy({ guid: guid });
        return ret;
	}
	public async getList(req: express.Request, ds: EntitiesDataSource): Promise<GroupDto[]> {
        console.log("GroupService.getList()");
        await BaseService.checkSecurity("Group:List", req, ds);

        const ret = await ds.groupRepository().find();
        return ret;
	}
	public async postSave(req: express.Request, ds: EntitiesDataSource): Promise<void> {
        console.log("GroupService.postSave()");
        await BaseService.checkSecurity("Group:Save", req, ds);

        const entity = new GroupEntity();
		entity.copyFrom(req.body as GroupDto);
		await ds.groupRepository().save([entity]);
	}
	public async deleteGuid(req: express.Request, ds: EntitiesDataSource): Promise<void> {
        console.log("GroupService.deleteGuid()");
        await BaseService.checkSecurity("Group:Delete", req, ds);

        const guid = req.params["guid"];
		await ds.groupRepository().delete({ guid: guid });
	}
}