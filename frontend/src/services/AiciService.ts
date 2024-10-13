import { Response as AiciResponse } from "common/src/models/aici/Response";
import { Message as AiciMessage } from "common/src/models/aici/Message";
import { FetchWrapper } from "./FetchWrapper";
import { UUIDv4 } from "common/src/logic/UUIDv4";
import { LogDto } from "common/src/models/LogDto";

export class AiciService {
    public static async chat(token: string, messages: AiciMessage[]): Promise<AiciResponse> {
        const ret = await FetchWrapper.post<AiciResponse>({
            url: "/api/v0/aici/chat",
            body: messages,
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    public static async search(token: string, similarTo: string): Promise<any> {
        const ret = await FetchWrapper.post<any>({
            url: "/api/v0/aici/search",
            body: similarTo,
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }
    private static async readFile(f: File): Promise<ArrayBuffer> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                resolve(ev.target.result as ArrayBuffer);
            };
            reader.readAsArrayBuffer(f);
        });
    }

    public static async upload(token: string, file: File): Promise<string> {
        const buff = await this.readFile(file);

        const uint8Array = new Uint8Array(buff);
        let binString = "";
        uint8Array.forEach((num) => {
            binString += String.fromCharCode(num);
        });
        const base64 = btoa(binString);

        const obj = {
            file: file.name,
            contents: base64
        };

        const corelation = UUIDv4.generate();

        await FetchWrapper.post<AiciResponse>({
            url: "/api/v0/aici/upload",
            body: obj,
            corelation: corelation,
            token: token
        });
        return corelation;
    }

    public static async uploadLogs(token: string, corelation: string): Promise<LogDto[]> {
        const ret = await FetchWrapper.get<LogDto[]>({
            url: "/api/v0/aici/upload/" + corelation,
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }
}