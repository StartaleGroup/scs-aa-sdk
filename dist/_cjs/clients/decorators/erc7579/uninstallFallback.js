"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toUninstallFallbackCalls = void 0;
exports.uninstallFallback = uninstallFallback;
const viem_1 = require("viem");
const account_abstraction_1 = require("viem/account-abstraction");
const utils_1 = require("viem/utils");
const utils_2 = require("viem/utils");
const AccountNotFound_1 = require("../../../account/utils/AccountNotFound.js");
const supportsModule_1 = require("./supportsModule.js");
async function uninstallFallback(client, parameters) {
    const { account: account_ = client.account, maxFeePerGas, maxPriorityFeePerGas, nonce, module } = parameters;
    if (!account_) {
        throw new AccountNotFound_1.AccountNotFoundError({
            docsPath: "/nexus-client/methods#sendtransaction"
        });
    }
    const account = (0, utils_2.parseAccount)(account_);
    const calls = await (0, exports.toUninstallFallbackCalls)(account, module);
    return (0, utils_1.getAction)(client, account_abstraction_1.sendUserOperation, "sendUserOperation")({
        calls,
        maxFeePerGas,
        maxPriorityFeePerGas,
        nonce,
        account: account
    });
}
const toUninstallFallbackCalls = async (account, { address, initData, type }) => [
    {
        to: account.address,
        value: BigInt(0),
        data: (0, viem_1.encodeFunctionData)({
            abi: [
                {
                    name: "uninstallFallback",
                    type: "function",
                    stateMutability: "nonpayable",
                    inputs: [
                        {
                            type: "uint256",
                            name: "moduleTypeId"
                        },
                        {
                            type: "address",
                            name: "module"
                        },
                        {
                            type: "bytes",
                            name: "deInitData"
                        }
                    ],
                    outputs: []
                }
            ],
            functionName: "uninstallFallback",
            args: [(0, supportsModule_1.parseModuleTypeId)(type), (0, viem_1.getAddress)(address), initData ?? "0x"]
        })
    }
];
exports.toUninstallFallbackCalls = toUninstallFallbackCalls;
//# sourceMappingURL=uninstallFallback.js.map