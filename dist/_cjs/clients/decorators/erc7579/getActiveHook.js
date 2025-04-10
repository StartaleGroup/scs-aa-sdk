"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toGetActiveHookReads = void 0;
exports.getActiveHook = getActiveHook;
const actions_1 = require("viem/actions");
const utils_1 = require("viem/utils");
const AccountNotFound_1 = require("../../../account/utils/AccountNotFound.js");
const abi = [
    {
        inputs: [],
        name: "getActiveHook",
        outputs: [
            {
                internalType: "address",
                name: "hook",
                type: "address"
            }
        ],
        stateMutability: "view",
        type: "function"
    }
];
async function getActiveHook(client, parameters) {
    const account_ = parameters?.account ?? client.account;
    if (!account_) {
        throw new AccountNotFound_1.AccountNotFoundError({
            docsPath: "/nexus-client/methods#sendtransaction"
        });
    }
    const account = (0, utils_1.parseAccount)(account_);
    const publicClient = account.client;
    const [getActiveHookRead] = await (0, exports.toGetActiveHookReads)(account);
    return (0, utils_1.getAction)(publicClient, actions_1.readContract, "readContract")(getActiveHookRead);
}
const toGetActiveHookReads = async (account) => [
    {
        address: account.address,
        abi,
        functionName: "getActiveHook"
    }
];
exports.toGetActiveHookReads = toGetActiveHookReads;
//# sourceMappingURL=getActiveHook.js.map