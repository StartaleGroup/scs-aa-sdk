import { getAddress, toBytes, toFunctionSelector, toHex } from "viem";
import { OWNABLE_VALIDATOR_ADDRESS, encodeValidationData } from "../../../constants/index.js";
import { parseReferenceValue } from "../../utils/Helpers.js";
export const MAX_RULES = 16;
export const ONE_YEAR_FROM_NOW_IN_SECONDS = 31536000;
export const DUMMY_SIGNATURE = "0x81d4b4981670cb18f99f0b4a66446df1bf5b204d24cfcb659bf38ba27a4359b5711649ec2423c5e1247245eba2964679b6a1dbb85c992ae40b9b00c6935b02ff1b";
/**
 * Generates a random salt as a hexadecimal string.
 *
 * @returns A 32-byte hexadecimal string prefixed with '0x'.
 */
export const generateSalt = () => {
    const randomBytes = new Uint8Array(32);
    const crypto = globalThis.crypto;
    crypto.getRandomValues(randomBytes);
    return `0x${Array.from(randomBytes, (byte) => byte.toString(16).padStart(2, "0")).join("")}`;
};
/**
 * Creates an ActionConfig object from rules and a value limit.
 *
 * @param rules - An array of Rule objects.
 * @param valueLimit - The maximum value allowed for the action.
 * @returns An ActionConfig object.
 */
export const createActionConfig = (rules, valueLimit = 0n) => ({
    paramRules: {
        length: rules.length,
        rules: rules
    },
    valueLimitPerUse: valueLimit
});
/**
 * Applies default values to a CreateSessionDataParams object.
 *
 * @param sessionInfo - The CreateSessionDataParams object to apply defaults to.
 * @returns A FullCreateSessionDataParams object with default values applied.
 */
export const applyDefaults = (sessionInfo) => {
    const sessionKeyData = sessionInfo.sessionKeyData ?? toHex(toBytes(sessionInfo.sessionPublicKey));
    const sessionPublicKey = sessionInfo.sessionPublicKey ?? sessionKeyData;
    return {
        ...sessionInfo,
        sessionKeyData,
        sessionPublicKey,
        sessionValidUntil: sessionInfo.sessionValidUntil ?? ONE_YEAR_FROM_NOW_IN_SECONDS,
        sessionValidAfter: sessionInfo.sessionValidAfter ?? 0,
        sessionValidator: sessionInfo.sessionValidator ?? OWNABLE_VALIDATOR_ADDRESS,
        sessionValidatorInitData: sessionInfo.sessionValidatorInitData ??
            encodeValidationData({
                threshold: 1,
                owners: [getAddress(sessionPublicKey)]
            })
    };
};
/**
 * Creates an ActionData object.
 *
 * @param contractAddress - The address of the contract.
 * @param functionSelector - The function selector or AbiFunction.
 * @param policies - An array of PolicyData objects.
 * @returns An ActionData object.
 */
export const createActionData = (contractAddress, functionSelector, policies) => {
    return {
        actionTarget: contractAddress,
        actionTargetSelector: (typeof functionSelector === "string"
            ? functionSelector
            : functionSelector.name),
        actionPolicies: policies
    };
};
/**
 * Converts an ActionConfig to a RawActionConfig.
 *
 * @param config - The ActionConfig to convert.
 * @returns A RawActionConfig object.
 */
export const toActionConfig = (config) => {
    // Ensure we always have 16 rules, filling with default values if necessary
    const filledRules = [...config.paramRules.rules];
    // Fill the rest with default ParamRule if the length is less than 16
    while (filledRules.length < MAX_RULES) {
        filledRules.push({
            condition: 0, // Default condition (EQUAL)
            offsetIndex: 0, // Default offset
            isLimited: false, // Default isLimited flag
            ref: "0x0000000000000000000000000000000000000000000000000000000000000000", // Default bytes32 ref
            usage: {
                limit: BigInt(0), // Default limit
                used: BigInt(0) // Default used
            }
        });
    }
    const paramRules = filledRules.map((rule) => {
        const parsedRef = parseReferenceValue(rule.ref);
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
/**
 * Stringifies an object, explicitly tagging BigInt values.
 *
 * @param obj - The object to be stringified.
 * @returns A string representing the stringified object with tagged BigInts.
 */
export function stringify(obj) {
    return JSON.stringify(obj, (_, value) => typeof value === "bigint"
        ? { __type: "bigint", value: value.toString() }
        : value);
}
/**
 * Parses a string representation back into an object, correctly handling tagged BigInt values.
 *
 * @param data - The string representing the stringified object.
 * @returns The parsed object with BigInt values restored.
 */
export function parse(data) {
    return JSON.parse(data, (_, value) => {
        if (value && typeof value === "object" && value.__type === "bigint") {
            return BigInt(value.value);
        }
        return value;
    });
}
export const abiToPoliciesInfo = ({ abi, ...actionPolicyInfo }) => (abi ?? [])
    .filter((item) => item.type === "function")
    .map((func) => ({
    ...actionPolicyInfo,
    functionSelector: toFunctionSelector(func),
    rules: [] // Rules should not be available here because they should be custom per method, not used in a loop
}));
//# sourceMappingURL=Helpers.js.map