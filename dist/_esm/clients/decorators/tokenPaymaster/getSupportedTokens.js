/**
 * Retrieves the supported tokens for the Startale Token Paymaster..
 *
 * @param client - The Startale client instance
 * @returns A promise that resolves to an array of FeeQuote objects.
 *
 * @example
 * ```typescript
 * const supportedTokens = await paymaster.getSupportedTokens(startaleClient);
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