import { Response as AiciResponse } from "common/src/models/aici/Response";
import { Message as AiciMessage } from "common/src/models/aici/Message";
import { FetchWrapper } from "./FetchWrapper";

export class AiciService {
    public static async chat(token: string, messages: AiciMessage[]): Promise<AiciResponse> {
        const ret = await FetchWrapper.post<AiciResponse>("/api/v0/aici/chat", messages, token);
        return ret;
    }
}