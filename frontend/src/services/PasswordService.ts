import { PasswordDto } from "common/src/models/PasswordDto";
import { FetchWrapper } from "./FetchWrapper";
import { UUIDv4 } from "common/src/logic/UUIDv4";

export class PasswordService {
    public static async get(token: string, guid: string): Promise<PasswordDto> {
        const ret = await FetchWrapper.get<PasswordDto>({
            url: "/api/v0/password/" + guid,
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    public static async list(token: string): Promise<PasswordDto[]> {
        const ret = await FetchWrapper.get<PasswordDto[]>({
            url: "/api/v0/passwords",
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    public static async save(token: string, dto: PasswordDto): Promise<void> {
        await FetchWrapper.post({
            url: "/api/v0/password",
            body: dto,
            corelation: UUIDv4.generate(),
            token: token
        });
    }

    public static async delete(token: string, guid: string): Promise<void> {
        await FetchWrapper.delete<PasswordDto>({
            url: "/api/v0/password/" + guid,
            corelation: UUIDv4.generate(),
            token: token
        });
    }
}