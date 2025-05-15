import { http, type Address, type OneOf, type Transport } from "viem"
import {
  type PaymasterClient,
  type PaymasterClientConfig,
  createPaymasterClient
} from "viem/account-abstraction"
import {
  type TokenPaymasterActions,
  scsTokenPaymasterActions
} from "./decorators/tokenPaymaster"

export type SCSPaymasterClient = Omit<
  PaymasterClient,
  "getPaymasterStubData"
> &
  TokenPaymasterActions

/**
 * Configuration options for creating a SCS Paymaster Client.
 * @typedef {Object} SCSPaymasterClientConfig
 * @property {Transport} [transport] - Optional custom transport.
 * @property {string} [paymasterUrl] - URL of the paymaster service.
 * @property {number} [chainId] - Chain ID for the network.
 * @property {string} [apiKey] - API key for authentication.
 */
type SCSPaymasterClientConfig = Omit<PaymasterClientConfig, "transport"> &
  OneOf<
    | {
        transport?: Transport
      }
    | {
        paymasterUrl: string
      }
    | {
        chainId: number
        apiKey: string
      }
  >

/**
 * Context for the SCS SPONSORED Paymaster.
 */
export type SCSPaymasterContext = {
  // mode: "ERC20" | "SPONSORED"
  // sponsorshipInfo?: {
  //   smartAccountInfo: {
  //     name: string
  //     version: string
  //   }
  // }
  // tokenInfo?: {
  //   feeTokenAddress: Address
  // }
  paymasterId?: string
  token?: Address
  // expiryDuration?: number
  calculateGasLimits?: boolean

}

type ToSCSTokenPaymasterContextParams = {
  // feeTokenAddress: Address
  token: Address
  // expiryDuration?: number
  calculateGasLimits?: boolean
}

export const scsSponsoredPaymasterContext: SCSPaymasterContext = {
  // mode: "SPONSORED",
  // expiryDuration: 300,
  calculateGasLimits: true,
  // Review this has to be dynamic
  paymasterId: "pm_test",
  // sponsorshipInfo: {
  //   smartAccountInfo: {
  //     name: "BICONOMY",
  //     version: "2.0.0"
  //   }
  // }
}

export const toSCSSponsoredPaymasterContext = (
  params?: Partial<SCSPaymasterContext>
): SCSPaymasterContext => {
  return {
    ...scsSponsoredPaymasterContext,
    ...params
  }
}

export const toSCSTokenPaymasterContext = (
  params: ToSCSTokenPaymasterContextParams
): SCSPaymasterContext => {
  const { calculateGasLimits } = params
  return {
    // mode: "ERC20",
    // sponsorshipInfo: {
    //   smartAccountInfo: {
    //     name: "BICONOMY",
    //     version: "2.0.0"
    //   }
    // },
    // tokenInfo: {
    //   feeTokenAddress
    // // },
    token: params.token,
    // expiryDuration: expiryDuration ?? 6000,
    calculateGasLimits: calculateGasLimits ?? true
  }
}

/**
 * Creates a SCS Paymaster Client.
 *
 * This function sets up a client for interacting with SCS's paymaster service.
 * It can be configured with a custom transport, a specific paymaster URL, or with a chain ID and API key.
 *
 * @param {SCSPaymasterClientConfig} parameters - Configuration options for the client.
 * @returns {PaymasterClient} A configured Paymaster Client instance.
 *
 * @example
 * // Create a client with a custom transport
 * const client1 = createSCSPaymasterClient({ transport: customTransport })
 *
 * @example
 * // Create a client with a specific paymaster URL
 * const client2 = createSCSPaymasterClient({ paymasterUrl: 'https://example.com/paymaster' })
 *
 * @example
 * // Create a client with chain ID and API key
 * const client3 = createSCSPaymasterClient({ chainId: 1, apiKey: 'your-api-key' })
 *
 * @example
 * // Create a Token Paymaster Client
 * const tokenPaymasterClient = createSCSPaymasterClient({
 *      paymasterUrl: 'https://example.com/paymaster',
 *      paymasterContext: {
 *        mode: "ERC20",
 *        tokenInfo: {
 *          feeTokenAddress: "0x..."
 *        }
 *      },
 * })
 */
export const createSCSPaymasterClient = (
  parameters: SCSPaymasterClientConfig
): SCSPaymasterClient => {
  const defaultedTransport = parameters.transport
    ? parameters.transport
    : parameters.paymasterUrl
      ? http(parameters.paymasterUrl)
      : http(
          `https://paymaster.biconomy.io/api/v2/${parameters.chainId}/${parameters.apiKey}`
        )

  // Remove getPaymasterStubData from the client.
  const { getPaymasterStubData, ...paymasterClient } = createPaymasterClient({
    ...parameters,
    transport: defaultedTransport
  }).extend(scsTokenPaymasterActions())

  return paymasterClient
}
