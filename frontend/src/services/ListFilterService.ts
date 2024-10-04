import { ListFilterDto } from "common/src/models/ListFilterDto";
import { FetchWrapper } from "./FetchWrapper";

export class ListFilterService {
    public static async get(token: string, guid: string): Promise<ListFilterDto> {
        const ret = await FetchWrapper.get<ListFilterDto>("/api/v0/list_filter/" + guid, token);
        return ret;
    }
    public static async list(token: string): Promise<ListFilterDto[]> {
        const ret = await FetchWrapper.get<ListFilterDto[]>("/api/v0/list_filters", token);
        return ret;
    }
    public static async save(token: string, dto: ListFilterDto): Promise<void> {
        await FetchWrapper.post("/api/v0/list_filter", dto, token);
    }
    public static async delete(token: string, guid: string): Promise<void> {
        await FetchWrapper.delete<ListFilterDto>("/api/v0/list_filter/" + guid, token);
    }
}