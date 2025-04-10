"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toUpgradeSmartAccountCalls = void 0;
exports.upgradeSmartAccount = upgradeSmartAccount;
const viem_1 = require("viem");
const account_abstraction_1 = require("viem/account-abstraction");
const utils_1 = require("viem/utils");
const AccountNotFound_1 = require("../../../account/utils/AccountNotFound.js");
const constants_1 = require("../../../constants/index.js");
async function upgradeSmartAccount(client, parameters) {
    const { account: account_ = client.account, maxFeePerGas, maxPriorityFeePerGas, nonce, implementationAddress = constants_1.ACCOUNT_IMPLEMENTATION_ADDRESS, initData = "0x", ...rest } = parameters ?? {};
    if (!account_) {
        throw new AccountNotFound_1.AccountNotFoundError({
            docsPath: "/nexus-client/methods#upgradeSmartAccount"
        });
    }
    const account = (0, utils_1.parseAccount)(account_);
    const calls = await (0, exports.toUpgradeSmartAccountCalls)(account, {
        implementationAddress,
        initData
    });
    const sendUserOperationParams = {
        calls,
        maxFeePerGas,
        maxPriorityFeePerGas,
        nonce,
        account,
        ...rest
    };
    return (0, utils_1.getAction)(client, account_abstraction_1.sendUserOperation, "sendUserOperation")(sendUserOperationParams);
}
const toUpgradeSmartAccountCalls = async (account, { implementationAddress, initData }) => [
    {
        to: account.address,
        value: BigInt(0),
        data: (0, viem_1.encodeFunctionData)({
            abi: [
                {
                    name: "upgradeToAndCall",
                    type: "function",
                    stateMutability: "payable",
                    inputs: [
                        {
                            type: "address",
                            name: "newImplementation"
                        },
                        {
                            type: "bytes",
                            name: "data"
                        }
                    ],
                    outputs: []
                }
            ],
            functionName: "upgradeToAndCall",
            args: [(0, viem_1.getAddress)(implementationAddress), initData]
        })
    }
];
exports.toUpgradeSmartAccountCalls = toUpgradeSmartAccountCalls;
//# sourceMappingURL=upgradeSmartAccount.js.map