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
    const usePimlico = !!nexusClient?.mock ||
        !!nexusClient?.transport?.url?.toLowerCase().includes("pimlico");
    const gasPrice = await client.request({
        method: usePimlico
            ? "pimlico_getUserOperationGasPrice"
            : "biconomy_getGasFeeValues",
        params: []
    });
    return {
        slow: {
            maxFeePerGas: BigInt(gasPrice.slow.maxFeePerGas),
            maxPriorityFeePerGas: BigInt(gasPrice.slow.maxPriorityFeePerGas)
        },
        standard: {
            maxFeePerGas: BigInt(gasPrice.standard.maxFeePerGas),
            maxPriorityFeePerGas: BigInt(gasPrice.standard.maxPriorityFeePerGas)
        },
        fast: {
            maxFeePerGas: BigInt(gasPrice.fast.maxFeePerGas),
            maxPriorityFeePerGas: BigInt(gasPrice.fast.maxPriorityFeePerGas)
        }
    };
};
//# sourceMappingURL=getGasFeeValues.js.map