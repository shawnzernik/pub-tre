import { GroupDto } from "common/src/models/GroupDto";
import { FetchWrapper } from "./FetchWrapper";

export class GroupService {
    public static async get(token: string, guid: string): Promise<GroupDto> {
        const ret = await FetchWrapper.get<GroupDto>("/api/v0/group/" + guid, token);
        return ret;
    }
    public static async list(token: string): Promise<GroupDto[]> {
        const ret = await FetchWrapper.get<GroupDto[]>("/api/v0/groups", token);
        return ret;
    }
    public static async save(dto: GroupDto, token: string): Promise<void> {
        await FetchWrapper.post("/api/v0/group", dto, token);
    }
    public static async delete(token: string, guid: string): Promise<void> {
        await FetchWrapper.delete<GroupDto>("/api/v0/group/" + guid, token);
    }
}