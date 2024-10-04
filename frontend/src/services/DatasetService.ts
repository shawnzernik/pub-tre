import { DatasetDto } from "common/src/models/DatasetDto";
import { FetchWrapper } from "./FetchWrapper";

export class DatasetService {
    public static async get(token: string, guid: string): Promise<DatasetDto> {
        const ret = await FetchWrapper.get<DatasetDto>("/api/v0/dataset/" + guid, token);
        return ret;
    }

    public static async list(token: string): Promise<DatasetDto[]> {
        const ret = await FetchWrapper.get<DatasetDto[]>("/api/v0/datasets", token);
        return ret;
    }

    public static async save(token: string, dto: DatasetDto): Promise<void> {
        await FetchWrapper.post("/api/v0/dataset", dto, token);
    }

    public static async delete(token: string, guid: string): Promise<void> {
        await FetchWrapper.delete<DatasetDto>("/api/v0/dataset/" + guid, token);
    }
}