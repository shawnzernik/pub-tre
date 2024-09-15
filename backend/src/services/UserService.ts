import express from "express";
import { UserDto } from "common/src/models/UserDto";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { UserEntity } from "../data/UserEntity";
import { BaseService } from "./BaseService";
import { CheckSecurity } from "./CheckSecurity";

export class UserService extends BaseService {
	public constructor(app: express.Express) {
		super();

        console.log("UserService.constructor()");

		app.get("/api/v0/user/:guid", (req, resp) => { this.methodWrapper(req, resp, this.getGuid) });
        app.get("/api/v0/users", (req, resp) => { this.methodWrapper(req, resp, this.getList) });
		app.put("/api/v0/user", (req, resp) => { this.methodWrapper(req, resp, this.putSave) });
		app.delete("/api/v0/user/:guid", (req, resp) => { this.methodWrapper(req, resp, this.deleteGuid) });
	}

    @CheckSecurity("User:Read")
	public async getGuid(req: express.Request, ds: EntitiesDataSource): Promise<UserEntity | null> {
        console.log("UserService.getGuid()");
		const guid = req.params["guid"];
		return await ds.userRepository().findOneBy({ guid: guid });
	}

	@CheckSecurity("User:List")
	public async getList(req: express.Request, ds: EntitiesDataSource): Promise<UserDto[]> {
        console.log("UserService.getList()");
		return await ds.userRepository().find();
	}

	@CheckSecurity("User:Save")
	public async putSave(req: express.Request, ds: EntitiesDataSource): Promise<void> {
        console.log("UserService.putSave()");
		const entity = new UserEntity();
		entity.copyFrom(req.body as UserDto);
		await ds.userRepository().save([entity]);
	}

	@CheckSecurity("User:Delete")
	public async deleteGuid(req: express.Request, ds: EntitiesDataSource): Promise<void> {
        console.log("UserService.deleteGuid()");
		const guid = req.params["guid"];
		await ds.userRepository().delete({ guid: guid });
	}
}