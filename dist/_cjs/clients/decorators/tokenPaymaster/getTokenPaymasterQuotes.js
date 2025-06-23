"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenPaymasterQuotes = void 0;
const viem_1 = require("viem");
const constants_1 = require("../../../constants/index.js");
const getTokenPaymasterQuotes = async (client, parameters) => {
    const { userOp, chainId } = parameters;
    const quote = await client.request({
        method: "pm_getFeeQuotes",
        params: [
            {
                sender: userOp.sender,
                nonce: (0, viem_1.toHex)(userOp.nonce),
                factory: userOp.factory,
                factoryData: userOp.factoryData,
                callData: userOp.callData,
                maxFeePerGas: userOp.maxFeePerGas.toString(),
                maxPriorityFeePerGas: userOp.maxPriorityFeePerGas.toString(),
                verificationGasLimit: (0, viem_1.toHex)(Number(userOp.verificationGasLimit)),
                callGasLimit: (0, viem_1.toHex)(Number(userOp.callGasLimit)),
                preVerificationGas: (0, viem_1.toHex)(Number(userOp.preVerificationGas)),
                paymasterPostOpGasLimit: (0, viem_1.toHex)(Number(userOp.paymasterPostOpGasLimit ?? 0x0)),
                paymasterVerificationGasLimit: (0, viem_1.toHex)(Number(userOp.paymasterVerificationGasLimit ?? 0x0))
            },
            constants_1.ENTRY_POINT_ADDRESS,
            chainId,
            {
                calculateGasLimits: true
            }
        ]
    });
    return quote;
};
exports.getTokenPaymasterQuotes = getTokenPaymasterQuotes;
//# sourceMappingURL=getTokenPaymasterQuotes.js.map