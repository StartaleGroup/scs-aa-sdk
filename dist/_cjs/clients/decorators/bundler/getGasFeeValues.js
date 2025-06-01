"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGasFeeValues = void 0;
const viem_1 = require("viem");
const account_1 = require("../../../account/index.js");
const getGasFeeValues = async (client) => {
    const accountClient = client;
    const rpcUrl = accountClient.chain?.rpcUrls.default.http[0];
    if (!rpcUrl) {
        throw new Error("getGasFeeValues: rpcUrl is not available");
    }
    const rpcClient = (0, viem_1.createPublicClient)({
        chain: accountClient.chain,
        transport: (0, viem_1.http)(rpcUrl)
    });
    const priorityFeeDataFromSCS = await client.request({
        method: "rundler_maxPriorityFeePerGas",
        params: []
    });
    const baseFeePerGas = await rpcClient.request({
        method: "eth_getBlockByNumber",
        params: ["latest", false]
    }).then((block) => {
        if (!block || !block.baseFeePerGas) {
            throw new Error("Base fee not available");
        }
        return BigInt(block.baseFeePerGas);
    });
    const maxFeePerGas = (0, account_1.safeMultiplier)(baseFeePerGas + BigInt(priorityFeeDataFromSCS), 1.1);
    const maxPriorityFeePerGasFromSCS = (0, account_1.safeMultiplier)(BigInt(priorityFeeDataFromSCS), 1);
    return {
        slow: {
            maxFeePerGas: BigInt(maxFeePerGas),
            maxPriorityFeePerGas: BigInt(maxPriorityFeePerGasFromSCS)
        },
        standard: {
            maxFeePerGas: BigInt(maxFeePerGas),
            maxPriorityFeePerGas: BigInt(maxPriorityFeePerGasFromSCS)
        },
        fast: {
            maxFeePerGas: BigInt(maxFeePerGas),
            maxPriorityFeePerGas: BigInt(maxPriorityFeePerGasFromSCS)
        }
    };
};
exports.getGasFeeValues = getGasFeeValues;
//# sourceMappingURL=getGasFeeValues.js.map