"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenPaymasterQuotes = void 0;
const getTokenPaymasterQuotes = async (client, parameters) => {
    const { userOp, tokenList } = parameters;
    const quote = await client.request({
        method: "pm_getFeeQuoteOrData",
        params: [
            {
                sender: userOp.sender,
                nonce: userOp.nonce.toString(),
                factory: userOp.factory,
                factoryData: userOp.factoryData,
                callData: userOp.callData,
                maxFeePerGas: userOp.maxFeePerGas.toString(),
                maxPriorityFeePerGas: userOp.maxPriorityFeePerGas.toString(),
                verificationGasLimit: BigInt(userOp.verificationGasLimit).toString(),
                callGasLimit: BigInt(userOp.callGasLimit).toString(),
                preVerificationGas: BigInt(userOp.preVerificationGas).toString(),
                paymasterPostOpGasLimit: userOp.paymasterPostOpGasLimit?.toString() ?? "0",
                paymasterVerificationGasLimit: userOp.paymasterVerificationGasLimit?.toString() ?? "0"
            },
            {
                mode: "ERC20",
                sponsorshipInfo: {
                    smartAccountInfo: {
                        name: "BICONOMY",
                        version: "2.0.0"
                    }
                },
                tokenInfo: {
                    tokenList
                },
                expiryDuration: 6000,
                calculateGasLimits: true
            }
        ]
    });
    return quote;
};
exports.getTokenPaymasterQuotes = getTokenPaymasterQuotes;
//# sourceMappingURL=getTokenPaymasterQuotes.js.map