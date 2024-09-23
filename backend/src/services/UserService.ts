import express from "express";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { BaseService } from "./BaseService";
import { UserDto } from "common/src/models/UserDto";
import { UserEntity } from "../data/UserEntity";

export class UserService extends BaseService {
	public constructor(app: express.Express) {
		super();

        console.log("UserService.constructor()");

		app.get("/api/v0/user/:guid", (req, resp) => { this.methodWrapper(req, resp, this.getGuid) });
        app.get("/api/v0/users", (req, resp) => { this.methodWrapper(req, resp, this.getList) });
		app.post("/api/v0/user", (req, resp) => { this.methodWrapper(req, resp, this.postSave) });
		app.delete("/api/v0/user/:guid", (req, resp) => { this.methodWrapper(req, resp, this.deleteGuid) });
	}

	public async getGuid(req: express.Request, ds: EntitiesDataSource): Promise<UserDto | null> {
        console.log("UserService.getGuid()");
        await BaseService.checkSecurity("User:Read", req, ds);

		const guid = req.params["guid"];
		const ret = await ds.userRepository().findOneBy({ guid: guid });
        return ret;
	}
	public async getList(req: express.Request, ds: EntitiesDataSource): Promise<UserDto[]> {
        console.log("UserService.getList()");
        await BaseService.checkSecurity("User:List", req, ds);

		const ret = await ds.userRepository().find();
        return ret;
	}
	public async postSave(req: express.Request, ds: EntitiesDataSource): Promise<void> {
        console.log("UserService.postSave()");
        await BaseService.checkSecurity("User:Save", req, ds);

		const entity = new UserEntity();
		entity.copyFrom(req.body as UserDto);
		await ds.userRepository().save([entity]);
	}
	public async deleteGuid(req: express.Request, ds: EntitiesDataSource): Promise<void> {
        console.log("UserService.deleteGuid()");
        await BaseService.checkSecurity("User:Delete", req, ds);

		const guid = req.params["guid"];
		await ds.userRepository().delete({ guid: guid });
	}
}