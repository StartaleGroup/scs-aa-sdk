"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toGetInstalledExecutorsReads = void 0;
exports.getInstalledExecutors = getInstalledExecutors;
const actions_1 = require("viem/actions");
const utils_1 = require("viem/utils");
const AccountNotFound_1 = require("../../../account/utils/AccountNotFound.js");
const Constants_1 = require("../../../account/utils/Constants.js");
const abi = [
    {
        inputs: [
            {
                internalType: "address",
                name: "cursor",
                type: "address"
            },
            {
                internalType: "uint256",
                name: "size",
                type: "uint256"
            }
        ],
        name: "getExecutorsPaginated",
        outputs: [
            {
                internalType: "address[]",
                name: "array",
                type: "address[]"
            },
            {
                internalType: "address",
                name: "next",
                type: "address"
            }
        ],
        stateMutability: "view",
        type: "function"
    }
];
async function getInstalledExecutors(client, parameters) {
    const account_ = parameters?.account ?? client.account;
    const pageSize = parameters?.pageSize ?? 100n;
    const cursor = parameters?.cursor ?? Constants_1.SENTINEL_ADDRESS;
    if (!account_) {
        throw new AccountNotFound_1.AccountNotFoundError({
            docsPath: "/nexus-client/methods#sendtransaction"
        });
    }
    const account = (0, utils_1.parseAccount)(account_);
    const publicClient = account.client;
    const [getInstalledExecutorsRead] = await (0, exports.toGetInstalledExecutorsReads)(account, { pageSize, cursor });
    return (0, utils_1.getAction)(publicClient, actions_1.readContract, "readContract")(getInstalledExecutorsRead);
}
const toGetInstalledExecutorsReads = async (account, { pageSize = 100n, cursor = Constants_1.SENTINEL_ADDRESS }) => [
    {
        address: account.address,
        abi,
        functionName: "getExecutorsPaginated",
        args: [cursor, pageSize]
    }
];
exports.toGetInstalledExecutorsReads = toGetInstalledExecutorsReads;
//# sourceMappingURL=getInstalledExecutors.js.map