import { http, createPublicClient } from "viem";
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
export const getGasFeeValues = async (client, multipliers) => {
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
    const priorityFeeDataFromSCS = await client.request({
        method: "rundler_maxPriorityFeePerGas",
        params: []
    });
    const baseFeePerGas = await rpcClient
        .request({
        method: "eth_getBlockByNumber",
        params: ["latest", false]
    })
        .then((block) => {
        if (!block || !block.baseFeePerGas) {
            throw new Error("Base fee not available");
        }
        return BigInt(block.baseFeePerGas);
    });
    const maxFeeMultiplier = multipliers?.maxFeePerGas ?? 1.5;
    const priorityFeeMultiplier = multipliers?.maxPriorityFeePerGas ?? 1.1;
    //maxFee = (baseFee + priorityFee) * multiplier — the buffer guards against base-fee
    //ticks between estimation and submission that would cause the bundler to reject.
    const maxFeePerGas = safeMultiplier(baseFeePerGas + BigInt(priorityFeeDataFromSCS), maxFeeMultiplier);
    const maxPriorityFeePerGasFromSCS = safeMultiplier(BigInt(priorityFeeDataFromSCS), priorityFeeMultiplier);
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