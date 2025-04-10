"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toSetThresholdCalls = void 0;
exports.setThreshold = setThreshold;
const account_abstraction_1 = require("viem/account-abstraction");
const utils_1 = require("viem/utils");
const AccountNotFound_1 = require("../../../../account/utils/AccountNotFound.js");
const constants_1 = require("../../../../constants/index.js");
async function setThreshold(client, parameters) {
    const { account: account_ = client.account, maxFeePerGas, maxPriorityFeePerGas, nonce } = parameters;
    if (!account_) {
        throw new AccountNotFound_1.AccountNotFoundError({
            docsPath: "/nexus-client/methods#sendtransaction"
        });
    }
    const account = (0, utils_1.parseAccount)(account_);
    const calls = await (0, exports.toSetThresholdCalls)(account, parameters);
    return (0, utils_1.getAction)(client, account_abstraction_1.sendUserOperation, "sendUserOperation")({
        calls,
        maxFeePerGas,
        maxPriorityFeePerGas,
        nonce,
        account
    });
}
const toSetThresholdCalls = async (_, parameters) => {
    const action = (0, constants_1.getSetOwnableValidatorThresholdAction)({
        threshold: parameters.threshold
    });
    return [
        {
            to: action.target,
            value: BigInt(action.value.toString()),
            data: action.callData
        }
    ];
};
exports.toSetThresholdCalls = toSetThresholdCalls;
//# sourceMappingURL=setThreshold.js.map