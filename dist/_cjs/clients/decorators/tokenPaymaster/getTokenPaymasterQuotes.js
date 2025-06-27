"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenPaymasterQuotes = void 0;
const viem_1 = require("viem");
const constants_1 = require("../../../constants/index.js");
const normalizeAuthorization = (authorization) => {
    if (!authorization || typeof authorization !== 'object') {
        return authorization;
    }
    const normalizedAuth = { ...authorization };
    if ('yParity' in normalizedAuth && normalizedAuth.yParity !== undefined) {
        const yParity = normalizedAuth.yParity;
        let yParityNumber;
        if (typeof yParity === 'string') {
            if (yParity.startsWith('0x')) {
                yParityNumber = parseInt(yParity, 16);
            }
            else {
                yParityNumber = parseInt(yParity, 10);
            }
        }
        else {
            yParityNumber = yParity;
        }
        const normalizedYParity = yParityNumber % 2 === 1 ? 1 : 0;
        normalizedAuth.yParity = (0, viem_1.toHex)(normalizedYParity, { size: 1 });
    }
    if ('chainId' in normalizedAuth && normalizedAuth.chainId !== undefined) {
        const chainId = normalizedAuth.chainId;
        normalizedAuth.chainId = (0, viem_1.toHex)(chainId);
    }
    if ('nonce' in normalizedAuth && normalizedAuth.nonce !== undefined) {
        const nonce = normalizedAuth.nonce;
        normalizedAuth.nonce = (0, viem_1.toHex)(nonce);
    }
    return normalizedAuth;
};
const getTokenPaymasterQuotes = async (client, parameters) => {
    const { userOp, chainId } = parameters;
    const normalizedAuthorization = userOp.authorization
        ? normalizeAuthorization(userOp.authorization)
        : undefined;
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
                paymasterVerificationGasLimit: (0, viem_1.toHex)(Number(userOp.paymasterVerificationGasLimit ?? 0x0)),
                eip7702Auth: normalizedAuthorization
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