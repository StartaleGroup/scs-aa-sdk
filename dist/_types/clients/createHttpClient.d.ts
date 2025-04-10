import type { Prettify } from "viem";
/**
 * Parameters for initializing a Http client
 */
export type Url = `https://${string}` | `http://${string}`;
/**
 * Parameters for making requests to the Http node
 */
type RequestParams = {
    /** API endpoint path */
    path: string;
    /** HTTP method to use. Defaults to "POST" */
    method?: "GET" | "POST";
    /** Optional request body */
    body?: object;
    /** Optional request params */
    params?: Record<string, string>;
};
/**
 * Base interface for the Http client
 */
export type HttpClient = {
    /** Makes HTTP requests to the Http node */
    request: <T>(params: RequestParams) => Promise<T>;
    /**
     * Extends the client with additional functionality
     * @param fn - Function that adds new properties/methods to the base client
     * @returns Extended client with both base and new functionality
     */
    extend: <const client extends Extended, const extendedHttpClient extends HttpClient>(fn: (base: extendedHttpClient) => client) => client & extendedHttpClient;
};
type Extended = Prettify<{
    [_ in keyof HttpClient]?: undefined;
} & {
    [key: string]: unknown;
}>;
/**
 * Creates a new Http client instance
 * @param params - Configuration parameters for the client
 * @returns A base Http client instance that can be extended with additional functionality
 */
export declare const createHttpClient: (url: Url, apiKey?: string) => HttpClient;
export default createHttpClient;
//# sourceMappingURL=createHttpClient.d.ts.map