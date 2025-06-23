"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSupportedTokens = void 0;
const viem_1 = require("viem");
const getSupportedTokens = async (client) => {
    const userOp = await client.prepareUserOperation({
        calls: [
            {
                to: client.account.address,
                data: "0x",
                value: 0n
            }
        ]
    });
    const paymaster = client.paymaster;
    if (!client?.chain?.id)
        throw new Error("Chain ID is required");
    const quote = await paymaster.getTokenPaymasterQuotes({
        userOp,
        chainId: (0, viem_1.toHex)(client.chain.id)
    });
    return quote.feeQuotes;
};
exports.getSupportedTokens = getSupportedTokens;
//# sourceMappingURL=getSupportedTokens.js.map