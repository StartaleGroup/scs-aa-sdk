import type { Address, Hex } from "viem";
export * from "./abi";
export declare const ENTRY_POINT_ADDRESS: Hex;
export declare const ENTRYPOINT_SIMULATIONS_ADDRESS: Hex;
export declare const BOOTSTRAP_ADDRESS: Hex;
export declare const ACCOUNT_FACTORY_ADDRESS: Hex;
export declare const ACCOUNT_IMPLEMENTATION_ADDRESS: Hex;
export declare const COUNTER_CONTRACT_ADDRESS_MINATO: Hex;
export { SMART_SESSIONS_ADDRESS, OWNABLE_VALIDATOR_ADDRESS, OWNABLE_EXECUTOR_ADDRESS, RHINESTONE_ATTESTER_ADDRESS, REGISTRY_ADDRESS, type EnableSessionData, type ActionData, type PolicyData, type Session, SmartSessionMode, encodeSmartSessionSignature, getAddOwnableExecutorOwnerAction, getExecuteOnOwnedAccountAction, getAccount, getOwnableValidatorMockSignature, getOwnableValidatorThreshold, isModuleInstalled as isRhinestoneModuleInstalled, findTrustedAttesters, getTrustAttestersAction, getOwnableValidatorSignature, getAddOwnableValidatorOwnerAction, getOwnableValidatorOwners, getRemoveOwnableValidatorOwnerAction, getSetOwnableValidatorThresholdAction, decodeSmartSessionSignature, encodeValidationData, getEnableSessionDetails, getSmartSessionsValidator, getSudoPolicy, getSpendingLimitsPolicy, getUsageLimitPolicy, getValueLimitPolicy, getOwnableValidator, getUniversalActionPolicy } from "@rhinestone/module-sdk";
export declare const UNIVERSAL_ACTION_POLICY_ADDRESS: Address;
export declare const SUDO_POLICY_ADDRESS: Hex;
export declare const TIME_FRAME_POLICY_ADDRESS: Hex;
export declare const VALUE_LIMIT_POLICY_ADDRESS: Hex;
export declare const USAGE_LIMIT_POLICY_ADDRESS: Hex;
export declare const SPENDING_LIMITS_POLICY_ADDRESS: Hex;
export declare const PERMIT_TYPEHASH = "0x6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c9";
//# sourceMappingURL=index.d.ts.map