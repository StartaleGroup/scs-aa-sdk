import { parseErrorMessage } from "../account/utils/parseErrorMessage.js";
/**
 * Creates a new Http client instance
 * @param params - Configuration parameters for the client
 * @returns A base Http client instance that can be extended with additional functionality
 */
export const createHttpClient = (url, apiKey) => {
    const request = async (requesParams) => {
        const { path, method = "POST", body, params } = requesParams;
        const urlParams = params ? `?${Object.entries(params).reduce((searchParams, [key, value]) => {
            searchParams.append(key, value);
            return searchParams;
        }, new URLSearchParams()).toString()}` : "";
        const fullPath = `${url}/${path}${urlParams}`;
        const result = await fetch(fullPath, {
            method,
            headers: {
                "Content-Type": "application/json",
                ...(apiKey ? { "x-api-key": apiKey } : {})
            },
            ...(body ? { body: JSON.stringify(body) } : {})
        });
        const json = (await result.json());
        if (!result.ok) {
            const error = json?.error ?? json ?? result?.statusText ?? result;
            throw new Error(parseErrorMessage(error));
        }
        return json;
    };
    const client = { request };
    function extend(base) {
        return (extendFn) => {
            const extended = extendFn(base);
            for (const key in client)
                delete extended[key];
            const combined = { ...base, ...extended };
            return Object.assign(combined, { extend: extend(combined) });
        };
    }
    return Object.assign(client, { extend: extend(client) });
};
export default createHttpClient;
//# sourceMappingURL=createHttpClient.js.map