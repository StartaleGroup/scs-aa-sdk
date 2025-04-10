"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toRemoveSessionCalls = void 0;
const module_sdk_1 = require("@rhinestone/module-sdk");
const toRemoveSessionCalls = async (_, parameters) => {
    const action = (0, module_sdk_1.getRemoveSessionAction)({
        permissionId: parameters.permissionId
    });
    return [
        {
            to: action.target,
            value: BigInt(action.value.toString()),
            data: action.callData
        }
    ];
};
exports.toRemoveSessionCalls = toRemoveSessionCalls;
//# sourceMappingURL=toRemoveSessionCalls.js.map