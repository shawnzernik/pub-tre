import express from "express";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { MembershipEntity } from "../data/MembershipEntity";
import { BaseService } from "./BaseService";
import { MembershipDto } from "common/src/models/MembershipDto";
import { MembershipLogic } from "../logic/MembershipLogic";

export class MembershipService extends BaseService {
    public constructor(app: express.Express) {
        super();

        console.log("MembershipService.constructor()");

        app.get("/api/v0/membership/:guid", (req, resp) => { this.methodWrapper(req, resp, this.getGuid) });
        app.get("/api/v0/memberships", (req, resp) => { this.methodWrapper(req, resp, this.getList) });
        app.post("/api/v0/membership", (req, resp) => { this.methodWrapper(req, resp, this.postSave) });
        app.delete("/api/v0/membership/:guid", (req, resp) => { this.methodWrapper(req, resp, this.deleteGuid) });

        app.get("/api/v0/group/:guid/memberships", (req, resp) => { this.methodWrapper(req, resp, this.getGroupMemberships) });
        app.get("/api/v0/user/:guid/memberships", (req, resp) => { this.methodWrapper(req, resp, this.getUserMemberships) });
    }

    public async getGroupMemberships(req: express.Request, ds: EntitiesDataSource): Promise<MembershipDto[]> {
        console.log("MembershipService.getGuid()");
        await BaseService.checkSecurity("Membership:Read", req, ds);

        const guid = req.params["guid"];
        const ret = await MembershipLogic.getGroupMemberships(ds, guid);
        return ret;
    }
    public async getUserMemberships(req: express.Request, ds: EntitiesDataSource): Promise<MembershipDto[]> {
        console.log("MembershipService.getGuid()");
        await BaseService.checkSecurity("Membership:Read", req, ds);

        const guid = req.params["guid"];
        const ret = await MembershipLogic.getUserMemberships(ds, guid);
        return ret;
    }
    public async getGuid(req: express.Request, ds: EntitiesDataSource): Promise<MembershipDto | null> {
        console.log("MembershipService.getGuid()");
        await BaseService.checkSecurity("Membership:Read", req, ds);

        const guid = req.params["guid"];
        const ret = await ds.membershipRepository().findOneBy({ guid: guid });
        return ret;
    }
    public async getList(req: express.Request, ds: EntitiesDataSource): Promise<MembershipDto[]> {
        console.log("MembershipService.getList()");
        await BaseService.checkSecurity("Membership:List", req, ds);

        const ret = await ds.membershipRepository().find();
        return ret;
    }
    public async postSave(req: express.Request, ds: EntitiesDataSource): Promise<void> {
        console.log("MembershipService.postSave()");
        await BaseService.checkSecurity("Membership:Save", req, ds);

        const entity = new MembershipEntity();
        entity.copyFrom(req.body as MembershipEntity);
        await ds.membershipRepository().save([entity]);
    }
    public async deleteGuid(req: express.Request, ds: EntitiesDataSource): Promise<void> {
        console.log("MembershipService.deleteGuid()");
        await BaseService.checkSecurity("Membership:Delete", req, ds);

        const guid = req.params["guid"];
        await ds.membershipRepository().delete({ guid: guid });
    }
}