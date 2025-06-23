import {
  type Account,
  type Address,
  type Chain,
  type Client,
  type Hex,
  type Transport,
  toHex
} from "viem"
import type { UserOperation } from "viem/account-abstraction"
import { ENTRY_POINT_ADDRESS } from "../../../constants"
import type { AnyData } from "../../../modules"

export type TokenPaymasterRpcSchema = [
  {
    Method: "pm_getFeeQuotes"
    Parameters: [
      TokenPaymasterUserOpParams,
      Address,
      Hex,
      TokenPaymasterConfigParams
    ]
    ReturnType: TokenPaymasterQuotesResponse
  }
]

export type FeeQuote = {
  symbol: string
  decimal: number
  tokenAddress: Address
  maxGasFee: string | Hex | number
  maxGasFeeUSD: string | Hex | number
  requiredAmount: string | Hex | number
  exchangeRate: string | Hex | number
  logoUrl: string
  premiumPercentage: string | number
}

export type TokenPaymasterQuotesResponse = {
  paymasterAddress: Address
  feeQuotes: FeeQuote[]
  unsupportedTokens: AnyData[]
}

export type TokenPaymasterUserOpParams = {
  sender: Address
  nonce: string
  factory: Address | undefined
  factoryData: `0x${string}` | undefined
  callData: `0x${string}`
  maxFeePerGas: string
  maxPriorityFeePerGas: string
  verificationGasLimit: string
  callGasLimit: string
  preVerificationGas: string
  paymasterPostOpGasLimit: string
  paymasterVerificationGasLimit: string
}

export type TokenPaymasterConfigParams = {
  expiryDuration?: number
  calculateGasLimits?: boolean
}

// Review
export type GetTokenPaymasterQuotesParameters = {
  userOp: UserOperation
  chainId: Hex
  // Note: May use this in the future
  // tokenList?: Address[],
}

/**
 * Fetches paymaster quotes for ERC20 token payment options for a given UserOperation.
 *
 * @param userOp - The UserOperation to get paymaster quotes for
 * @param client - Viem Client configured with TokenPaymaster RPC methods
 * @param tokenList - Array of ERC20 token addresses to get quotes for
 *
 * @returns A promise of {@link TokenPaymasterQuotesResponse}
 *
 * @example
 * ```typescript
 * // Configure client with paymaster RPC
 * const paymasterClient = createSCSPaymasterClient({
 *     paymasterUrl
 * })
 *
 *
 * // Get paymaster quotes
 * const quotes = await paymasterClient.getTokenPaymasterQuotes(userOp);
 *
 * // Example response:
 * // {
 * //   paymasterAddress: "0x...",
 * //   feeQuotes: [{
 * //     symbol: "USDT",
 * //     decimal: 6,
 * //     tokenAddress: "0x...",
 * //     maxGasFee: "5000000",
 * //     maxGasFeeUSD: "5",
 * //     exchangeRate: "0x94ede635",
 * //     requiredAmount: "0x57",
 * //     logoUrl: "https://...",
 * //     premiumPercentage: 5,
 * //   }],
 * //   unsupportedTokens: []
 * // }
 * ```
 */
export const getTokenPaymasterQuotes = async (
  client: Client<
    Transport,
    Chain | undefined,
    Account | undefined,
    TokenPaymasterRpcSchema
  >,
  parameters: GetTokenPaymasterQuotesParameters
): Promise<TokenPaymasterQuotesResponse> => {
  const { userOp, chainId } = parameters
  // Review: types rtransformation and requirements in pm service endpoint
  const quote = await client.request({
    method: "pm_getFeeQuotes",
    params: [
      {
        sender: userOp.sender,
        nonce: toHex(userOp.nonce),
        factory: userOp.factory,
        factoryData: userOp.factoryData,
        callData: userOp.callData,
        maxFeePerGas: userOp.maxFeePerGas.toString(),
        maxPriorityFeePerGas: userOp.maxPriorityFeePerGas.toString(),
        verificationGasLimit: toHex(Number(userOp.verificationGasLimit)),
        callGasLimit: toHex(Number(userOp.callGasLimit)),
        preVerificationGas: toHex(Number(userOp.preVerificationGas)),
        paymasterPostOpGasLimit: toHex(
          Number(userOp.paymasterPostOpGasLimit ?? 0x0)
        ),
        paymasterVerificationGasLimit: toHex(
          Number(userOp.paymasterVerificationGasLimit ?? 0x0)
        )
      },
      ENTRY_POINT_ADDRESS,
      chainId,
      {
        calculateGasLimits: true
      }
    ]
  })

  return quote
}
