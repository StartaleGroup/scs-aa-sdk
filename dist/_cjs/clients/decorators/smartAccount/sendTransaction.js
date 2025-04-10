"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTransaction = sendTransaction;
const account_abstraction_1 = require("viem/account-abstraction");
const utils_1 = require("viem/utils");
const AccountNotFound_1 = require("../../../account/utils/AccountNotFound.js");
async function sendTransaction(client, args) {
    let userOpHash;
    if ("to" in args) {
        const { account: account_ = client.account, data, maxFeePerGas, maxPriorityFeePerGas, to, value, nonce } = args;
        if (!account_) {
            throw new AccountNotFound_1.AccountNotFoundError({
                docsPath: "/nexus-client/methods#sendtransaction"
            });
        }
        const account = (0, utils_1.parseAccount)(account_);
        if (!to)
            throw new Error("Missing to address");
        userOpHash = await (0, utils_1.getAction)(client, account_abstraction_1.sendUserOperation, "sendUserOperation")({
            calls: [
                {
                    to,
                    value: value || BigInt(0),
                    data: data || "0x"
                }
            ],
            account,
            maxFeePerGas,
            maxPriorityFeePerGas,
            nonce: nonce ? BigInt(nonce) : undefined
        });
    }
    else {
        userOpHash = await (0, utils_1.getAction)(client, account_abstraction_1.sendUserOperation, "sendUserOperation")({ ...args });
    }
    const userOperationReceipt = await (0, utils_1.getAction)(client, account_abstraction_1.waitForUserOperationReceipt, "waitForUserOperationReceipt")({
        hash: userOpHash
    });
    return userOperationReceipt?.receipt.transactionHash;
}
//# sourceMappingURL=sendTransaction.js.map