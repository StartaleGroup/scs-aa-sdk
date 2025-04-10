"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toAddOwnerCalls = void 0;
exports.getAddOwnerTx = getAddOwnerTx;
const utils_1 = require("viem/utils");
const AccountNotFound_1 = require("../../../../account/utils/AccountNotFound.js");
const constants_1 = require("../../../../constants/index.js");
async function getAddOwnerTx(client, parameters) {
    const { account: account_ = client.account, owner } = parameters;
    if (!account_) {
        throw new AccountNotFound_1.AccountNotFoundError({
            docsPath: "/nexus-client/methods#sendtransaction"
        });
    }
    const account = (0, utils_1.parseAccount)(account_);
    const publicClient = account.client;
    if (!publicClient) {
        throw new Error("Public client not found");
    }
    const nexusAccount = (0, constants_1.getAccount)({
        address: account.address,
        type: "nexus"
    });
    const action = await (0, constants_1.getAddOwnableValidatorOwnerAction)({
        account: nexusAccount,
        client: publicClient,
        owner
    });
    if (!("callData" in action)) {
        throw new Error("Error getting set threshold actions");
    }
    return {
        to: action.target,
        value: BigInt(action.value.toString()),
        data: action.callData
    };
}
const toAddOwnerCalls = async (account, parameters) => {
    return [await getAddOwnerTx({}, { ...parameters, account })];
};
exports.toAddOwnerCalls = toAddOwnerCalls;
//# sourceMappingURL=getAddOwnerTx.js.map