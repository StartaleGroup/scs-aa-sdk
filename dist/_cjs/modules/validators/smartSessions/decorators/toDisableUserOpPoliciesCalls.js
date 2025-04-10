"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toDisableUserOpPoliciesCalls = void 0;
const module_sdk_1 = require("@rhinestone/module-sdk");
const toDisableUserOpPoliciesCalls = async (_, parameters) => {
    const action = (0, module_sdk_1.getDisableUserOpPoliciesAction)({
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
exports.toDisableUserOpPoliciesCalls = toDisableUserOpPoliciesCalls;
//# sourceMappingURL=toDisableUserOpPoliciesCalls.js.map