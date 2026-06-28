import { type Account, type Chain, type Client, type Hex, type Transport } from "viem";
import type { MiscRpcSchema } from ".";
export type UserOperationGasPriceWithBigIntAsHex = {
    slow: {
        maxFeePerGas: Hex;
        maxPriorityFeePerGas: Hex;
    };
    standard: {
        maxFeePerGas: Hex;
        maxPriorityFeePerGas: Hex;
    };
    fast: {
        maxFeePerGas: Hex;
        maxPriorityFeePerGas: Hex;
    };
};
export type GetGasFeeValuesReturnType = {
    slow: {
        maxFeePerGas: bigint;
        maxPriorityFeePerGas: bigint;
    };
    standard: {
        maxFeePerGas: bigint;
        maxPriorityFeePerGas: bigint;
    };
    fast: {
        maxFeePerGas: bigint;
        maxPriorityFeePerGas: bigint;
    };
};
/**
 * Returns the live gas prices that you can use to send a user operation.
 *
 * Provider-aware: uses bundler-native fee methods for known providers so the
 * returned values are guaranteed acceptable to that bundler. Falls back to
 * standard eth_ methods via the attached public client for all other providers.
 *
 * - Pimlico  → pimlico_getUserOperationGasPrice (returns full slow/standard/fast object)
 * - Alchemy  → rundler_maxPriorityFeePerGas + baseFee from RPC
 * - Others   → eth_maxPriorityFeePerGas + eth_getBlockByNumber via public client
 *
 * @param client - StartaleAccountClient whose transport points at the bundler
 * @returns slow, standard & fast values for maxFeePerGas & maxPriorityFeePerGas
 */
export declare const getGasFeeValues: (client: Client<Transport, Chain | undefined, Account | undefined, MiscRpcSchema>) => Promise<GetGasFeeValuesReturnType>;
//# sourceMappingURL=getGasFeeValues.d.ts.map