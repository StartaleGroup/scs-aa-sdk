"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSupportedTokens = void 0;
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
    const quote = await paymaster.getTokenPaymasterQuotes({
        userOp,
        tokenList: []
    });
    return quote.feeQuotes;
};
exports.getSupportedTokens = getSupportedTokens;
//# sourceMappingURL=getSupportedTokens.js.map