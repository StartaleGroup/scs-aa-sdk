"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toInstallWithSafeSenderCalls = exports.toInstallModuleCalls = exports.toSafeSenderCalls = void 0;
exports.installModule = installModule;
const viem_1 = require("viem");
const account_abstraction_1 = require("viem/account-abstraction");
const utils_1 = require("viem/utils");
const AccountNotFound_1 = require("../../../account/utils/AccountNotFound.js");
const Utils_1 = require("../../../account/utils/Utils.js");
const constants_1 = require("../../../constants/index.js");
const supportsModule_1 = require("./supportsModule.js");
async function installModule(client, parameters) {
    const { account: account_ = client.account, maxFeePerGas, maxPriorityFeePerGas, nonce, module, module: { address, initData, type }, ...rest } = parameters;
    if (!account_) {
        throw new AccountNotFound_1.AccountNotFoundError({
            docsPath: "/nexus-client/methods#sendtransaction"
        });
    }
    const account = (0, utils_1.parseAccount)(account_);
    const calls = await (0, exports.toInstallWithSafeSenderCalls)(account, {
        address,
        initData,
        type
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
const toSafeSenderCalls = async (__, { address }) => (0, Utils_1.addressEquals)(address, constants_1.SMART_SESSIONS_ADDRESS)
    ? [
        {
            to: constants_1.MEE_VALIDATOR_ADDRESS,
            value: BigInt(0),
            data: (0, viem_1.encodeFunctionData)({
                abi: [
                    {
                        name: "addSafeSender",
                        type: "function",
                        stateMutability: "nonpayable",
                        inputs: [{ type: "address", name: "sender" }],
                        outputs: []
                    }
                ],
                functionName: "addSafeSender",
                args: [address]
            })
        }
    ]
    : [];
exports.toSafeSenderCalls = toSafeSenderCalls;
const toInstallModuleCalls = async (account, { address, initData, type }) => [
    {
        to: account.address,
        value: BigInt(0),
        data: (0, viem_1.encodeFunctionData)({
            abi: [
                {
                    name: "installModule",
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
                            name: "initData"
                        }
                    ],
                    outputs: []
                }
            ],
            functionName: "installModule",
            args: [(0, supportsModule_1.parseModuleTypeId)(type), (0, viem_1.getAddress)(address), initData ?? "0x"]
        })
    }
];
exports.toInstallModuleCalls = toInstallModuleCalls;
const toInstallWithSafeSenderCalls = async (account, { address, initData, type }) => [
    ...(await (0, exports.toInstallModuleCalls)(account, { address, initData, type })),
    ...(await (0, exports.toSafeSenderCalls)(account, { address, type }))
];
exports.toInstallWithSafeSenderCalls = toInstallWithSafeSenderCalls;
//# sourceMappingURL=installModule.js.map