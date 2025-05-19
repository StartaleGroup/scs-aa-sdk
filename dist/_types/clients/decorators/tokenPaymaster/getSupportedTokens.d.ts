import type { StartaleAccountClient } from "../../createSCSBundlerClient";
import type { FeeQuote } from "./getTokenPaymasterQuotes";
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
export declare const getSupportedTokens: (client: StartaleAccountClient) => Promise<FeeQuote[]>;
//# sourceMappingURL=getSupportedTokens.d.ts.map