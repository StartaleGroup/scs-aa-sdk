"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitForTransactionReceipt = waitForTransactionReceipt;
const utils_1 = require("viem/utils");
const AccountNotFound_1 = require("../../../account/utils/AccountNotFound.js");
async function waitForTransactionReceipt(client, { account: account_ = client.account, hash }) {
    if (!account_)
        throw new AccountNotFound_1.AccountNotFoundError({
            docsPath: "/docs/actions/wallet/waitForTransactionReceipt"
        });
    const account = (0, utils_1.parseAccount)(account_);
    const accountClient = account?.client;
    if (!accountClient)
        throw new Error("Requires a Public Client");
    return accountClient.waitForTransactionReceipt({ hash });
}
//# sourceMappingURL=waitForTransactionReceipt.js.map