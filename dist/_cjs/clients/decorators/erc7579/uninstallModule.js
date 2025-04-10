"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toUninstallModuleCalls = void 0;
exports.uninstallModule = uninstallModule;
const viem_1 = require("viem");
const account_abstraction_1 = require("viem/account-abstraction");
const utils_1 = require("viem/utils");
const utils_2 = require("viem/utils");
const _1 = require("./index.js");
const AccountNotFound_1 = require("../../../account/utils/AccountNotFound.js");
const supportsModule_1 = require("./supportsModule.js");
async function uninstallModule(client, parameters) {
    const { account: account_ = client.account, maxFeePerGas, maxPriorityFeePerGas, nonce, module: { address, initData, type } } = parameters;
    if (!account_) {
        throw new AccountNotFound_1.AccountNotFoundError({
            docsPath: "/nexus-client/methods#sendtransaction"
        });
    }
    const account = (0, utils_2.parseAccount)(account_);
    const [installedValidators] = await (0, _1.getInstalledValidators)(client);
    const prevModule = await (0, _1.getPreviousModule)(client, {
        module: {
            address,
            type
        },
        installedValidators,
        account
    });
    const deInitData = (0, viem_1.encodeAbiParameters)([
        { name: "prev", type: "address" },
        { name: "disableModuleData", type: "bytes" }
    ], [prevModule, initData ?? "0x"]);
    const calls = await (0, exports.toUninstallModuleCalls)(account, {
        address,
        deInitData,
        type
    });
    return (0, utils_1.getAction)(client, account_abstraction_1.sendUserOperation, "sendUserOperation")({
        calls,
        maxFeePerGas,
        maxPriorityFeePerGas,
        nonce,
        account
    });
}
const toUninstallModuleCalls = async (account, { address, deInitData = "0x", type }) => [
    {
        to: account.address,
        value: BigInt(0),
        data: (0, viem_1.encodeFunctionData)({
            abi: [
                {
                    name: "uninstallModule",
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
            functionName: "uninstallModule",
            args: [(0, supportsModule_1.parseModuleTypeId)(type), (0, viem_1.getAddress)(address), deInitData]
        })
    }
];
exports.toUninstallModuleCalls = toUninstallModuleCalls;
//# sourceMappingURL=uninstallModule.js.map