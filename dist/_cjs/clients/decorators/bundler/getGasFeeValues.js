"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGasFeeValues = void 0;
const getGasFeeValues = async (client) => {
    const nexusClient = client;
    const usePimlico = !!nexusClient?.mock ||
        !!nexusClient?.transport?.url?.toLowerCase().includes("pimlico");
    const gasPrice = await client.request({
        method: usePimlico
            ? "pimlico_getUserOperationGasPrice"
            : "biconomy_getGasFeeValues",
        params: []
    });
    return {
        slow: {
            maxFeePerGas: BigInt(gasPrice.slow.maxFeePerGas),
            maxPriorityFeePerGas: BigInt(gasPrice.slow.maxPriorityFeePerGas)
        },
        standard: {
            maxFeePerGas: BigInt(gasPrice.standard.maxFeePerGas),
            maxPriorityFeePerGas: BigInt(gasPrice.standard.maxPriorityFeePerGas)
        },
        fast: {
            maxFeePerGas: BigInt(gasPrice.fast.maxFeePerGas),
            maxPriorityFeePerGas: BigInt(gasPrice.fast.maxPriorityFeePerGas)
        }
    };
};
exports.getGasFeeValues = getGasFeeValues;
//# sourceMappingURL=getGasFeeValues.js.map