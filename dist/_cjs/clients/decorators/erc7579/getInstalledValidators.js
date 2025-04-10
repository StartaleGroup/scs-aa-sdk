"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toGetInstalledValidatorsReads = void 0;
exports.getInstalledValidators = getInstalledValidators;
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
        name: "getValidatorsPaginated",
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
async function getInstalledValidators(client, parameters) {
    const { account: account_ = client.account, pageSize = 100n, cursor = Constants_1.SENTINEL_ADDRESS } = parameters ?? {};
    if (!account_) {
        throw new AccountNotFound_1.AccountNotFoundError({
            docsPath: "/nexus-client/methods#sendtransaction"
        });
    }
    const account = (0, utils_1.parseAccount)(account_);
    const publicClient = account.client;
    const [getInstalledValidatorsRead] = await (0, exports.toGetInstalledValidatorsReads)(account, { pageSize, cursor });
    return (0, utils_1.getAction)(publicClient, actions_1.readContract, "readContract")(getInstalledValidatorsRead);
}
const toGetInstalledValidatorsReads = async (account, { pageSize = 100n, cursor = Constants_1.SENTINEL_ADDRESS }) => [
    {
        address: account.address,
        abi,
        functionName: "getValidatorsPaginated",
        args: [cursor, pageSize]
    }
];
exports.toGetInstalledValidatorsReads = toGetInstalledValidatorsReads;
//# sourceMappingURL=getInstalledValidators.js.map