import { type Address, type OneOf, type Transport } from "viem";
import { type PaymasterClient, type PaymasterClientConfig } from "viem/account-abstraction";
import { type TokenPaymasterActions } from "./decorators/tokenPaymaster";
export type BicoPaymasterClient = Omit<PaymasterClient, "getPaymasterStubData"> & TokenPaymasterActions;
/**
 * Configuration options for creating a Bico Paymaster Client.
 * @typedef {Object} BicoPaymasterClientConfig
 * @property {Transport} [transport] - Optional custom transport.
 * @property {string} [paymasterUrl] - URL of the paymaster service.
 * @property {number} [chainId] - Chain ID for the network.
 * @property {string} [apiKey] - API key for authentication.
 */
type BicoPaymasterClientConfig = Omit<PaymasterClientConfig, "transport"> & OneOf<{
    transport?: Transport;
} | {
    paymasterUrl: string;
} | {
    chainId: number;
    apiKey: string;
}>;
/**
 * Context for the Bico SPONSORED Paymaster.
 */
export type BiconomyPaymasterContext = {
    mode: "ERC20" | "SPONSORED";
    sponsorshipInfo?: {
        smartAccountInfo: {
            name: string;
            version: string;
        };
    };
    tokenInfo?: {
        feeTokenAddress: Address;
    };
    expiryDuration?: number;
    calculateGasLimits?: boolean;
};
type ToBiconomyTokenPaymasterContextParams = {
    feeTokenAddress: Address;
    expiryDuration?: number;
    calculateGasLimits?: boolean;
};
export declare const biconomySponsoredPaymasterContext: BiconomyPaymasterContext;
export declare const toBiconomySponsoredPaymasterContext: (params?: Partial<BiconomyPaymasterContext>) => BiconomyPaymasterContext;
export declare const toBiconomyTokenPaymasterContext: (params: ToBiconomyTokenPaymasterContextParams) => BiconomyPaymasterContext;
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
export declare const createBicoPaymasterClient: (parameters: BicoPaymasterClientConfig) => BicoPaymasterClient;
export {};
//# sourceMappingURL=createBicoPaymasterClient.d.ts.map