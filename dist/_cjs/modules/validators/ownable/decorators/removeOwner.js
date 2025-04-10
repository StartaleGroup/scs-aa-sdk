"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toRemoveOwnerCalls = void 0;
exports.removeOwner = removeOwner;
const account_abstraction_1 = require("viem/account-abstraction");
const utils_1 = require("viem/utils");
const AccountNotFound_1 = require("../../../../account/utils/AccountNotFound.js");
const constants_1 = require("../../../../constants/index.js");
async function removeOwner(client, parameters) {
    const { account: account_ = client.account, maxFeePerGas, maxPriorityFeePerGas, nonce, owner } = parameters;
    if (!account_) {
        throw new AccountNotFound_1.AccountNotFoundError({
            docsPath: "/nexus-client/methods#sendtransaction"
        });
    }
    const account = (0, utils_1.parseAccount)(account_);
    const calls = await (0, exports.toRemoveOwnerCalls)(account, { owner });
    return (0, utils_1.getAction)(client, account_abstraction_1.sendUserOperation, "sendUserOperation")({
        calls,
        maxFeePerGas,
        maxPriorityFeePerGas,
        nonce,
        account
    });
}
const toRemoveOwnerCalls = async (account, parameters) => {
    const action = await (0, constants_1.getRemoveOwnableValidatorOwnerAction)({
        account: (0, constants_1.getAccount)({ address: account.address, type: "nexus" }),
        client: account.client,
        owner: parameters.owner
    });
    if (!("callData" in action)) {
        throw new Error("Error getting remove owner action");
    }
    return [
        {
            to: action.target,
            value: BigInt(action.value.toString()),
            data: action.callData
        }
    ];
};
exports.toRemoveOwnerCalls = toRemoveOwnerCalls;
//# sourceMappingURL=removeOwner.js.map