import express from "express";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { BaseService } from "./BaseService";
import { PasswordDto } from "common/src/models/PasswordDto";
import { PasswordEntity } from "../data/PasswordEntity";
import { Logger } from "../Logger";

export class PasswordService extends BaseService {
    public constructor(logger: Logger, app: express.Express) {
        super();

        logger.trace();

        app.get("/api/v0/password/:guid", (req, resp) => { this.methodWrapper(req, resp, this.getGuid) });
        app.get("/api/v0/passwords", (req, resp) => { this.methodWrapper(req, resp, this.getList) });
        app.post("/api/v0/password", (req, resp) => { this.methodWrapper(req, resp, this.postSave) });
        app.delete("/api/v0/password/:guid", (req, resp) => { this.methodWrapper(req, resp, this.deleteGuid) });
    }

    public async getGuid(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<PasswordDto | null> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Password:Read", req, ds);

        const guid = req.params["guid"];
        const ret = await ds.passwordRepository().findOneBy({ guid: guid });
        return ret;
    }
    public async getList(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<PasswordDto[]> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Password:List", req, ds);

        const ret = await ds.passwordRepository().find();
        return ret;
    }
    public async postSave(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Password:Save", req, ds);

        const entity = new PasswordEntity();
        entity.copyFrom(req.body as PasswordDto);
        await ds.passwordRepository().save([entity]);
    }
    public async deleteGuid(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Password:Delete", req, ds);

        const guid = req.params["guid"];
        await ds.passwordRepository().delete({ guid: guid });
    }
}