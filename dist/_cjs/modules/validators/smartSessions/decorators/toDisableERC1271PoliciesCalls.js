"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toDisableERC1271PoliciesCalls = void 0;
const module_sdk_1 = require("@rhinestone/module-sdk");
const toDisableERC1271PoliciesCalls = async (_, parameters) => {
    const action = (0, module_sdk_1.getDisableERC1271PoliciesAction)({
        permissionId: parameters.permissionId,
        policies: parameters.policies,
        contents: parameters.contents
    });
    return [
        {
            to: action.target,
            value: BigInt(action.value.toString()),
            data: action.callData
        }
    ];
};
exports.toDisableERC1271PoliciesCalls = toDisableERC1271PoliciesCalls;
//# sourceMappingURL=toDisableERC1271PoliciesCalls.js.map