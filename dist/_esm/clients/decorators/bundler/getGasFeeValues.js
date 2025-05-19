import { safeMultiplier } from "../../../account/index.js";
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
export const getGasFeeValues = async (client) => {
    const accountClient = client;
    const publicClient = accountClient.client;
    if (publicClient === null || publicClient === undefined) {
        throw new Error("client must be passed during initialing smart account client");
    }
    const feeData = await publicClient.estimateFeesPerGas();
    const maxFeePerGas = safeMultiplier(feeData.maxFeePerGas, 1.6);
    // const maxPriorityFeePerGas = safeMultiplier(
    //     feeData.maxPriorityFeePerGas,
    //     1.6
    // );
    const feeDataFromSCS = await client.request({
        method: "rundler_maxPriorityFeePerGas",
        params: []
    });
    const maxPriorityFeePerGasFromSCS = safeMultiplier(BigInt(feeDataFromSCS), 1);
    return {
        slow: {
            maxFeePerGas: BigInt(maxFeePerGas),
            maxPriorityFeePerGas: BigInt(maxPriorityFeePerGasFromSCS)
        },
        standard: {
            maxFeePerGas: BigInt(maxFeePerGas),
            maxPriorityFeePerGas: BigInt(maxPriorityFeePerGasFromSCS)
        },
        fast: {
            maxFeePerGas: BigInt(maxFeePerGas),
            maxPriorityFeePerGas: BigInt(maxPriorityFeePerGasFromSCS)
        }
    };
};
//# sourceMappingURL=getGasFeeValues.js.map