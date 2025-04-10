import { http } from "viem";
import { createPaymasterClient } from "viem/account-abstraction";
import { bicoTokenPaymasterActions } from "./decorators/tokenPaymaster/index.js";
export const biconomySponsoredPaymasterContext = {
    mode: "SPONSORED",
    expiryDuration: 300,
    calculateGasLimits: true,
    sponsorshipInfo: {
        smartAccountInfo: {
            name: "BICONOMY",
            version: "2.0.0"
        }
    }
};
export const toBiconomySponsoredPaymasterContext = (params) => {
    return {
        ...biconomySponsoredPaymasterContext,
        ...params
    };
};
export const toBiconomyTokenPaymasterContext = (params) => {
    const { feeTokenAddress, expiryDuration, calculateGasLimits } = params;
    return {
        mode: "ERC20",
        sponsorshipInfo: {
            smartAccountInfo: {
                name: "BICONOMY",
                version: "2.0.0"
            }
        },
        tokenInfo: {
            feeTokenAddress
        },
        expiryDuration: expiryDuration ?? 6000,
        calculateGasLimits: calculateGasLimits ?? true
    };
};
/**
 * Creates a Bico Paymaster Client.
 *
 * This function sets up a client for interacting with Biconomy's paymaster service.
 * It can be configured with a custom transport, a specific paymaster URL, or with a chain ID and API key.
 *
 * @param {BicoPaymasterClientConfig} parameters - Configuration options for the client.
 * @returns {PaymasterClient} A configured Paymaster Client instance.
 *
 * @example
 * // Create a client with a custom transport
 * const client1 = createBicoPaymasterClient({ transport: customTransport })
 *
 * @example
 * // Create a client with a specific paymaster URL
 * const client2 = createBicoPaymasterClient({ paymasterUrl: 'https://example.com/paymaster' })
 *
 * @example
 * // Create a client with chain ID and API key
 * const client3 = createBicoPaymasterClient({ chainId: 1, apiKey: 'your-api-key' })
 *
 * @example
 * // Create a Token Paymaster Client
 * const tokenPaymasterClient = createBicoPaymasterClient({
 *      paymasterUrl: 'https://example.com/paymaster',
 *      paymasterContext: {
 *        mode: "ERC20",
 *        tokenInfo: {
 *          feeTokenAddress: "0x..."
 *        }
 *      },
 * })
 */
export const createBicoPaymasterClient = (parameters) => {
    const defaultedTransport = parameters.transport
        ? parameters.transport
        : parameters.paymasterUrl
            ? http(parameters.paymasterUrl)
            : http(`https://paymaster.biconomy.io/api/v2/${parameters.chainId}/${parameters.apiKey}`);
    // Remove getPaymasterStubData from the client.
    const { getPaymasterStubData, ...paymasterClient } = createPaymasterClient({
        ...parameters,
        transport: defaultedTransport
    }).extend(bicoTokenPaymasterActions());
    return paymasterClient;
};
//# sourceMappingURL=createBicoPaymasterClient.js.map