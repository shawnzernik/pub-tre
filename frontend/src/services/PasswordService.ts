import { PasswordDto } from "common/src/models/PasswordDto";
import { FetchWrapper } from "./FetchWrapper";

export class PasswordService {
    public static async get(token: string, guid: string): Promise<PasswordDto> {
        const ret = await FetchWrapper.get<PasswordDto>("/api/v0/password/" + guid, token);
        return ret;
    }

    public static async list(token: string): Promise<PasswordDto[]> {
        const ret = await FetchWrapper.get<PasswordDto[]>("/api/v0/passwords", token);
        return ret;
    }

    public static async save(dto: PasswordDto, token: string): Promise<void> {
        await FetchWrapper.post("/api/v0/password", dto, token);
    }

    public static async delete(token: string, guid: string): Promise<void> {
        await FetchWrapper.delete<PasswordDto>("/api/v0/password/" + guid, token);
    }
}