"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toEnableUserOpPoliciesCalls = void 0;
const module_sdk_1 = require("@rhinestone/module-sdk");
const toEnableUserOpPoliciesCalls = async (_, parameters) => {
    const action = (0, module_sdk_1.getEnableUserOpPoliciesAction)({
        permissionId: parameters.permissionId,
        userOpPolicies: parameters.userOpPolicies
    });
    return [
        {
            to: action.target,
            value: BigInt(action.value.toString()),
            data: action.callData
        }
    ];
};
exports.toEnableUserOpPoliciesCalls = toEnableUserOpPoliciesCalls;
//# sourceMappingURL=toEnableUserOpPoliciesCalls.js.map