import type { NexusClient } from "../../createBicoBundlerClient";
import type { FeeQuote } from "./getTokenPaymasterQuotes";
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
export declare const getSupportedTokens: (client: NexusClient) => Promise<FeeQuote[]>;
//# sourceMappingURL=getSupportedTokens.d.ts.map