import { UserDto } from "common/src/models/UserDto";
import { FetchWrapper } from "./FetchWrapper";

export class UserService {
    public static async get(token: string, guid: string): Promise<UserDto> {
        const ret = await FetchWrapper.get<UserDto>("/api/v0/user/" + guid, token);
        return ret;
    }

    public static async list(token: string): Promise<UserDto[]> {
        const ret = await FetchWrapper.get<UserDto[]>("/api/v0/users", token);
        return ret;
    }

    public static async save(dto: UserDto, token: string): Promise<void> {
        await FetchWrapper.post("/api/v0/user", dto, token);
    }

    public static async delete(token: string, guid: string): Promise<void> {
        await FetchWrapper.delete<UserDto>("/api/v0/user/" + guid, token);
    }
}