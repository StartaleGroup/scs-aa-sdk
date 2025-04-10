"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareForMultiSign = prepareForMultiSign;
const utils_1 = require("viem/utils");
const AccountNotFound_1 = require("../../../../account/utils/AccountNotFound.js");
async function prepareForMultiSign(nexusClient, parameters) {
    const { account: account_ = nexusClient.account, ...rest } = parameters;
    if (!account_) {
        throw new AccountNotFound_1.AccountNotFoundError({
            docsPath: "/nexus-client/methods#sendtransaction"
        });
    }
    const nexusAccount = (0, utils_1.parseAccount)(account_);
    const publicClient = nexusAccount?.client;
    if (!publicClient) {
        throw new Error("Public client not found");
    }
    const userOp = await nexusClient.prepareUserOperation(rest);
    const userOpHash = nexusAccount.getUserOpHash(userOp);
    return { userOpHash, userOp };
}
//# sourceMappingURL=prepareForMultiSign.js.map