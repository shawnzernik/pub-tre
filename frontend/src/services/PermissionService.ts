import { PermissionDto } from "common/src/models/PermissionDto";
import { FetchWrapper } from "./FetchWrapper";

export class PermissionService {
    public static async getForGroup(token: string, guid: string): Promise<PermissionDto[]> {
        const ret = await FetchWrapper.get<PermissionDto[]>("/api/v0/group/" + guid + "/permissions", token);
        return ret;
    }
    public static async getForSecurable(token: string, guid: string): Promise<PermissionDto[]> {
        const ret = await FetchWrapper.get<PermissionDto[]>("/api/v0/securable/" + guid + "/permissions", token);
        return ret;
    }
    public static async get(token: string, guid: string): Promise<PermissionDto> {
        const ret = await FetchWrapper.get<PermissionDto>("/api/v0/permission/" + guid, token);
        return ret;
    }

    public static async list(token: string): Promise<PermissionDto[]> {
        const ret = await FetchWrapper.get<PermissionDto[]>("/api/v0/permissions", token);
        return ret;
    }

    public static async save(token: string, dto: PermissionDto): Promise<void> {
        await FetchWrapper.post("/api/v0/permission", dto, token);
    }

    public static async delete(token: string, guid: string): Promise<void> {
        await FetchWrapper.delete<PermissionDto>("/api/v0/permission/" + guid, token);
    }
}