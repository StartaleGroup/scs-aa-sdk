import { toHex } from "viem"
import type { StartaleAccountClient } from "../../createSCSBundlerClient"
import type { SCSPaymasterClient } from "../../createSCSPaymasterClient"
import type { FeeQuote } from "./getTokenPaymasterQuotes"

/**
 * Retrieves the supported tokens for the Startale Token Paymaster..
 *
 * @param client - The Startale client instance
 * @returns A promise that resolves to an array of FeeQuote objects.
 *
 * @example
 * ```typescript
 * const supportedTokens = await paymaster.getSupportedTokens(startaleClient);
 * console.log(supportedTokens);
 * ```
 */
export const getSupportedTokens = async (
  client: StartaleAccountClient
): Promise<FeeQuote[]> => {
  const userOp = await client.prepareUserOperation({
    calls: [
      {
        to: client.account.address,
        data: "0x",
        value: 0n
      }
    ]
  })
  const paymaster = client.paymaster as SCSPaymasterClient
  if (!client?.chain?.id) throw new Error('Chain ID is required')
  const quote = await paymaster.getTokenPaymasterQuotes({
    userOp,
    chainId: toHex(client.chain.id)
    // Review: can be removed
    // tokenList: []
  })

  return quote.feeQuotes
}
