"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHttpClient = void 0;
const parseErrorMessage_1 = require("../account/utils/parseErrorMessage.js");
const createHttpClient = (url, apiKey) => {
    const request = async (requesParams) => {
        const { path, method = "POST", body, params } = requesParams;
        const urlParams = params
            ? `?${Object.entries(params)
                .reduce((searchParams, [key, value]) => {
                searchParams.append(key, value);
                return searchParams;
            }, new URLSearchParams())
                .toString()}`
            : "";
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
            throw new Error((0, parseErrorMessage_1.parseErrorMessage)(error));
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
exports.createHttpClient = createHttpClient;
exports.default = exports.createHttpClient;
//# sourceMappingURL=createHttpClient.js.map