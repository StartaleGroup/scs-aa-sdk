"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseModule = void 0;
exports.parseReferenceValue = parseReferenceValue;
const viem_1 = require("viem");
const index_js_1 = require("../../account/index.js");
function parseReferenceValue(referenceValue) {
    let result;
    if ((0, viem_1.isHex)(referenceValue) && referenceValue.length === 42) {
        result = `0x${"0".repeat(24)}${referenceValue.slice(2)}`;
    }
    else if (referenceValue?.raw) {
        result = referenceValue?.raw;
    }
    else if (typeof referenceValue === "bigint") {
        result = (0, viem_1.pad)((0, viem_1.toHex)(referenceValue), { size: 32 });
    }
    else if (typeof referenceValue === "number") {
        result = (0, viem_1.pad)((0, viem_1.toHex)(BigInt(referenceValue)), { size: 32 });
    }
    else if (typeof referenceValue === "boolean") {
        result = (0, viem_1.pad)((0, viem_1.toHex)(referenceValue), { size: 32 });
    }
    else if ((0, viem_1.isHex)(referenceValue)) {
        result = referenceValue;
    }
    else if (typeof referenceValue === "string") {
        result = (0, viem_1.pad)(referenceValue, { size: 32 });
    }
    else {
        result = (0, viem_1.pad)((0, viem_1.toHex)(referenceValue), { size: 32 });
    }
    if (!(0, viem_1.isHex)(result) || result.length !== 66) {
        throw new Error(index_js_1.ERROR_MESSAGES.INVALID_HEX);
    }
    return result;
}
const parseModule = (client) => {
    const activeModule = client?.account?.getModule();
    if (!activeModule) {
        throw new Error(index_js_1.ERROR_MESSAGES.MODULE_NOT_ACTIVATED);
    }
    return activeModule;
};
exports.parseModule = parseModule;
//# sourceMappingURL=Helpers.js.map