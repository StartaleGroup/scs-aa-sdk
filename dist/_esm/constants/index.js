import { getSpendingLimitsPolicy, getSudoPolicy, getTimeFramePolicy, getUsageLimitPolicy, getValueLimitPolicy } from "@rhinestone/module-sdk";
export * from "./abi/index.js";
export const ENTRY_POINT_ADDRESS = "0x0000000071727De22E5E9d8BAf0edAc6f37da032";
export const ENTRYPOINT_SIMULATIONS_ADDRESS = "0x74Cb5e4eE81b86e70f9045036a1C5477de69eE87";
export const BOOTSTRAP_ADDRESS = "0x000000552A5fAe3Db7a8F3917C435448F49BA6a9";
export const ACCOUNT_FACTORY_ADDRESS = "0x0000003B3E7b530b4f981aE80d9350392Defef90";
export const ACCOUNT_IMPLEMENTATION_ADDRESS = "0x000000b8f5f723A680d3D7EE624Fe0bC84a6E05A";
// Todo: Update with multi chain address
// Review: This deployed contract as expected methods
export const COUNTER_CONTRACT_ADDRESS_MINATO = "0x865562898F022904d6ea510931a7776e9a804849";
export const STARTALE_7702_DELEGATION_ADDRESS = "0x000000b8f5f723A680d3D7EE624Fe0bC84a6E05A";
// Rhinestone constants
export { SMART_SESSIONS_ADDRESS, OWNABLE_VALIDATOR_ADDRESS, OWNABLE_EXECUTOR_ADDRESS, RHINESTONE_ATTESTER_ADDRESS, REGISTRY_ADDRESS, SmartSessionMode, encodeSmartSessionSignature, getAddOwnableExecutorOwnerAction, getExecuteOnOwnedAccountAction, getAccount, getOwnableValidatorMockSignature, getOwnableValidatorThreshold, isModuleInstalled as isRhinestoneModuleInstalled, findTrustedAttesters, getTrustAttestersAction, getOwnableValidatorSignature, getAddOwnableValidatorOwnerAction, getOwnableValidatorOwners, getRemoveOwnableValidatorOwnerAction, getSetOwnableValidatorThresholdAction, decodeSmartSessionSignature, encodeValidationData, getEnableSessionDetails, getSmartSessionsValidator, getSudoPolicy, getSpendingLimitsPolicy, getUsageLimitPolicy, getValueLimitPolicy, getOwnableValidator, getUniversalActionPolicy } from "@rhinestone/module-sdk";
export const UNIVERSAL_ACTION_POLICY_ADDRESS = '0x0000006DDA6c463511C4e9B05CFc34C1247fCF1F';
export const SUDO_POLICY_ADDRESS = getSudoPolicy().address;
export const TIME_FRAME_POLICY_ADDRESS = getTimeFramePolicy({
    validUntil: 0,
    validAfter: 0
}).address;
export const VALUE_LIMIT_POLICY_ADDRESS = getValueLimitPolicy({
    limit: 0n
}).address;
export const USAGE_LIMIT_POLICY_ADDRESS = getUsageLimitPolicy({
    limit: 0n
}).address;
export const SPENDING_LIMITS_POLICY_ADDRESS = getSpendingLimitsPolicy([
    {
        token: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        limit: 0n
    }
]).address;
export const PERMIT_TYPEHASH = "0x6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c9";
//# sourceMappingURL=index.js.map