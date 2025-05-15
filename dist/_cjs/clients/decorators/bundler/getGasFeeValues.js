"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGasFeeValues = void 0;
const account_1 = require("../../../account/index.js");
const getGasFeeValues = async (client) => {
    const nexusClient = client;
    const publicClient = nexusClient.client;
    const feeData = await publicClient.estimateFeesPerGas();
    const maxFeePerGas = (0, account_1.safeMultiplier)(feeData.maxFeePerGas, 1.6);
    console.log("maxFeePerGas", maxFeePerGas);
    const feeDataFromSCS = await client.request({
        method: "rundler_maxPriorityFeePerGas",
        params: []
    });
    console.log("feeDataFromSCS", feeDataFromSCS);
    const maxPriorityFeePerGasFromSCS = (0, account_1.safeMultiplier)(BigInt(feeDataFromSCS), 1);
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