import { MenuDto } from "common/src/models/MenuDto";
import { FetchWrapper } from "./FetchWrapper";

export class MenuService {
    public static async get(token: string, guid: string): Promise<MenuDto> {
        const ret = await FetchWrapper.get<MenuDto>("/api/v0/menu/" + guid, token);
        return ret;
    }
    public static async list(token: string): Promise<MenuDto[]> {
        const ret = await FetchWrapper.get<MenuDto[]>("/api/v0/menus", token);
        return ret;
    }
    public static async save(dto: MenuDto, token: string): Promise<void> {
        await FetchWrapper.post("/api/v0/menu", dto, token);
    }
    public static async delete(token: string, guid: string): Promise<void> {
        await FetchWrapper.delete<MenuDto>("/api/v0/menu/" + guid, token);
    }
}