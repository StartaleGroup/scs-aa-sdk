import { toHex } from "viem";
import { ENTRY_POINT_ADDRESS } from "../../../constants/index.js";
/**
 * Fetches paymaster quotes for ERC20 token payment options for a given UserOperation.
 *
 * @param userOp - The UserOperation to get paymaster quotes for
 * @param client - Viem Client configured with TokenPaymaster RPC methods
 * @param tokenList - Array of ERC20 token addresses to get quotes for
 *
 * @returns A promise of {@link TokenPaymasterQuotesResponse}
 *
 * @example
 * ```typescript
 * // Configure client with paymaster RPC
 * const paymasterClient = createSCSPaymasterClient({
 *     paymasterUrl
 * })
 *
 *
 * // Get paymaster quotes
 * const quotes = await paymasterClient.getTokenPaymasterQuotes(userOp);
 *
 * // Example response:
 * // {
 * //   paymasterAddress: "0x...",
 * //   feeQuotes: [{
 * //     symbol: "USDT",
 * //     decimal: 6,
 * //     tokenAddress: "0x...",
 * //     maxGasFee: "5000000",
 * //     maxGasFeeUSD: "5",
 * //     exchangeRate: "0x94ede635",
 * //     requiredAmount: "0x57",
 * //     logoUrl: "https://...",
 * //     premiumPercentage: 5,
 * //   }],
 * //   unsupportedTokens: []
 * // }
 * ```
 */
export const getTokenPaymasterQuotes = async (client, parameters) => {
    const { userOp, chainId } = parameters;
    // Review: types rtransformation and requirements in pm service endpoint
    const quote = await client.request({
        method: "pm_getFeeQuotes",
        params: [
            {
                sender: userOp.sender,
                nonce: toHex(userOp.nonce),
                factory: userOp.factory,
                factoryData: userOp.factoryData,
                callData: userOp.callData,
                maxFeePerGas: userOp.maxFeePerGas.toString(),
                maxPriorityFeePerGas: userOp.maxPriorityFeePerGas.toString(),
                verificationGasLimit: toHex(Number(userOp.verificationGasLimit)),
                callGasLimit: toHex(Number(userOp.callGasLimit)),
                preVerificationGas: toHex(Number(userOp.preVerificationGas)),
                paymasterPostOpGasLimit: toHex(Number(userOp.paymasterPostOpGasLimit ?? 0x0)),
                paymasterVerificationGasLimit: toHex(Number(userOp.paymasterVerificationGasLimit ?? 0x0))
            },
            ENTRY_POINT_ADDRESS,
            chainId,
            {
                calculateGasLimits: true
            },
        ]
    });
    return quote;
};
//# sourceMappingURL=getTokenPaymasterQuotes.js.map