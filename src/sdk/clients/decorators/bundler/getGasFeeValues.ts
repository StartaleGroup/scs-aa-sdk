import {
  http,
  type Account,
  type Chain,
  type Client,
  type Hex,
  type Transport,
  createPublicClient
} from "viem"
import type { MiscRpcSchema } from "."
import { safeMultiplier } from "../../../account"
import type { StartaleAccountClient } from "../../createSCSBundlerClient"

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
 * Multipliers applied to the raw bundler fee estimates before submitting a UserOperation.
 * A buffer above 1.0 guards against base-fee ticks that occur between estimation and submission,
 * which would otherwise cause the bundler to reject with "maxFeePerGas must be at least X".
 */
export type GasPriceMultipliers = {
  /**
   * Multiplier applied to `maxFeePerGas` (baseFee + priorityFee).
   * @default 1.5
   */
  maxFeePerGas?: number
  /**
   * Multiplier applied to `maxPriorityFeePerGas`.
   * @default 1.1
   */
  maxPriorityFeePerGas?: number
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
  >,
  multipliers?: GasPriceMultipliers
): Promise<GetGasFeeValuesReturnType> => {
  const accountClient = client as StartaleAccountClient
  // const publicClient = accountClient.client as PublicClient
  const rpcUrl = accountClient.chain?.rpcUrls.default.http[0]
  if (!rpcUrl) {
    throw new Error("getGasFeeValues: rpcUrl is not available")
  }
  const rpcClient = createPublicClient({
    chain: accountClient.chain,
    transport: http(rpcUrl)
  })

  const priorityFeeDataFromSCS = await client.request({
    method: "rundler_maxPriorityFeePerGas",
    params: []
  })

  const baseFeePerGas = await rpcClient
    .request({
      method: "eth_getBlockByNumber",
      params: ["latest", false]
    })
    .then((block) => {
      if (!block || !block.baseFeePerGas) {
        throw new Error("Base fee not available")
      }
      return BigInt(block.baseFeePerGas)
    })

  const maxFeeMultiplier = multipliers?.maxFeePerGas ?? 1.5
  const priorityFeeMultiplier = multipliers?.maxPriorityFeePerGas ?? 1.1

  //maxFee = (baseFee + priorityFee) * multiplier — the buffer guards against base-fee
  //ticks between estimation and submission that would cause the bundler to reject.
  const maxFeePerGas = safeMultiplier(
    baseFeePerGas + BigInt(priorityFeeDataFromSCS),
    maxFeeMultiplier
  )

  const maxPriorityFeePerGasFromSCS = safeMultiplier(
    BigInt(priorityFeeDataFromSCS),
    priorityFeeMultiplier
  )

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
