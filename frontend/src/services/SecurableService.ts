import { SecurableDto } from "common/src/models/SecurableDto";
import { FetchWrapper } from "./FetchWrapper";

export class SecurableService {
    public static async get(token: string, guid: string): Promise<SecurableDto> {
        const ret = await FetchWrapper.get<SecurableDto>("/api/v0/securable/" + guid, token);
        return ret;
    }

    public static async list(token: string): Promise<SecurableDto[]> {
        const ret = await FetchWrapper.get<SecurableDto[]>("/api/v0/securables", token);
        return ret;
    }

    public static async save(dto: SecurableDto, token: string): Promise<void> {
        await FetchWrapper.post("/api/v0/securable", dto, token);
    }

    public static async delete(token: string, guid: string): Promise<void> {
        await FetchWrapper.delete<SecurableDto>("/api/v0/securable/" + guid, token);
    }
}