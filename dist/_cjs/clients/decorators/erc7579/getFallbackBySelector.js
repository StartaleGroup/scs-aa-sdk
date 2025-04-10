"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toGetFallbackBySelectorReads = void 0;
exports.getFallbackBySelector = getFallbackBySelector;
const actions_1 = require("viem/actions");
const utils_1 = require("viem/utils");
const AccountNotFound_1 = require("../../../account/utils/AccountNotFound.js");
const Constants_1 = require("../../../account/utils/Constants.js");
const abi = [
    {
        inputs: [
            {
                internalType: "bytes4",
                name: "selector",
                type: "bytes4"
            }
        ],
        name: "getFallbackHandlerBySelector",
        outputs: [
            {
                internalType: "CallType",
                name: "",
                type: "bytes1"
            },
            {
                internalType: "address",
                name: "",
                type: "address"
            }
        ],
        stateMutability: "view",
        type: "function"
    }
];
async function getFallbackBySelector(client, parameters) {
    const { account: account_ = client.account, selector = Constants_1.GENERIC_FALLBACK_SELECTOR } = parameters;
    if (!account_) {
        throw new AccountNotFound_1.AccountNotFoundError({
            docsPath: "/nexus-client/methods#sendtransaction"
        });
    }
    const account = (0, utils_1.parseAccount)(account_);
    const publicClient = account.client;
    const [getFallbackBySelectorRead] = await (0, exports.toGetFallbackBySelectorReads)(account, selector);
    return (0, utils_1.getAction)(publicClient, actions_1.readContract, "readContract")(getFallbackBySelectorRead);
}
const toGetFallbackBySelectorReads = async (account, selector) => [
    {
        address: account.address,
        abi,
        functionName: "getFallbackHandlerBySelector",
        args: [selector]
    }
];
exports.toGetFallbackBySelectorReads = toGetFallbackBySelectorReads;
//# sourceMappingURL=getFallbackBySelector.js.map