import {
  http,
  type Address,
  type Client,
  type OneOf,
  type Transport,
  hexToBigInt,
  numberToHex
} from "viem"
import {
  type GetPaymasterDataParameters,
  type PaymasterClient,
  type PaymasterClientConfig,
  type SmartAccount,
  createPaymasterClient,
  formatUserOperationRequest
} from "viem/account-abstraction"
import type { StartaleSmartAccountImplementation } from "../account"
import type { AnyData } from "../modules/utils/Types"
import {
  type TokenPaymasterActions,
  scsTokenPaymasterActions
} from "./decorators/tokenPaymaster"
import {
  type GetTokenPaymasterQuotesParameters,
  getTokenPaymasterQuotes
} from "./decorators/tokenPaymaster/getTokenPaymasterQuotes"
import { guardPaymaster } from "./userOperationIntegrity"

export type SCSPaymasterClient = PaymasterClient & TokenPaymasterActions

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
 * Possible Context for the SCS Paymaster.
 */
export type SCSPaymasterContext = {
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

// These should not be any default hardcoded context
// export const scsSponsoredPaymasterContext: SCSPaymasterContext = {
//   calculateGasLimits: true,
//   // Review this has to be dynamic
//   // paymasterId: "pm_test"
// }

export const toSCSSponsoredPaymasterContext = (
  params?: Partial<SCSPaymasterContext>
): SCSPaymasterContext => {
  return {
    calculateGasLimits: false,
    ...params
  }
}

export const toSCSTokenPaymasterContext = (
  params: ToSCSTokenPaymasterContextParams
): SCSPaymasterContext => {
  const { calculateGasLimits } = params
  return {
    token: params.token,
    calculateGasLimits: calculateGasLimits ?? false
  }
}

// Only these fields are merged into the UserOperation, as in viem 2.57.18+.
// Fee fields never come from the paymaster.
const PAYMASTER_FIELDS = [
  "paymaster",
  "paymasterData",
  "paymasterAndData",
  "paymasterVerificationGasLimit",
  "paymasterPostOpGasLimit"
] as const
const STUB_FIELDS = [...PAYMASTER_FIELDS, "isFinal", "sponsor"] as const
// Single-phase: the paymaster sets and signs these instead of the bundler.
const SINGLE_PHASE_GAS_FIELDS: readonly string[] = [
  "callGasLimit",
  "verificationGasLimit",
  "preVerificationGas"
]

/** Keeps only `fields` of a paymaster response, gas limits as bigint. */
const pickPaymasterFields = (
  response: AnyData,
  fields: readonly string[]
): AnyData => {
  const picked: AnyData = {}
  for (const field of fields) {
    const value = response?.[field]
    if (value === undefined) continue
    picked[field] = SINGLE_PHASE_GAS_FIELDS.includes(field)
      ? BigInt(value)
      : value
  }
  return picked
}

/**
 * Calls `method` and returns the whole paymaster response. Since 2.57.18,
 * viem's own actions drop everything but the paymaster fields, which loses the
 * gas limits of single-phase sponsorship and the echoed UserOperation fields
 * that `guardPaymaster` checks.
 */
const requestPaymaster = async (
  client: Client,
  method: "pm_getPaymasterStubData" | "pm_getPaymasterData",
  parameters: GetPaymasterDataParameters
): Promise<AnyData> => {
  const { chainId, entryPointAddress, context, ...userOperation } = parameters
  const request = formatUserOperationRequest(userOperation)
  const { paymasterPostOpGasLimit, paymasterVerificationGasLimit, ...rest } =
    await client.request<AnyData>({
      method,
      params: [
        {
          ...request,
          callGasLimit: request.callGasLimit ?? "0x0",
          verificationGasLimit: request.verificationGasLimit ?? "0x0",
          preVerificationGas: request.preVerificationGas ?? "0x0"
        },
        entryPointAddress,
        numberToHex(chainId),
        context
      ]
    })
  return {
    ...rest,
    ...(paymasterPostOpGasLimit && {
      paymasterPostOpGasLimit: hexToBigInt(paymasterPostOpGasLimit)
    }),
    ...(paymasterVerificationGasLimit && {
      paymasterVerificationGasLimit: hexToBigInt(paymasterVerificationGasLimit)
    })
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
          `https://paymaster.scs.startale.com/v1?apikey=${parameters.apiKey}`
        )

  const baseClient = createPaymasterClient({
    ...parameters,
    transport: defaultedTransport
  })
    .extend((client: AnyData) => ({
      getTokenPaymasterQuotes: async (
        args: GetTokenPaymasterQuotesParameters
      ) => {
        const _args = args
        if (args.userOp?.authorization) {
          const authorization =
            args.userOp.authorization ||
            (await (
              client.account as SmartAccount<StartaleSmartAccountImplementation>
            )?.eip7702Authorization?.())
          args.userOp.authorization = authorization
        }
        return await getTokenPaymasterQuotes(client, _args)
      }
    }))
    .extend(scsTokenPaymasterActions())

  const getPaymasterData = ((params) =>
    requestPaymaster(
      baseClient,
      "pm_getPaymasterData",
      params
    )) as SCSPaymasterClient["getPaymasterData"]

  const getPaymasterStubData = ((params) => {
    const context = params.context as SCSPaymasterContext | undefined
    // Single-phase: paymaster estimates gas internally, bundler estimation skipped.
    // Two-phase (default): pm_getPaymasterStubData returns stub + gas limits,
    // bundler estimates gas, pm_getPaymasterData signs only
    return requestPaymaster(
      baseClient,
      context?.calculateGasLimits === true
        ? "pm_getPaymasterData"
        : "pm_getPaymasterStubData",
      params
    )
  }) as SCSPaymasterClient["getPaymasterStubData"]

  // Also guarded here so the check applies when this client is passed to
  // viem's own `createBundlerClient` instead of `createSmartAccountClient`.
  // The check runs on the whole response, before it is narrowed below.
  const guarded = guardPaymaster(
    { getPaymasterStubData, getPaymasterData },
    baseClient
  )

  return {
    ...baseClient,
    getPaymasterStubData: (async (params) => {
      const context = params.context as SCSPaymasterContext | undefined
      return pickPaymasterFields(
        await guarded.getPaymasterStubData(params),
        context?.calculateGasLimits === true
          ? [...STUB_FIELDS, ...SINGLE_PHASE_GAS_FIELDS]
          : STUB_FIELDS
      )
    }) as SCSPaymasterClient["getPaymasterStubData"],
    getPaymasterData: (async (params) =>
      pickPaymasterFields(
        await guarded.getPaymasterData(params),
        PAYMASTER_FIELDS
      )) as SCSPaymasterClient["getPaymasterData"]
  }
}
