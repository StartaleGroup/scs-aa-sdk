import { safeMultiplier } from "../../../account/index.js";
/**
 * Returns the live gas prices that you can use to send a user operation.
 *
 * @param client that you created using viem's createClient whose transport url is pointing to the Biconomy's bundler.
 * @returns slow, standard & fast values for maxFeePerGas & maxPriorityFeePerGas
 *
 *
 * @example
 * import { createClient } from "viem"
 * import { getGasFeeValues } from "permissionless/actions/pimlico"
 *
 * const bundlerClient = createClient({
 *      chain: goerli,
 *      transport: http("https://biconomy.io/api/v3/5/your-api-key"),
 * })
 *
 * await getGasFeeValues(bundlerClient)
 *
 */
export const getGasFeeValues = async (client) => {
    const nexusClient = client;
    const publicClient = nexusClient.client;
    // const usePimlico =
    //   !!nexusClient?.mock ||
    //   !!nexusClient?.transport?.url?.toLowerCase().includes("pimlico")
    // Todo: Update as per the flag and change default to rundler
    // Rundler only has https://github.com/alchemyplatform/rundler/blob/main/docs/architecture/rpc.md#rundler_maxpriorityfeepergas
    // const gasPrice = await client.request({
    //   method: usePimlico
    //     ? "pimlico_getUserOperationGasPrice"
    //     : "biconomy_getGasFeeValues",
    //   params: []
    // })
    const feeData = await publicClient.estimateFeesPerGas();
    const maxFeePerGas = safeMultiplier(feeData.maxFeePerGas, 1.6);
    console.log("maxFeePerGas", maxFeePerGas);
    // const maxPriorityFeePerGas = safeMultiplier(
    //     feeData.maxPriorityFeePerGas,
    //     1.6
    // );
    const feeDataFromSCS = await client.request({
        method: "rundler_maxPriorityFeePerGas",
        params: []
    });
    console.log("feeDataFromSCS", feeDataFromSCS);
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