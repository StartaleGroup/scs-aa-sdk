"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomBigInt = exports.getRandomInt = exports.bigIntReplacer = exports.isStaging = exports.isDebugging = void 0;
const isDebugging = () => {
    try {
        return (process?.env?.BICONOMY_SDK_DEBUG === "true" ||
            process?.env?.REACT_APP_BICONOMY_SDK_DEBUG === "true" ||
            process?.env?.NEXT_PUBLIC_BICONOMY_SDK_DEBUG === "true");
    }
    catch (e) {
        return false;
    }
};
exports.isDebugging = isDebugging;
const isStaging = () => {
    try {
        return process?.env?.STAGING?.toString() === "true";
    }
    catch (e) {
        return false;
    }
};
exports.isStaging = isStaging;
const bigIntReplacer = (_, value) => {
    if (typeof value === "bigint") {
        return `${value.toString()}n`;
    }
    return value;
};
exports.bigIntReplacer = bigIntReplacer;
const getRandomInt = (min = 1, max = 10000000000000) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
exports.getRandomInt = getRandomInt;
const getRandomBigInt = (min = 1n, max = 10000000000000n) => {
    return (BigInt(Math.floor(Math.random() * (Number(max) - Number(min) + 1))) + min);
};
exports.getRandomBigInt = getRandomBigInt;
//# sourceMappingURL=Helpers.js.map