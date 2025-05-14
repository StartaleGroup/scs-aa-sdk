"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareForMultiSign = prepareForMultiSign;
const utils_1 = require("viem/utils");
const AccountNotFound_1 = require("../../../../account/utils/AccountNotFound.js");
async function prepareForMultiSign(startaleAccountClient, parameters) {
    const { account: account_ = startaleAccountClient.account, ...rest } = parameters;
    if (!account_) {
        throw new AccountNotFound_1.AccountNotFoundError({
            docsPath: "/startale-client/methods#sendtransaction"
        });
    }
    const startaleAccount = (0, utils_1.parseAccount)(account_);
    const publicClient = startaleAccount?.client;
    if (!publicClient) {
        throw new Error("Public client not found");
    }
    const userOp = await startaleAccountClient.prepareUserOperation(rest);
    const userOpHash = startaleAccount.getUserOpHash(userOp);
    return { userOpHash, userOp };
}
//# sourceMappingURL=prepareForMultiSign.js.map