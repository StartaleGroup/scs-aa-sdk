"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toSupportsModuleReads = void 0;
exports.parseModuleTypeId = parseModuleTypeId;
exports.supportsModule = supportsModule;
const viem_1 = require("viem");
const actions_1 = require("viem/actions");
const utils_1 = require("viem/utils");
const utils_2 = require("viem/utils");
const AccountNotFound_1 = require("../../../account/utils/AccountNotFound.js");
const abi = [
    {
        name: "supportsModule",
        type: "function",
        stateMutability: "view",
        inputs: [
            {
                type: "uint256",
                name: "moduleTypeId"
            }
        ],
        outputs: [
            {
                type: "bool"
            }
        ]
    }
];
function parseModuleTypeId(type) {
    switch (type) {
        case "validator":
            return BigInt(1);
        case "executor":
            return BigInt(2);
        case "fallback":
            return BigInt(3);
        case "hook":
            return BigInt(4);
        default:
            throw new Error(`Invalid module type: ${type}`);
    }
}
async function supportsModule(client, args) {
    const { account: account_ = client.account } = args;
    if (!account_) {
        throw new AccountNotFound_1.AccountNotFoundError({
            docsPath: "/nexus-client/methods#sendtransaction"
        });
    }
    const account = (0, utils_2.parseAccount)(account_);
    const publicClient = account.client;
    const [supportsModuleRead] = await (0, exports.toSupportsModuleReads)(account, args);
    try {
        return await (0, utils_1.getAction)(publicClient, actions_1.readContract, "readContract")(supportsModuleRead);
    }
    catch (error) {
        if (error instanceof viem_1.ContractFunctionExecutionError) {
            const { factory, factoryData } = await account.getFactoryArgs();
            const result = await (0, utils_1.getAction)(publicClient, actions_1.call, "call")({
                factory: factory,
                factoryData: factoryData,
                to: account.address,
                data: (0, viem_1.encodeFunctionData)({
                    abi,
                    functionName: "supportsModule",
                    args: [parseModuleTypeId(args.type)]
                })
            });
            if (!result || !result.data) {
                throw new Error("accountId result is empty");
            }
            return (0, viem_1.decodeFunctionResult)({
                abi,
                functionName: "supportsModule",
                data: result.data
            });
        }
        throw error;
    }
}
const toSupportsModuleReads = async (account, { type }) => [
    {
        abi,
        functionName: "supportsModule",
        args: [parseModuleTypeId(type)],
        address: account.address
    }
];
exports.toSupportsModuleReads = toSupportsModuleReads;
//# sourceMappingURL=supportsModule.js.map