"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseErrorMessage = void 0;
const extractFailedOpError = (message) => {
    const aa23Match = message.match(/errorArgs=\[.*?,\s*"(AA23[^"]+)",\s*"(0x[^"]+)"\]/);
    if (aa23Match) {
        try {
            const hexData = aa23Match[2].slice(130);
            const decoded = Buffer.from(hexData.replace(/00+$/, ""), "hex")
                .toString()
                .replace(/[\u0000-\u001F]/g, "");
            return decoded;
        }
        catch {
            return aa23Match[1];
        }
    }
    const match = message.match(/errorArgs=\[.*?,\s*"([^"]+)"\]/);
    return match?.[1] || null;
};
const extractGasLimitError = (message) => {
    const match = message.match(/code=([A-Z_]+),\s*version=/);
    return match?.[1] || null;
};
const extractRevertError = (message) => {
    const match = message.match(/"reason":"([^"]+)"/);
    return match?.[1] || null;
};
const handleErrorsArray = (errors) => {
    if (typeof errors[0] === "object" && errors[0].msg) {
        return errors.map(({ msg, path }) => `${path}: ${msg}`).join("\n");
    }
    const errorMessage = String(errors[0]);
    return (extractFailedOpError(errorMessage) ||
        extractGasLimitError(errorMessage) ||
        extractRevertError(errorMessage) ||
        errorMessage);
};
const cleanErrorMessage = (message) => {
    return message
        .replace(/^(Error|Details|Message):\s*/i, "")
        .replace(/^error$/i, "")
        .trim();
};
const parseErrorMessage = (error) => {
    if (typeof error !== "object" || error === null) {
        const cleanedMessage = cleanErrorMessage(String(error));
        return (extractFailedOpError(cleanedMessage) ||
            extractGasLimitError(cleanedMessage) ||
            extractRevertError(cleanedMessage) ||
            cleanedMessage);
    }
    const errorObj = error;
    if (errorObj?.type === "AcrossApiError") {
        return [errorObj?.type, errorObj?.message].join(": ");
    }
    if (error instanceof Error) {
        const message = String(error.message);
        const errorMessage = extractFailedOpError(message) ||
            extractGasLimitError(message) ||
            extractRevertError(message) ||
            message;
        if (errorMessage !== message) {
            error.message = errorMessage;
        }
        return cleanErrorMessage(errorMessage);
    }
    if (Array.isArray(errorObj.errors) && errorObj.errors.length > 0) {
        return cleanErrorMessage(handleErrorsArray(errorObj.errors));
    }
    const message = String(errorObj.message || errorObj.statusText || error);
    const cleanedMessage = cleanErrorMessage(message);
    return (extractFailedOpError(cleanedMessage) ||
        extractGasLimitError(cleanedMessage) ||
        extractRevertError(cleanedMessage) ||
        cleanedMessage);
};
exports.parseErrorMessage = parseErrorMessage;
//# sourceMappingURL=parseErrorMessage.js.map