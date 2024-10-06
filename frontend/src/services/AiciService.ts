import { Response as AiciResponse } from "common/src/models/aici/Response";
import { Message as AiciMessage } from "common/src/models/aici/Message";
import { FetchWrapper } from "./FetchWrapper";

export class AiciService {
    public static async chat(token: string, messages: AiciMessage[]): Promise<AiciResponse> {
        const ret = await FetchWrapper.post<AiciResponse>("/api/v0/aici/chat", messages, token);
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

    public static async upload(token: string, file: File): Promise<void> {
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

        const ret = await FetchWrapper.post<AiciResponse>("/api/v0/aici/upload", obj, token);
    }
}