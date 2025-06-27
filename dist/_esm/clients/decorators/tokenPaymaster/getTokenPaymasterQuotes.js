import { toHex } from "viem";
import { ENTRY_POINT_ADDRESS } from "../../../constants/index.js";
/**
 * Normalizes the authorization object to ensure yParity, chainId, and nonce are properly converted to hex.
 * This is important for EIP-7702 authorization compatibility.
 */
const normalizeAuthorization = (authorization) => {
    if (!authorization || typeof authorization !== 'object') {
        return authorization;
    }
    // Create a copy to avoid mutating the original
    const normalizedAuth = { ...authorization };
    // Normalize yParity
    if ('yParity' in normalizedAuth && normalizedAuth.yParity !== undefined) {
        const yParity = normalizedAuth.yParity;
        // Convert to number if it's a string or hex
        let yParityNumber;
        if (typeof yParity === 'string') {
            // If it's a hex string, convert to number
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
        // Ensure yParity is even (0) or odd (1) and convert to hex
        // If the number is odd, keep it as 1, if even, make it 0
        const normalizedYParity = yParityNumber % 2 === 1 ? 1 : 0;
        normalizedAuth.yParity = toHex(normalizedYParity);
    }
    // Normalize chainId
    if ('chainId' in normalizedAuth && normalizedAuth.chainId !== undefined) {
        const chainId = normalizedAuth.chainId;
        // Convert to number if it's a string or hex
        let chainIdNumber;
        if (typeof chainId === 'string') {
            // If it's a hex string, convert to number
            if (chainId.startsWith('0x')) {
                chainIdNumber = parseInt(chainId, 16);
            }
            else {
                chainIdNumber = parseInt(chainId, 10);
            }
        }
        else {
            chainIdNumber = chainId;
        }
        normalizedAuth.chainId = toHex(chainIdNumber);
    }
    // Normalize nonce
    if ('nonce' in normalizedAuth && normalizedAuth.nonce !== undefined) {
        const nonce = normalizedAuth.nonce;
        // Convert to number if it's a string or hex
        let nonceNumber;
        if (typeof nonce === 'string') {
            // If it's a hex string, convert to number
            if (nonce.startsWith('0x')) {
                nonceNumber = parseInt(nonce, 16);
            }
            else {
                nonceNumber = parseInt(nonce, 10);
            }
        }
        else {
            nonceNumber = nonce;
        }
        normalizedAuth.nonce = toHex(nonceNumber);
    }
    return normalizedAuth;
};
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
    // Normalize the authorization chainId, nonce, and yParity if it exists
    const normalizedAuthorization = userOp.authorization
        ? normalizeAuthorization(userOp.authorization)
        : undefined;
    // Review: types transformation and requirements in pm service endpoint
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
                paymasterVerificationGasLimit: toHex(Number(userOp.paymasterVerificationGasLimit ?? 0x0)),
                eip7702Auth: normalizedAuthorization
            },
            ENTRY_POINT_ADDRESS,
            chainId,
            {
                calculateGasLimits: true
            }
        ]
    });
    return quote;
};
//# sourceMappingURL=getTokenPaymasterQuotes.js.map