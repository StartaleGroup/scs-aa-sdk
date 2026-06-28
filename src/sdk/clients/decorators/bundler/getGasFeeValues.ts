import {
  http,
  type Account,
  type Chain,
  type Client,
  type Hex,
  type PublicClient,
  type Transport,
  createPublicClient
} from "viem"
import type { MiscRpcSchema } from "."
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

// Bundlers reject user ops when maxPriorityFeePerGas is below their internal threshold.
// eth_maxPriorityFeePerGas on the RPC can return very low values during low-activity
// periods (e.g. ~70000 wei on Ethereum mainnet). Only needed for chains where this has
// been observed — L2s (Soneium, Base, Optimism) accept near-zero priority fees.
// Extend this map when other chains show "precheck failed" with a low priority fee.
const PRIORITY_FEE_FLOOR: Record<number, bigint> = {
  1: 1_000_000_000n // Ethereum mainnet: 1 gwei
}

const resolveRpcClient = (accountClient: StartaleAccountClient): PublicClient => {
  const attached = accountClient.client as PublicClient | undefined
  if (attached) return attached
  const rpcUrl = accountClient.chain?.rpcUrls.default.http[0]
  if (!rpcUrl) {
    throw new Error(
      "getGasFeeValues: no chain RPC URL available — pass a publicClient via the client option"
    )
  }
  return createPublicClient({ chain: accountClient.chain, transport: http(rpcUrl) })
}

const applyFloorAndBuild = (
  baseFee: bigint,
  rawPriorityFee: bigint,
  chainId: number
): GetGasFeeValuesReturnType => {
  const floor = PRIORITY_FEE_FLOOR[chainId] ?? 0n
  const priorityFee = rawPriorityFee < floor ? floor : rawPriorityFee
  const maxFeePerGas = baseFee * 2n + priorityFee
  return {
    slow: { maxFeePerGas, maxPriorityFeePerGas: priorityFee },
    standard: { maxFeePerGas, maxPriorityFeePerGas: priorityFee },
    fast: { maxFeePerGas, maxPriorityFeePerGas: priorityFee }
  }
}

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
export const getGasFeeValues = async (
  client: Client<
    Transport,
    Chain | undefined,
    Account | undefined,
    MiscRpcSchema
  >
): Promise<GetGasFeeValuesReturnType> => {
  const accountClient = client as StartaleAccountClient
  const chainId = accountClient.chain?.id ?? 0
  const bundlerUrl = (client.transport as { url?: string }).url ?? ""

  // Pimlico: pimlico_getUserOperationGasPrice returns a complete slow/standard/fast
  // fee object from Pimlico's own pricing — no RPC call or floor adjustment needed
  // since Pimlico guarantees these values pass its own precheck.
  if (bundlerUrl.includes("pimlico")) {
    const fees = (await client.request({
      method: "pimlico_getUserOperationGasPrice",
      params: []
    })) as UserOperationGasPriceWithBigIntAsHex
    return {
      slow: {
        maxFeePerGas: BigInt(fees.slow.maxFeePerGas),
        maxPriorityFeePerGas: BigInt(fees.slow.maxPriorityFeePerGas)
      },
      standard: {
        maxFeePerGas: BigInt(fees.standard.maxFeePerGas),
        maxPriorityFeePerGas: BigInt(fees.standard.maxPriorityFeePerGas)
      },
      fast: {
        maxFeePerGas: BigInt(fees.fast.maxFeePerGas),
        maxPriorityFeePerGas: BigInt(fees.fast.maxPriorityFeePerGas)
      }
    }
  }

  // Alchemy (Rundler): rundler_maxPriorityFeePerGas reflects what Alchemy's Rundler
  // needs — more reliable than the mempool estimate from the RPC. Still combine with
  // baseFeePerGas from the public client and apply the chain floor as a safety net.
  if (bundlerUrl.includes("alchemy")) {
    const rpcClient = resolveRpcClient(accountClient)
    const [priorityFeeHex, block] = await Promise.all([
      client.request({ method: "rundler_maxPriorityFeePerGas", params: [] }),
      rpcClient.getBlock({ blockTag: "latest" })
    ])
    return applyFloorAndBuild(
      block.baseFeePerGas ?? 1n,
      BigInt(priorityFeeHex as Hex),
      chainId
    )
  }

  // All other providers (Startale SCS, custom bundlers): use standard eth_ methods
  // on the RPC endpoint — never call fee methods on the bundler transport directly
  // since support varies widely across implementations.
  const rpcClient = resolveRpcClient(accountClient)
  const [block, priorityFee] = await Promise.all([
    rpcClient.getBlock({ blockTag: "latest" }),
    rpcClient.estimateMaxPriorityFeePerGas()
  ])
  return applyFloorAndBuild(block.baseFeePerGas ?? 1n, priorityFee, chainId)
}
