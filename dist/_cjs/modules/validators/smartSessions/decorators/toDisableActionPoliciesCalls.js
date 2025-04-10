"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toDisableActionPoliciesCalls = void 0;
const module_sdk_1 = require("@rhinestone/module-sdk");
const toDisableActionPoliciesCalls = async (_, parameters) => {
    const action = (0, module_sdk_1.getDisableActionPoliciesAction)({
        permissionId: parameters.permissionId,
        actionId: parameters.actionId,
        policies: parameters.policies
    });
    return [
        {
            to: action.target,
            value: BigInt(action.value.toString()),
            data: action.callData
        }
    ];
};
exports.toDisableActionPoliciesCalls = toDisableActionPoliciesCalls;
//# sourceMappingURL=toDisableActionPoliciesCalls.js.map