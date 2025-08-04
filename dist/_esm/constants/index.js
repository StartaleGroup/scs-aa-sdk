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
export { OWNABLE_EXECUTOR_ADDRESS, RHINESTONE_ATTESTER_ADDRESS, REGISTRY_ADDRESS, SmartSessionMode, encodeSmartSessionSignature, getAddOwnableExecutorOwnerAction, getExecuteOnOwnedAccountAction, getAccount, getOwnableValidatorMockSignature, getOwnableValidatorThreshold, isModuleInstalled as isRhinestoneModuleInstalled, findTrustedAttesters, getTrustAttestersAction, getOwnableValidatorSignature, getAddOwnableValidatorOwnerAction, getOwnableValidatorOwners, getRemoveOwnableValidatorOwnerAction, getSetOwnableValidatorThresholdAction, decodeSmartSessionSignature, encodeValidationData, getEnableSessionDetails, getSmartSessionsValidator, getSudoPolicy, getSpendingLimitsPolicy, getUsageLimitPolicy, getValueLimitPolicy, getOwnableValidator, getUniversalActionPolicy } from "@rhinestone/module-sdk";
// Temporary address for smart sessions validator
export const SMART_SESSIONS_ADDRESS = "0x2358e7436B2bC3F8a82B4F128236a7AF1b32f23c";
export const OWNABLE_VALIDATOR_ADDRESS = "0x0000000000e9e6e96bcaa3c113187cdb7e38aed9";
// updated module and policy addresses as per latest V1. https://docs.rhinestone.dev/home/resources/address-book
export const UNIVERSAL_ACTION_POLICY_ADDRESS = "0x0000000000714Cf48FcF88A0bFBa70d313415032";
export const SUDO_POLICY_ADDRESS = "0x0000000000feec8d74e3143fbabbca515358d869";
export const TIME_FRAME_POLICY_ADDRESS = "0x0000000000D30f611fA3bf652ac6879428586930";
export const VALUE_LIMIT_POLICY_ADDRESS = "0x000000000021dc45451291bcdfc9f0b46d6f0278";
export const USAGE_LIMIT_POLICY_ADDRESS = "0x00000000001d4479fa2a947026204d0283cede4b";
export const SPENDING_LIMITS_POLICY_ADDRESS = "0x000000000033212e272655d8a22402db819477a6";
export const PERMIT_TYPEHASH = "0x6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c9";
//# sourceMappingURL=index.js.map