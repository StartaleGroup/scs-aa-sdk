"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.erc7579Reads = exports.toIsModuleInstalledReads = void 0;
exports.isModuleInstalled = isModuleInstalled;
const viem_1 = require("viem");
const actions_1 = require("viem/actions");
const utils_1 = require("viem/utils");
const AccountNotFound_1 = require("../../../account/utils/AccountNotFound.js");
const supportsModule_1 = require("./supportsModule.js");
const abi = [
    {
        name: "isModuleInstalled",
        type: "function",
        stateMutability: "view",
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
                name: "additionalContext"
            }
        ],
        outputs: [
            {
                type: "bool"
            }
        ]
    }
];
async function isModuleInstalled(client, parameters) {
    const { account: account_ = client.account, module: { address, initData, type } } = parameters;
    if (!account_) {
        throw new AccountNotFound_1.AccountNotFoundError({
            docsPath: "/nexus-client/methods#sendtransaction"
        });
    }
    const account = (0, utils_1.parseAccount)(account_);
    const publicClient = account.client;
    const [isModuleEnabledRead] = await (0, exports.toIsModuleInstalledReads)(account, {
        address,
        initData,
        type
    });
    try {
        return (await (0, utils_1.getAction)(publicClient, actions_1.readContract, "readContract")(isModuleEnabledRead));
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
                    functionName: "isModuleInstalled",
                    args: [(0, supportsModule_1.parseModuleTypeId)(type), (0, viem_1.getAddress)(address), initData ?? "0x"]
                })
            });
            if (!result || !result.data) {
                throw new Error("accountId result is empty");
            }
            return (0, viem_1.decodeFunctionResult)({
                abi,
                functionName: "isModuleInstalled",
                data: result.data
            });
        }
        throw error;
    }
}
const toIsModuleInstalledReads = async (account, { address, initData, type }) => [
    {
        abi,
        functionName: "isModuleInstalled",
        args: [(0, supportsModule_1.parseModuleTypeId)(type), (0, viem_1.getAddress)(address), initData ?? "0x"],
        address: account.address
    }
];
exports.toIsModuleInstalledReads = toIsModuleInstalledReads;
exports.erc7579Reads = {
    toIsModuleInstalledReads: exports.toIsModuleInstalledReads
};
//# sourceMappingURL=isModuleInstalled.js.map