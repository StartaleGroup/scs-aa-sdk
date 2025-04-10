"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.abiToPoliciesInfo = exports.toActionConfig = exports.createActionData = exports.applyDefaults = exports.createActionConfig = exports.generateSalt = exports.DUMMY_SIGNATURE = exports.ONE_YEAR_FROM_NOW_IN_SECONDS = exports.MAX_RULES = void 0;
exports.stringify = stringify;
exports.parse = parse;
const viem_1 = require("viem");
const constants_1 = require("../../../constants/index.js");
const Helpers_1 = require("../../utils/Helpers.js");
exports.MAX_RULES = 16;
exports.ONE_YEAR_FROM_NOW_IN_SECONDS = 31536000;
exports.DUMMY_SIGNATURE = "0x81d4b4981670cb18f99f0b4a66446df1bf5b204d24cfcb659bf38ba27a4359b5711649ec2423c5e1247245eba2964679b6a1dbb85c992ae40b9b00c6935b02ff1b";
const generateSalt = () => {
    const randomBytes = new Uint8Array(32);
    const crypto = globalThis.crypto;
    crypto.getRandomValues(randomBytes);
    return `0x${Array.from(randomBytes, (byte) => byte.toString(16).padStart(2, "0")).join("")}`;
};
exports.generateSalt = generateSalt;
const createActionConfig = (rules, valueLimit = 0n) => ({
    paramRules: {
        length: rules.length,
        rules: rules
    },
    valueLimitPerUse: valueLimit
});
exports.createActionConfig = createActionConfig;
const applyDefaults = (sessionInfo) => {
    const sessionKeyData = sessionInfo.sessionKeyData ?? (0, viem_1.toHex)((0, viem_1.toBytes)(sessionInfo.sessionPublicKey));
    const sessionPublicKey = sessionInfo.sessionPublicKey ?? sessionKeyData;
    return {
        ...sessionInfo,
        sessionKeyData,
        sessionPublicKey,
        sessionValidUntil: sessionInfo.sessionValidUntil ?? exports.ONE_YEAR_FROM_NOW_IN_SECONDS,
        sessionValidAfter: sessionInfo.sessionValidAfter ?? 0,
        sessionValidator: sessionInfo.sessionValidator ?? constants_1.OWNABLE_VALIDATOR_ADDRESS,
        sessionValidatorInitData: sessionInfo.sessionValidatorInitData ??
            (0, constants_1.encodeValidationData)({
                threshold: 1,
                owners: [(0, viem_1.getAddress)(sessionPublicKey)]
            })
    };
};
exports.applyDefaults = applyDefaults;
const createActionData = (contractAddress, functionSelector, policies) => {
    return {
        actionTarget: contractAddress,
        actionTargetSelector: (typeof functionSelector === "string"
            ? functionSelector
            : functionSelector.name),
        actionPolicies: policies
    };
};
exports.createActionData = createActionData;
const toActionConfig = (config) => {
    const filledRules = [...config.paramRules.rules];
    while (filledRules.length < exports.MAX_RULES) {
        filledRules.push({
            condition: 0,
            offsetIndex: 0,
            isLimited: false,
            ref: "0x0000000000000000000000000000000000000000000000000000000000000000",
            usage: {
                limit: BigInt(0),
                used: BigInt(0)
            }
        });
    }
    const paramRules = filledRules.map((rule) => {
        const parsedRef = (0, Helpers_1.parseReferenceValue)(rule.ref);
        return {
            condition: rule.condition,
            offset: rule.offsetIndex * 32,
            isLimited: rule.isLimited,
            ref: parsedRef,
            usage: rule.usage
        };
    });
    return {
        valueLimitPerUse: BigInt(config.valueLimitPerUse),
        paramRules: {
            length: BigInt(config.paramRules.length),
            rules: paramRules
        }
    };
};
exports.toActionConfig = toActionConfig;
function stringify(obj) {
    return JSON.stringify(obj, (_, value) => typeof value === "bigint"
        ? { __type: "bigint", value: value.toString() }
        : value);
}
function parse(data) {
    return JSON.parse(data, (_, value) => {
        if (value && typeof value === "object" && value.__type === "bigint") {
            return BigInt(value.value);
        }
        return value;
    });
}
const abiToPoliciesInfo = ({ abi, ...actionPolicyInfo }) => (abi ?? [])
    .filter((item) => item.type === "function")
    .map((func) => ({
    ...actionPolicyInfo,
    functionSelector: (0, viem_1.toFunctionSelector)(func),
    rules: []
}));
exports.abiToPoliciesInfo = abiToPoliciesInfo;
//# sourceMappingURL=Helpers.js.map