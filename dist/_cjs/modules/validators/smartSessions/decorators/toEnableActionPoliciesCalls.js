"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toEnableActionPoliciesCalls = void 0;
const module_sdk_1 = require("@rhinestone/module-sdk");
const toEnableActionPoliciesCalls = async (_, parameters) => {
    const action = (0, module_sdk_1.getEnableActionPoliciesAction)({
        permissionId: parameters.permissionId,
        actionPolicies: parameters.actionPolicies
    });
    return [
        {
            to: action.target,
            value: BigInt(action.value.toString()),
            data: action.callData
        }
    ];
};
exports.toEnableActionPoliciesCalls = toEnableActionPoliciesCalls;
//# sourceMappingURL=toEnableActionPoliciesCalls.js.map