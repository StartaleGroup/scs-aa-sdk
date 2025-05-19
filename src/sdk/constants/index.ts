import { getSpendingLimitsPolicy, getSudoPolicy, getTimeFramePolicy, getUsageLimitPolicy, getValueLimitPolicy } from "@rhinestone/module-sdk"
import type { Address, Hex } from "viem"

export * from "./abi"

export const ENTRY_POINT_ADDRESS: Hex =
  "0x0000000071727De22E5E9d8BAf0edAc6f37da032"
export const ENTRYPOINT_SIMULATIONS_ADDRESS: Hex =
  "0x74Cb5e4eE81b86e70f9045036a1C5477de69eE87"
export const BOOTSTRAP_ADDRESS: Hex =
  "0x7773CD63A3Bb628F1B234bD46fc1574F37753CC2"
export const ACCOUNT_FACTORY_ADDRESS: Hex =
  "0xF227EB456F1B0AC51b07f451040ec1c44aB8D1aA"
export const ACCOUNT_IMPLEMENTATION_ADDRESS: Hex =
  "0x0f5fB606cF3194C2c181A184E459dD461BaA4D51"
// Rhinestone constants
export {
  SMART_SESSIONS_ADDRESS,
  OWNABLE_VALIDATOR_ADDRESS,
  OWNABLE_EXECUTOR_ADDRESS,
  RHINESTONE_ATTESTER_ADDRESS,
  REGISTRY_ADDRESS,
  type EnableSessionData,
  type ActionData,
  type PolicyData,
  type Session,
  SmartSessionMode,
  encodeSmartSessionSignature,
  getAddOwnableExecutorOwnerAction,
  getExecuteOnOwnedAccountAction,
  getAccount,
  getOwnableValidatorMockSignature,
  getOwnableValidatorThreshold,
  isModuleInstalled as isRhinestoneModuleInstalled,
  findTrustedAttesters,
  getTrustAttestersAction,
  getOwnableValidatorSignature,
  getAddOwnableValidatorOwnerAction,
  getOwnableValidatorOwners,
  getRemoveOwnableValidatorOwnerAction,
  getSetOwnableValidatorThresholdAction,
  decodeSmartSessionSignature,
  encodeValidationData,
  getEnableSessionDetails,
  getSmartSessionsValidator,
  getSudoPolicy,
  getSpendingLimitsPolicy,
  getUsageLimitPolicy,
  getValueLimitPolicy,
  getOwnableValidator,
  getUniversalActionPolicy
} from "@rhinestone/module-sdk"

export const UNIVERSAL_ACTION_POLICY_ADDRESS: Address =
  '0x0000006DDA6c463511C4e9B05CFc34C1247fCF1F'

export const SUDO_POLICY_ADDRESS: Hex = getSudoPolicy().address;

export const TIME_FRAME_POLICY_ADDRESS: Hex = getTimeFramePolicy({
  validUntil: 0,
  validAfter: 0
}).address

export const VALUE_LIMIT_POLICY_ADDRESS: Hex = getValueLimitPolicy({
  limit: 0n
}).address

export const USAGE_LIMIT_POLICY_ADDRESS: Hex = getUsageLimitPolicy({
  limit: 0n
}).address

export const SPENDING_LIMITS_POLICY_ADDRESS: Hex = getSpendingLimitsPolicy([
  {
    token: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    limit: 0n
  }
]).address

export const PERMIT_TYPEHASH =
  "0x6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c9"
