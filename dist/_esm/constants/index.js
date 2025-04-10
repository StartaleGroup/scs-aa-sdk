import { GLOBAL_CONSTANTS } from "@rhinestone/module-sdk";
export * from "./abi/index.js";
export const ENTRY_POINT_ADDRESS = "0x0000000071727De22E5E9d8BAf0edAc6f37da032";
export const ENTRYPOINT_SIMULATIONS_ADDRESS = "0x74Cb5e4eE81b86e70f9045036a1C5477de69eE87";
export const BOOTSTRAP_ADDRESS = "0x7773CD63A3Bb628F1B234bD46fc1574F37753CC2";
export const MEE_VALIDATOR_ADDRESS = "0x00000000d12897DDAdC2044614A9677B191A2d95";
export const BICONOMY_ATTESTER_ADDRESS = "0xF9ff902Cdde729b47A4cDB55EF16DF3683a04EAB";
export const BICONOMY_ATTESTER_ADDRESS_UNTIL_0_1 = "0xDE8FD2dBcC0CA847d11599AF5964fe2AEa153699";
export const ACCOUNT_FACTORY_ADDRESS = "0xF227EB456F1B0AC51b07f451040ec1c44aB8D1aA";
export const COMPOSABLE_MODULE_ADDRESS = "0x00000004430bB055dB66eBef6Fe5Ee1DA9668B10";
export const ACCOUNT_IMPLEMENTATION_ADDRESS = "0x0f5fB606cF3194C2c181A184E459dD461BaA4D51";
// Rhinestone constants
export { SMART_SESSIONS_ADDRESS, OWNABLE_VALIDATOR_ADDRESS, OWNABLE_EXECUTOR_ADDRESS, RHINESTONE_ATTESTER_ADDRESS, REGISTRY_ADDRESS, SmartSessionMode, encodeSmartSessionSignature, getAddOwnableExecutorOwnerAction, getExecuteOnOwnedAccountAction, getAccount, getOwnableValidatorMockSignature, getOwnableValidatorThreshold, isModuleInstalled as isRhinestoneModuleInstalled, findTrustedAttesters, getTrustAttestersAction, getOwnableValidatorSignature, getAddOwnableValidatorOwnerAction, getOwnableValidatorOwners, getRemoveOwnableValidatorOwnerAction, getSetOwnableValidatorThresholdAction, decodeSmartSessionSignature, encodeValidationData, getEnableSessionDetails, getSmartSessionsValidator, getSudoPolicy, getSpendingLimitsPolicy, getUsageLimitPolicy, getValueLimitPolicy, getOwnableValidator, getUniversalActionPolicy } from "@rhinestone/module-sdk";
// Rhinestone doesn't export the universal action policy address, so we need to get it from the policies
export const UNIVERSAL_ACTION_POLICY_ADDRESS = GLOBAL_CONSTANTS.UNIVERSAL_ACTION_POLICY_ADDRESS;
export const TIME_FRAME_POLICY_ADDRESS = GLOBAL_CONSTANTS.TIME_FRAME_POLICY_ADDRESS;
export const VALUE_LIMIT_POLICY_ADDRESS = GLOBAL_CONSTANTS.VALUE_LIMIT_POLICY_ADDRESS;
export const USAGE_LIMIT_POLICY_ADDRESS = GLOBAL_CONSTANTS.USAGE_LIMIT_POLICY_ADDRESS;
export const SPENDING_LIMITS_POLICY_ADDRESS = GLOBAL_CONSTANTS.SPENDING_LIMITS_POLICY_ADDRESS;
export const SUDO_POLICY_ADDRESS = GLOBAL_CONSTANTS.SUDO_POLICY_ADDRESS;
export const PERMIT_TYPEHASH = "0x6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c9";
//# sourceMappingURL=index.js.map