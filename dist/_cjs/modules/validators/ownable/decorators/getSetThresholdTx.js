"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toSetThresholdCalls = void 0;
exports.getSetThresholdTx = getSetThresholdTx;
const utils_1 = require("viem/utils");
const AccountNotFound_1 = require("../../../../account/utils/AccountNotFound.js");
const constants_1 = require("../../../../constants/index.js");
async function getSetThresholdTx(client, parameters) {
    const { account: account_ = client.account, threshold } = parameters;
    if (!account_) {
        throw new AccountNotFound_1.AccountNotFoundError({
            docsPath: "/nexus-client/methods#sendtransaction"
        });
    }
    const account = (0, utils_1.parseAccount)(account_);
    if (!account)
        throw new Error("Account not found");
    const action = (0, constants_1.getSetOwnableValidatorThresholdAction)({ threshold });
    if (!("callData" in action)) {
        throw new Error("Error getting set threshold actions");
    }
    return {
        to: action.target,
        value: BigInt(action.value.toString()),
        data: action.callData
    };
}
const toSetThresholdCalls = async (account, parameters) => {
    return [await getSetThresholdTx({}, { ...parameters, account })];
};
exports.toSetThresholdCalls = toSetThresholdCalls;
//# sourceMappingURL=getSetThresholdTx.js.map