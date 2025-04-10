"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOwners = getOwners;
const utils_1 = require("viem/utils");
const AccountNotFound_1 = require("../../../../account/utils/AccountNotFound.js");
const constants_1 = require("../../../../constants/index.js");
async function getOwners(client, parameters) {
    const { account: account_ = client.account } = parameters ?? {};
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
    const nexusAccount = (0, constants_1.getAccount)({
        address: account.address,
        type: "nexus"
    });
    return (0, constants_1.getOwnableValidatorOwners)({
        account: nexusAccount,
        client: publicClient
    });
}
//# sourceMappingURL=getOwners.js.map