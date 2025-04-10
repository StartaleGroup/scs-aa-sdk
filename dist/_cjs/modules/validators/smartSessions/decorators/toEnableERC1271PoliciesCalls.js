"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toEnableERC1271PoliciesCalls = void 0;
const module_sdk_1 = require("@rhinestone/module-sdk");
const toEnableERC1271PoliciesCalls = async (_, parameters) => {
    const action = (0, module_sdk_1.getEnableERC1271PoliciesAction)({
        permissionId: parameters.permissionId,
        erc1271Policies: parameters.erc1271Policies
    });
    return [
        {
            to: action.target,
            value: BigInt(action.value.toString()),
            data: action.callData
        }
    ];
};
exports.toEnableERC1271PoliciesCalls = toEnableERC1271PoliciesCalls;
//# sourceMappingURL=toEnableERC1271PoliciesCalls.js.map