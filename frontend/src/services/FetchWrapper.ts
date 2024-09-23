import { Dictionary } from "common/src/Dictionary";

export class FetchWrapper {
    static async delete<T>(url: string, token: string): Promise<void> {
        const headers = FetchWrapper.defaultHeaders(token);

        const response = await fetch(url, {
            method: "DELETE",
            headers: headers
        });

        await FetchWrapper.handleResponse<T>(response);
    }
    static async get<T>(url: string, token?: string): Promise<T> {
        const headers = FetchWrapper.defaultHeaders(token);

        const response = await fetch(url, {
            method: "GET",
            headers: headers
        });

        const ret = await FetchWrapper.handleResponse<T>(response);
        return ret;
    }
    public static async post<T>(url: string, body: any, token?: string): Promise<T> {
        const headers = FetchWrapper.defaultHeaders(token);

        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(body),
            headers: headers
        });

        const ret = await FetchWrapper.handleResponse<T>(response);
        return ret;
    }
    private static defaultHeaders(token?: string): Dictionary<string> {
        const headers: Dictionary<string> = {};
        headers["Content-Type"] = "application/json";
        if (token)
            headers["Authorization"] = `Bearer ${token}`;

        return headers;
    }
    private static async handleResponse<T>(response: Response): Promise<T> {
        const obj = await response.json();

        if (!response.ok) {
            if (obj && obj.error)
                throw new Error(obj.error);
            else
                throw new Error(`Response ${response.status} - ${response.statusText}`);
        }

        if (!obj.data)
            return;
        else
            return obj.data as T;
    }
}