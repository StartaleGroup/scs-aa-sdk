"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiSign = multiSign;
const account_abstraction_1 = require("viem/account-abstraction");
const utils_1 = require("viem/utils");
const AccountNotFound_1 = require("../../../../account/utils/AccountNotFound.js");
const constants_1 = require("../../../../constants/index.js");
async function multiSign(client, parameters) {
    const { account: account_ = client.account, signatures, ...rest } = parameters;
    if (!account_) {
        throw new AccountNotFound_1.AccountNotFoundError({
            docsPath: "/nexus-client/methods#sendtransaction"
        });
    }
    const account = (0, utils_1.parseAccount)(account_);
    const publicClient = account?.client;
    if (!publicClient) {
        throw new Error("Public client not found");
    }
    return (0, account_abstraction_1.sendUserOperation)(client, {
        ...rest,
        signature: (0, constants_1.getOwnableValidatorSignature)({ signatures })
    });
}
//# sourceMappingURL=multiSign.js.map