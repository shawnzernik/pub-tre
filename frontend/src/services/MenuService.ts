import { MenuDto } from "common/src/models/MenuDto";
import { FetchWrapper } from "./FetchWrapper";

export class MenuService {
    public static async list(token: string): Promise<MenuDto[]> {
        const ret = FetchWrapper.get<MenuDto[]>('/api/v0/menus', token);
        return ret;
    }
}