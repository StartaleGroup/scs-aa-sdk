import { type Abi, type AbiFunction, type Address, type Hex } from "viem";
import { type ActionData, type PolicyData } from "../../../constants";
import type { AnyData } from "../../utils/Types";
import type { ActionConfig, ActionPolicyInfo, CreateSessionDataParams, FullCreateSessionDataParams, ResolvedActionPolicyInfo, Rule } from "./Types";
export declare const MAX_RULES = 16;
export declare const ONE_YEAR_FROM_NOW_IN_SECONDS = 31536000;
export declare const DUMMY_SIGNATURE: Hex;
/**
 * Generates a random salt as a hexadecimal string.
 *
 * @returns A 32-byte hexadecimal string prefixed with '0x'.
 */
export declare const generateSalt: () => Hex;
/**
 * Creates an ActionConfig object from rules and a value limit.
 *
 * @param rules - An array of Rule objects.
 * @param valueLimit - The maximum value allowed for the action.
 * @returns An ActionConfig object.
 */
export declare const createActionConfig: (rules: Rule[], valueLimit?: bigint) => ActionConfig;
/**
 * Applies default values to a CreateSessionDataParams object.
 *
 * @param sessionInfo - The CreateSessionDataParams object to apply defaults to.
 * @returns A FullCreateSessionDataParams object with default values applied.
 */
export declare const applyDefaults: (sessionInfo: CreateSessionDataParams) => FullCreateSessionDataParams;
/**
 * Creates an ActionData object.
 *
 * @param contractAddress - The address of the contract.
 * @param functionSelector - The function selector or AbiFunction.
 * @param policies - An array of PolicyData objects.
 * @returns An ActionData object.
 */
export declare const createActionData: (contractAddress: Address, functionSelector: string | AbiFunction, policies: PolicyData[]) => ActionData;
/**
 * Converts an ActionConfig to a RawActionConfig.
 *
 * @param config - The ActionConfig to convert.
 * @returns A RawActionConfig object.
 */
export declare const toActionConfig: (config: ActionConfig) => {
    valueLimitPerUse: bigint;
    paramRules: {
        length: bigint;
        rules: {
            condition: import("./Types").ParamCondition;
            offset: number;
            isLimited: boolean;
            ref: `0x${string}`;
            usage: import("./Types").LimitUsage;
        }[];
    };
};
/**
 * Stringifies an object, explicitly tagging BigInt values.
 *
 * @param obj - The object to be stringified.
 * @returns A string representing the stringified object with tagged BigInts.
 */
export declare function stringify(obj: Record<string, AnyData>): string;
/**
 * Parses a string representation back into an object, correctly handling tagged BigInt values.
 *
 * @param data - The string representing the stringified object.
 * @returns The parsed object with BigInt values restored.
 */
export declare function parse(data: string): Record<string, AnyData>;
/**
 * Converts an ABI to a list of ActionPolicyInfo objects.
 *
 * @param params - The parameters object
 * @param params.abi - The ABI to convert
 * @param params.actionPolicyInfo - The ActionPolicyInfo object to apply to each function in the ABI
 *
 * @example
 * const actionPoliciesInfo = abiToPoliciesInfo({
 *   abi: CounterAbi,
 *   actionPolicyInfo: {
 *     contractAddress: COUNTER_ADDRESS,
 *     sudo: false,
 *     tokenLimits: [],
 *     usageLimit: 1000n,
 *     valueLimit: 1000n
 *   }
 * })
 * @returns An array of ActionPolicyInfo objects
 */
export type AbiToPoliciesInfoParams = Omit<ActionPolicyInfo, "functionSelector" | "rules"> & {
    abi: Abi;
};
export declare const abiToPoliciesInfo: ({ abi, ...actionPolicyInfo }: AbiToPoliciesInfoParams) => ResolvedActionPolicyInfo[];
//# sourceMappingURL=Helpers.d.ts.map