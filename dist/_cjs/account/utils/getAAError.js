"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAAError = exports.DOCS_URL = exports.ERRORS_URL = void 0;
exports.ERRORS_URL = "https://raw.githubusercontent.com/bcnmy/aa-errors/main/docs/errors.json";
exports.DOCS_URL = "https://docs.biconomy.io/troubleshooting/commonerrors";
const UNKOWN_ERROR_CODE = "520";
const knownErrors = [];
const matchError = (message) => knownErrors.find((knownError) => message.toLowerCase().indexOf(knownError.regex.toLowerCase()) > -1) ?? null;
const buildErrorStrings = (error, status) => {
    const strings = [];
    strings.push(`${status}: ${error.description}`);
    if (error.causes?.length) {
        strings.push("Potential cause(s):");
        strings.push(...error.causes);
    }
    if (error.solutions?.length) {
        strings.push("Potential solution(s):");
        strings.push(...error.solutions);
    }
    return strings;
};
const getAAError = async (message, httpStatus) => {
    if (!knownErrors.length) {
        const errors = (await (await fetch(exports.ERRORS_URL)).json());
        knownErrors.push(...errors);
    }
    const matchedError = matchError(message);
    const status = matchedError?.regex ?? (httpStatus ?? UNKOWN_ERROR_CODE).toString();
    const metaMessages = matchedError
        ? buildErrorStrings(matchedError, status)
        : [];
    const title = matchedError ? matchedError.name : "Unknown Error";
    const docsSlug = matchedError?.docsUrl ?? exports.DOCS_URL;
    return { title, docsSlug, metaMessages, message };
};
exports.getAAError = getAAError;
//# sourceMappingURL=getAAError.js.map