"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toRemoveOwnerCalls = void 0;
exports.getRemoveOwnerTx = getRemoveOwnerTx;
const utils_1 = require("viem/utils");
const AccountNotFound_1 = require("../../../../account/utils/AccountNotFound.js");
const constants_1 = require("../../../../constants/index.js");
async function getRemoveOwnerTx(client, parameters) {
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
    const action = await (0, constants_1.getRemoveOwnableValidatorOwnerAction)({
        account: { address: account.address, deployedOnChains: [], type: "nexus" },
        client: publicClient,
        owner
    });
    if (!("callData" in action)) {
        throw new Error("Error getting remove owner action");
    }
    return {
        to: action.target,
        value: BigInt(action.value.toString()),
        data: action.callData
    };
}
const toRemoveOwnerCalls = async (account, parameters) => {
    return [await getRemoveOwnerTx({}, { ...parameters, account })];
};
exports.toRemoveOwnerCalls = toRemoveOwnerCalls;
//# sourceMappingURL=getRemoveOwnerTx.js.map