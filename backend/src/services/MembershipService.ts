import express from "express";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { MembershipEntity } from "../data/MembershipEntity";
import { BaseService } from "./BaseService";
import { MembershipDto } from "common/src/models/MembershipDto";
import { MembershipLogic } from "../logic/MembershipLogic";
import { Logger } from "../Logger";

export class MembershipService extends BaseService {
    public constructor(logger: Logger, app: express.Express) {
        super();

        logger.trace();

        app.get("/api/v0/membership/:guid", (req, resp) => { this.methodWrapper(req, resp, this.getGuid) });
        app.get("/api/v0/memberships", (req, resp) => { this.methodWrapper(req, resp, this.getList) });
        app.post("/api/v0/membership", (req, resp) => { this.methodWrapper(req, resp, this.postSave) });
        app.delete("/api/v0/membership/:guid", (req, resp) => { this.methodWrapper(req, resp, this.deleteGuid) });

        app.get("/api/v0/group/:guid/memberships", (req, resp) => { this.methodWrapper(req, resp, this.getGroupMemberships) });
        app.get("/api/v0/user/:guid/memberships", (req, resp) => { this.methodWrapper(req, resp, this.getUserMemberships) });
    }

    public async getGroupMemberships(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<MembershipDto[]> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Membership:Read", req, ds);

        const guid = req.params["guid"];
        const ret = await MembershipLogic.getGroupMemberships(ds, guid);
        return ret;
    }
    public async getUserMemberships(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<MembershipDto[]> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Membership:Read", req, ds);

        const guid = req.params["guid"];
        const ret = await MembershipLogic.getUserMemberships(ds, guid);
        return ret;
    }
    public async getGuid(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<MembershipDto | null> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Membership:Read", req, ds);

        const guid = req.params["guid"];
        const ret = await ds.membershipRepository().findOneBy({ guid: guid });
        return ret;
    }
    public async getList(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<MembershipDto[]> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Membership:List", req, ds);

        const ret = await ds.membershipRepository().find();
        return ret;
    }
    public async postSave(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Membership:Save", req, ds);

        const entity = new MembershipEntity();
        entity.copyFrom(req.body as MembershipEntity);
        await ds.membershipRepository().save([entity]);
    }
    public async deleteGuid(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Membership:Delete", req, ds);

        const guid = req.params["guid"];
        await ds.membershipRepository().delete({ guid: guid });
    }
}