import { createPublicClient, http } from "viem";
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
    // const publicClient = accountClient.client as PublicClient
    const rpcUrl = accountClient.chain?.rpcUrls.default.http[0];
    if (!rpcUrl) {
        throw new Error("getGasFeeValues: rpcUrl is not available");
    }
    const rpcClient = createPublicClient({
        chain: accountClient.chain,
        transport: http(rpcUrl)
    });
    // TODO: refactor and error handling can be added
    //  if(publicClient === null || publicClient === undefined) {
    //   throw new Error("client must be passed during initialing smart account client")
    //  }
    // const feeData = await publicClient.estimateFeesPerGas()
    // console.log("feeData", feeData)
    // const maxFeePerGas =  safeMultiplier(feeData.maxFeePerGas, 1.6);
    // const maxPriorityFeePerGas = safeMultiplier(
    //     feeData.maxPriorityFeePerGas,
    //     1.6
    // );
    const priorityFeeDataFromSCS = await client.request({
        method: "rundler_maxPriorityFeePerGas",
        params: []
    });
    const baseFeePerGas = await rpcClient.request({
        method: "eth_getBlockByNumber",
        params: ["latest", false]
    }).then((block) => {
        if (!block || !block.baseFeePerGas) {
            throw new Error("Base fee not available");
        }
        return BigInt(block.baseFeePerGas);
    });
    //maxFee = base fee + feeDataFromSCS
    const maxFeePerGas = safeMultiplier(baseFeePerGas + BigInt(priorityFeeDataFromSCS), 1.1);
    const maxPriorityFeePerGasFromSCS = safeMultiplier(BigInt(priorityFeeDataFromSCS), 1);
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