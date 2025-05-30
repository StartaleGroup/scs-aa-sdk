import { createPublicClient, http, type Account, type Chain, type Client, type Hex, type PublicClient, type Transport } from "viem"
import type { MiscRpcSchema } from "."
import type { StartaleAccountClient } from "../../createSCSBundlerClient"
import { safeMultiplier } from "../../../account"

export type UserOperationGasPriceWithBigIntAsHex = {
  slow: {
    maxFeePerGas: Hex
    maxPriorityFeePerGas: Hex
  }
  standard: {
    maxFeePerGas: Hex
    maxPriorityFeePerGas: Hex
  }
  fast: {
    maxFeePerGas: Hex
    maxPriorityFeePerGas: Hex
  }
}

export type GetGasFeeValuesReturnType = {
  slow: {
    maxFeePerGas: bigint
    maxPriorityFeePerGas: bigint
  }
  standard: {
    maxFeePerGas: bigint
    maxPriorityFeePerGas: bigint
  }
  fast: {
    maxFeePerGas: bigint
    maxPriorityFeePerGas: bigint
  }
}

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
export const getGasFeeValues = async (
  client: Client<
    Transport,
    Chain | undefined,
    Account | undefined,
    MiscRpcSchema
  >
): Promise<GetGasFeeValuesReturnType> => {
  const accountClient = client as StartaleAccountClient
  const publicClient = accountClient.client as PublicClient
  const rpcClient = createPublicClient({
    chain: accountClient.chain,
    transport: http(accountClient.chain?.rpcUrls.default.http[0])
  })

   if(publicClient === null || publicClient === undefined) {
    throw new Error("client must be passed during initialing smart account client")
   }

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
  })

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
  }
}
