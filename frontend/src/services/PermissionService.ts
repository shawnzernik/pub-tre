import { PermissionDto } from "common/src/models/PermissionDto";
import { FetchWrapper } from "./FetchWrapper";

export class PermissionService {
    public static async get(token: string, guid: string): Promise<PermissionDto> {
        const ret = await FetchWrapper.get<PermissionDto>("/api/v0/permission/" + guid, token);
        return ret;
    }

    public static async list(token: string): Promise<PermissionDto[]> {
        const ret = await FetchWrapper.get<PermissionDto[]>("/api/v0/permissions", token);
        return ret;
    }

    public static async save(dto: PermissionDto, token: string): Promise<void> {
        await FetchWrapper.post("/api/v0/permission", dto, token);
    }

    public static async delete(token: string, guid: string): Promise<void> {
        await FetchWrapper.delete<PermissionDto>("/api/v0/permission/" + guid, token);
    }
}