import { Dictionary } from "common/src/Dictionary";

export interface FetchParameters {
    url: string;
    token?: string;
    body?: any;
    corelation: string;
}

export class FetchWrapper {
    /**
     * Sends a DELETE request to the specified URL with optional authorization and correlation headers.
     * @param params - The parameters required to make the DELETE request.
     */
    static async delete(params: FetchParameters): Promise<void> {
        const headers = FetchWrapper.defaultHeaders(params.token);

        const response = await fetch(params.url, {
            method: "DELETE",
            headers: { ...headers, "corelation": params.corelation }
        });

        await FetchWrapper.handleResponse(response, false);
    }

    /**
     * Sends a GET request to the specified URL with optional authorization and correlation headers.
     * @param params - The parameters required to make the GET request.
     * @returns The response data of type T.
     */
    static async get<T>(params: FetchParameters): Promise<T> {
        const headers = FetchWrapper.defaultHeaders(params.token);

        const response = await fetch(params.url, {
            method: "GET",
            headers: { ...headers, "corelation": params.corelation }
        });

        const ret = await FetchWrapper.handleResponse<T>(response);
        return ret;
    }

    /**
     * Sends a POST request to the specified URL with optional authorization, correlation headers, and a JSON body.
     * @param params - The parameters required to make the POST request.
     * @returns The response data of type T.
     */
    public static async post<T>(params: FetchParameters): Promise<T> {
        const headers = FetchWrapper.defaultHeaders(params.token);

        // Ensure that the body is an object, not a string
        const body = typeof params.body === "string" ? params.body : JSON.stringify(params.body);

        const response = await fetch(params.url, {
            method: "POST",
            body: body,
            headers: { ...headers, "corelation": params.corelation }
        });

        const ret = await FetchWrapper.handleResponse<T>(response);
        return ret;
    }

    /**
     * Generates the default headers for HTTP requests, including Content-Type and Authorization if a token is provided.
     * @param token - Optional bearer token for authorization.
     * @returns A dictionary of header key-value pairs.
     */
    private static defaultHeaders(token?: string): Dictionary<string> {
        const headers: Dictionary<string> = {};
        headers["Content-Type"] = "application/json";
        if (token)
            headers["Authorization"] = `Bearer ${token}`;

        return headers;
    }

    /**
     * Handles the HTTP response, parsing JSON if expected and handling errors appropriately.
     * @param response - The Fetch API Response object.
     * @param expectJson - Indicates whether the response is expected to be in JSON format.
     * @returns The response data of type T or void.
     */
    private static async handleResponse<T>(response: Response, expectJson: boolean = true): Promise<T> {
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