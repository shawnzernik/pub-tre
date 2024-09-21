import express from "express";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { BaseService } from "./BaseService";
import { MenuDto } from "common/src/models/MenuDto";
import { MenuEntity } from "../data/MenuEntity";
import { CheckSecurity } from "./CheckSecurity";

export class MenuService extends BaseService {
	public constructor(app: express.Express) {
		super();

        console.log("MenuService.constructor()");

		app.get("/api/v0/menu/:guid", (req, resp) => { this.methodWrapper(req, resp, this.getGuid) });
        app.get("/api/v0/menus", (req, resp) => { this.methodWrapper(req, resp, this.getList) });
		app.post("/api/v0/menu", (req, resp) => { this.methodWrapper(req, resp, this.postSave) });
		app.delete("/api/v0/menu/:guid", (req, resp) => { this.methodWrapper(req, resp, this.deleteGuid) });
	}

    @CheckSecurity("Menu:Read")
	public async getGuid(req: express.Request, ds: EntitiesDataSource): Promise<MenuDto | null> {
        console.log("MenuService.getGuid()");
		const guid = req.params["guid"];
		const ret = await ds.menuRepository().findOneBy({ guid: guid });
        return ret;
	}

	@CheckSecurity("Menu:List")
	public async getList(req: express.Request, ds: EntitiesDataSource): Promise<MenuDto[]> {
        console.log("MenuService.getList()");
		const ret = await ds.menuRepository().find();
        return ret;
	}

	@CheckSecurity("Menu:Save")
	public async postSave(req: express.Request, ds: EntitiesDataSource): Promise<void> {
        console.log("MenuService.postSave()");
		const entity = new MenuEntity();
		entity.copyFrom(req.body as MenuDto);
		await ds.menuRepository().save([entity]);
	}

	@CheckSecurity("Menu:Delete")
	public async deleteGuid(req: express.Request, ds: EntitiesDataSource): Promise<void> {
        console.log("MenuService.deleteGuid()");
		const guid = req.params["guid"];
		await ds.menuRepository().delete({ guid: guid });
	}
}