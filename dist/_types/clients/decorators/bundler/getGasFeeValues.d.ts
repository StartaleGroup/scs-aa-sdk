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
 * @param client that you created using viem's createClient whose transport url is pointing to the bundler.
 * @returns slow, standard & fast values for maxFeePerGas & maxPriorityFeePerGas
 *
 *
 * @example
 * import { createClient } from "viem"
 * import { getGasFeeValues } from "permissionless/actions/pimlico"
 *
 * const bundlerClient = createClient({
 *      chain: goerli,
 *      transport: http(<bundler-url>),
 * })
 *
 * await getGasFeeValues(bundlerClient)
 *
 */
export declare const getGasFeeValues: (client: Client<Transport, Chain | undefined, Account | undefined, MiscRpcSchema>) => Promise<GetGasFeeValuesReturnType>;
//# sourceMappingURL=getGasFeeValues.d.ts.map