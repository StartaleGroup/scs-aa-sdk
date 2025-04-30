"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PERMIT_TYPEHASH = exports.SPENDING_LIMITS_POLICY_ADDRESS = exports.USAGE_LIMIT_POLICY_ADDRESS = exports.VALUE_LIMIT_POLICY_ADDRESS = exports.TIME_FRAME_POLICY_ADDRESS = exports.SUDO_POLICY_ADDRESS = exports.UNIVERSAL_ACTION_POLICY_ADDRESS = exports.getUniversalActionPolicy = exports.getOwnableValidator = exports.getValueLimitPolicy = exports.getUsageLimitPolicy = exports.getSpendingLimitsPolicy = exports.getSudoPolicy = exports.getSmartSessionsValidator = exports.getEnableSessionDetails = exports.encodeValidationData = exports.decodeSmartSessionSignature = exports.getSetOwnableValidatorThresholdAction = exports.getRemoveOwnableValidatorOwnerAction = exports.getOwnableValidatorOwners = exports.getAddOwnableValidatorOwnerAction = exports.getOwnableValidatorSignature = exports.getTrustAttestersAction = exports.findTrustedAttesters = exports.isRhinestoneModuleInstalled = exports.getOwnableValidatorThreshold = exports.getOwnableValidatorMockSignature = exports.getAccount = exports.getExecuteOnOwnedAccountAction = exports.getAddOwnableExecutorOwnerAction = exports.encodeSmartSessionSignature = exports.SmartSessionMode = exports.REGISTRY_ADDRESS = exports.RHINESTONE_ATTESTER_ADDRESS = exports.OWNABLE_EXECUTOR_ADDRESS = exports.OWNABLE_VALIDATOR_ADDRESS = exports.SMART_SESSIONS_ADDRESS = exports.ACCOUNT_IMPLEMENTATION_ADDRESS = exports.COMPOSABLE_MODULE_ADDRESS = exports.ACCOUNT_FACTORY_ADDRESS = exports.BICONOMY_ATTESTER_ADDRESS_UNTIL_0_1 = exports.BICONOMY_ATTESTER_ADDRESS = exports.MEE_VALIDATOR_ADDRESS = exports.BOOTSTRAP_ADDRESS = exports.ENTRYPOINT_SIMULATIONS_ADDRESS = exports.ENTRY_POINT_ADDRESS = void 0;
const tslib_1 = require("tslib");
const module_sdk_1 = require("@rhinestone/module-sdk");
const viem_1 = require("viem");
const modules_1 = require("../modules/index.js");
tslib_1.__exportStar(require("./abi/index.js"), exports);
exports.ENTRY_POINT_ADDRESS = "0x0000000071727De22E5E9d8BAf0edAc6f37da032";
exports.ENTRYPOINT_SIMULATIONS_ADDRESS = "0x74Cb5e4eE81b86e70f9045036a1C5477de69eE87";
exports.BOOTSTRAP_ADDRESS = "0x7773CD63A3Bb628F1B234bD46fc1574F37753CC2";
exports.MEE_VALIDATOR_ADDRESS = "0x00000000d12897DDAdC2044614A9677B191A2d95";
exports.BICONOMY_ATTESTER_ADDRESS = "0xF9ff902Cdde729b47A4cDB55EF16DF3683a04EAB";
exports.BICONOMY_ATTESTER_ADDRESS_UNTIL_0_1 = "0xDE8FD2dBcC0CA847d11599AF5964fe2AEa153699";
exports.ACCOUNT_FACTORY_ADDRESS = "0xF227EB456F1B0AC51b07f451040ec1c44aB8D1aA";
exports.COMPOSABLE_MODULE_ADDRESS = "0x00000004430bB055dB66eBef6Fe5Ee1DA9668B10";
exports.ACCOUNT_IMPLEMENTATION_ADDRESS = "0x0f5fB606cF3194C2c181A184E459dD461BaA4D51";
var module_sdk_2 = require("@rhinestone/module-sdk");
Object.defineProperty(exports, "SMART_SESSIONS_ADDRESS", { enumerable: true, get: function () { return module_sdk_2.SMART_SESSIONS_ADDRESS; } });
Object.defineProperty(exports, "OWNABLE_VALIDATOR_ADDRESS", { enumerable: true, get: function () { return module_sdk_2.OWNABLE_VALIDATOR_ADDRESS; } });
Object.defineProperty(exports, "OWNABLE_EXECUTOR_ADDRESS", { enumerable: true, get: function () { return module_sdk_2.OWNABLE_EXECUTOR_ADDRESS; } });
Object.defineProperty(exports, "RHINESTONE_ATTESTER_ADDRESS", { enumerable: true, get: function () { return module_sdk_2.RHINESTONE_ATTESTER_ADDRESS; } });
Object.defineProperty(exports, "REGISTRY_ADDRESS", { enumerable: true, get: function () { return module_sdk_2.REGISTRY_ADDRESS; } });
Object.defineProperty(exports, "SmartSessionMode", { enumerable: true, get: function () { return module_sdk_2.SmartSessionMode; } });
Object.defineProperty(exports, "encodeSmartSessionSignature", { enumerable: true, get: function () { return module_sdk_2.encodeSmartSessionSignature; } });
Object.defineProperty(exports, "getAddOwnableExecutorOwnerAction", { enumerable: true, get: function () { return module_sdk_2.getAddOwnableExecutorOwnerAction; } });
Object.defineProperty(exports, "getExecuteOnOwnedAccountAction", { enumerable: true, get: function () { return module_sdk_2.getExecuteOnOwnedAccountAction; } });
Object.defineProperty(exports, "getAccount", { enumerable: true, get: function () { return module_sdk_2.getAccount; } });
Object.defineProperty(exports, "getOwnableValidatorMockSignature", { enumerable: true, get: function () { return module_sdk_2.getOwnableValidatorMockSignature; } });
Object.defineProperty(exports, "getOwnableValidatorThreshold", { enumerable: true, get: function () { return module_sdk_2.getOwnableValidatorThreshold; } });
Object.defineProperty(exports, "isRhinestoneModuleInstalled", { enumerable: true, get: function () { return module_sdk_2.isModuleInstalled; } });
Object.defineProperty(exports, "findTrustedAttesters", { enumerable: true, get: function () { return module_sdk_2.findTrustedAttesters; } });
Object.defineProperty(exports, "getTrustAttestersAction", { enumerable: true, get: function () { return module_sdk_2.getTrustAttestersAction; } });
Object.defineProperty(exports, "getOwnableValidatorSignature", { enumerable: true, get: function () { return module_sdk_2.getOwnableValidatorSignature; } });
Object.defineProperty(exports, "getAddOwnableValidatorOwnerAction", { enumerable: true, get: function () { return module_sdk_2.getAddOwnableValidatorOwnerAction; } });
Object.defineProperty(exports, "getOwnableValidatorOwners", { enumerable: true, get: function () { return module_sdk_2.getOwnableValidatorOwners; } });
Object.defineProperty(exports, "getRemoveOwnableValidatorOwnerAction", { enumerable: true, get: function () { return module_sdk_2.getRemoveOwnableValidatorOwnerAction; } });
Object.defineProperty(exports, "getSetOwnableValidatorThresholdAction", { enumerable: true, get: function () { return module_sdk_2.getSetOwnableValidatorThresholdAction; } });
Object.defineProperty(exports, "decodeSmartSessionSignature", { enumerable: true, get: function () { return module_sdk_2.decodeSmartSessionSignature; } });
Object.defineProperty(exports, "encodeValidationData", { enumerable: true, get: function () { return module_sdk_2.encodeValidationData; } });
Object.defineProperty(exports, "getEnableSessionDetails", { enumerable: true, get: function () { return module_sdk_2.getEnableSessionDetails; } });
Object.defineProperty(exports, "getSmartSessionsValidator", { enumerable: true, get: function () { return module_sdk_2.getSmartSessionsValidator; } });
Object.defineProperty(exports, "getSudoPolicy", { enumerable: true, get: function () { return module_sdk_2.getSudoPolicy; } });
Object.defineProperty(exports, "getSpendingLimitsPolicy", { enumerable: true, get: function () { return module_sdk_2.getSpendingLimitsPolicy; } });
Object.defineProperty(exports, "getUsageLimitPolicy", { enumerable: true, get: function () { return module_sdk_2.getUsageLimitPolicy; } });
Object.defineProperty(exports, "getValueLimitPolicy", { enumerable: true, get: function () { return module_sdk_2.getValueLimitPolicy; } });
Object.defineProperty(exports, "getOwnableValidator", { enumerable: true, get: function () { return module_sdk_2.getOwnableValidator; } });
Object.defineProperty(exports, "getUniversalActionPolicy", { enumerable: true, get: function () { return module_sdk_2.getUniversalActionPolicy; } });
exports.UNIVERSAL_ACTION_POLICY_ADDRESS = (0, module_sdk_1.getUniversalActionPolicy)({
    valueLimitPerUse: 0n,
    paramRules: {
        length: 16,
        rules: new Array(16).fill({
            condition: modules_1.ParamCondition.EQUAL,
            isLimited: false,
            offset: 0,
            ref: (0, viem_1.toHex)((0, viem_1.toBytes)("0x", { size: 32 })),
            usage: { limit: BigInt(0), used: BigInt(0) }
        })
    }
}).address;
exports.SUDO_POLICY_ADDRESS = (0, module_sdk_1.getSudoPolicy)().address;
exports.TIME_FRAME_POLICY_ADDRESS = (0, module_sdk_1.getTimeFramePolicy)({
    validUntil: 0,
    validAfter: 0
}).address;
exports.VALUE_LIMIT_POLICY_ADDRESS = (0, module_sdk_1.getValueLimitPolicy)({
    limit: 0n
}).address;
exports.USAGE_LIMIT_POLICY_ADDRESS = (0, module_sdk_1.getUsageLimitPolicy)({
    limit: 0n
}).address;
exports.SPENDING_LIMITS_POLICY_ADDRESS = (0, module_sdk_1.getSpendingLimitsPolicy)([
    {
        token: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        limit: 0n
    }
]).address;
exports.PERMIT_TYPEHASH = "0x6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c9";
//# sourceMappingURL=index.js.map