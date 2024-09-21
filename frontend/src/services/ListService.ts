import { ListDto } from "common/src/models/ListDto";
import { FetchWrapper } from "./FetchWrapper";

export class ListService {
    public static async get(token: string, guid: string): Promise<ListDto> {
        const ret = await FetchWrapper.get<ListDto>("/api/v0/list/" + guid, token);
        return ret;
    }

    public static async list(token: string): Promise<ListDto[]> {
        const ret = await FetchWrapper.get<ListDto[]>("/api/v0/lists", token);
        return ret;
    }

    public static async save(dto: ListDto, token: string): Promise<void> {
        await FetchWrapper.post("/api/v0/list", dto, token);
    }

    public static async delete(token: string, guid: string): Promise<void> {
        await FetchWrapper.delete<ListDto>("/api/v0/list/" + guid, token);
    }
}