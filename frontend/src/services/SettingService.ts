import { SettingDto } from "common/src/models/SettingDto";
import { FetchWrapper } from "./FetchWrapper";

export class SettingService {
    public static async get(token: string, guid: string): Promise<SettingDto> {
        const ret = await FetchWrapper.get<SettingDto>("/api/v0/setting/" + guid, token);
        return ret;
    }

    public static async list(token: string): Promise<SettingDto[]> {
        const ret = await FetchWrapper.get<SettingDto[]>("/api/v0/settings", token);
        return ret;
    }

    public static async save(dto: SettingDto, token: string): Promise<void> {
        await FetchWrapper.post("/api/v0/setting", dto, token);
    }

    public static async delete(token: string, guid: string): Promise<void> {
        await FetchWrapper.delete("/api/v0/setting/" + guid, token);
    }
}