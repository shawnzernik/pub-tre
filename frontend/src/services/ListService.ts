import { ListDto } from "common/src/models/ListDto";
import { FetchWrapper } from "./FetchWrapper";
import { ListFilterDto } from "common/src/models/ListFilterDto";

export class ListService {
    public static async getItems(token: string, guid: string, filters: ListFilterDto[]): Promise<any[]> {
        const ret = await FetchWrapper.post<any>("/api/v0/list/" + guid + "/items", filters, token);
        return ret;
    }
    public static async get(token: string, guid: string): Promise<ListDto> {
        const ret = await FetchWrapper.get<ListDto>("/api/v0/list/" + guid, token);
        return ret;
    }
    public static async getUrlKey(token: string, key: string): Promise<ListDto> {
        const ret = await FetchWrapper.get<ListDto>("/api/v0/list/url_key/" + key, token);
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