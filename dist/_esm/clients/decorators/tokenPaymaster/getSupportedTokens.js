/**
 * Retrieves the supported tokens for the Biconomy Token Paymaster..
 *
 * @param client - The Nexus client instance
 * @returns A promise that resolves to an array of FeeQuote objects.
 *
 * @example
 * ```typescript
 * const supportedTokens = await paymaster.getSupportedTokens(nexusClient);
 * console.log(supportedTokens);
 * ```
 */
export const getSupportedTokens = async (client) => {
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
//# sourceMappingURL=getSupportedTokens.js.map