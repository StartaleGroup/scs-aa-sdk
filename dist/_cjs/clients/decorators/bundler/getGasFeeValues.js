"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGasFeeValues = void 0;
const account_1 = require("../../../account/index.js");
const getGasFeeValues = async (client) => {
    const accountClient = client;
    const publicClient = accountClient.client;
    if (publicClient === null || publicClient === undefined) {
        throw new Error("client must be passed during initialing smart account client");
    }
    const feeData = await publicClient.estimateFeesPerGas();
    const maxFeePerGas = (0, account_1.safeMultiplier)(feeData.maxFeePerGas, 1.6);
    const feeDataFromSCS = await client.request({
        method: "rundler_maxPriorityFeePerGas",
        params: []
    });
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