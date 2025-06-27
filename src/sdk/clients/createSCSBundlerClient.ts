import {
  http,
  type BundlerRpcSchema,
  type Chain,
  type Client,
  type OneOf,
  type Prettify,
  type RpcSchema,
  type Transport
} from "viem"
import {
  type BundlerActions,
  type BundlerClientConfig,
  type PrepareUserOperationParameters,
  type SendUserOperationParameters,
  type SmartAccount,
  createBundlerClient,
  prepareUserOperation,
  sendUserOperation
} from "viem/account-abstraction"
import type { StartaleSmartAccountImplementation } from "../account"
import type { AnyData, ModularSmartAccount } from "../modules/utils/Types"
import { type SCSActions, scsBundlerActions } from "./decorators/bundler"
import { getGasFeeValues } from "./decorators/bundler/getGasFeeValues"
import { type Erc7579Actions, erc7579Actions } from "./decorators/erc7579"
import {
  type SmartAccountActions,
  smartAccountActions
} from "./decorators/smartAccount"
import { prepareTokenPaymasterUserOp, type PrepareTokenPaymasterUserOpParameters } from "./decorators/smartAccount/prepareTokenPaymasterUserOp"

/**
 * Startale Account Client type
 */
export type StartaleAccountClient<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined,
  account extends ModularSmartAccount | undefined =
    | ModularSmartAccount
    | undefined,
  client extends Client | undefined = Client | undefined,
  rpcSchema extends RpcSchema | undefined = undefined
> = Prettify<
  Client<
    transport,
    chain extends Chain
      ? chain
      : client extends Client<AnyData, infer chain>
        ? chain
        : undefined,
    account,
    rpcSchema extends RpcSchema
      ? [...BundlerRpcSchema, ...rpcSchema]
      : BundlerRpcSchema,
    BundlerActions<account>
  >
> &
  BundlerActions<ModularSmartAccount> &
  SCSActions &
  Erc7579Actions<ModularSmartAccount> &
  SmartAccountActions<chain, ModularSmartAccount> & {
    /**
     * Whether to use the test bundler. Conditionally used by the `getGasFeeValues` decorator.
     */
    mock: boolean
    /**
     * The Smart account associated with this client
     */
    account: ModularSmartAccount
    /**
     * Optional client for additional functionality
     */
    client?: client | Client | undefined
    /**
     * Optional paymaster configuration
     */
    paymaster?: BundlerClientConfig["paymaster"] | undefined
    /**
     * Optional paymaster context
     */
    paymasterContext?: unknown
    /**
     * Optional user operation configuration
     */
    userOperation?: BundlerClientConfig["userOperation"] | undefined
  }

type SCSBundlerClientConfig = Omit<BundlerClientConfig, "transport"> & {
  /**
   * Whether to use the test bundler. Conditionally used by the `getGasFeeValues` decorator.
   */
  mock?: boolean
} & OneOf<
    | {
        transport: Transport
      }
    | {
        bundlerUrl: string
      }
    | {
        apiKey?: string
      }
  >

/**
 * Creates SCS Bundler Client with a given Transport configured for a Chain.
 *
 * @param parameters - Configuration for the SCS Bundler Client
 * @returns SCS Bundler Client
 *
 * @example
 * import { createSCSBundlerClient, http } from '@startale-scs/aa-sdk'
 * import { mainnet } from 'viem/chains'
 *
 * const bundlerClient = createSCSBundlerClient({ chain: mainnet });
 */
export const createSCSBundlerClient = (parameters: SCSBundlerClientConfig) => {
  const {
    mock = false,
    transport,
    bundlerUrl,
    apiKey,
    paymaster,
    paymasterContext,
    userOperation,
    chain
  } = parameters

  if (!apiKey && !bundlerUrl && !transport && !chain) {
    throw new Error(
      "Cannot set determine a bundler url, please provide a chain."
    )
  }

  const defaultedTransport = transport
    ? transport
    : bundlerUrl
      ? http(bundlerUrl)
      : http(
          // @ts-ignore: Type saftey provided by the if statement above
          `https://soneium-minato.bundler.scs.startale.com?apikey=${apiKey ?? "admin"}`
        )

  const defaultedPaymasterContext = paymaster ? paymasterContext : undefined

  const defaultedUserOperation = userOperation ?? {
    estimateFeesPerGas: async () => {
      return (await getGasFeeValues(bundler_)).fast
    }
  }

  const bundler_ = createBundlerClient({
    ...parameters,
    transport: defaultedTransport,
    paymasterContext: defaultedPaymasterContext,
    userOperation: defaultedUserOperation
  })
    .extend((client: AnyData) => ({ ...client, mock }))
    .extend((client: AnyData) => ({
      prepareUserOperation: async (args: PrepareUserOperationParameters) => {
        let _args = args
        if (client.account?.authorization) {
          const authorization =
            args.authorization ||
            (await (
              client.account as SmartAccount<StartaleSmartAccountImplementation>
            )?.eip7702Authorization?.())
          _args = {
            ...args,
            authorization
          }
        }
        return await prepareUserOperation(client, _args)
      }
    }))
    .extend((client: AnyData) => ({
      sendUserOperation: async (args: SendUserOperationParameters) => {
        let _args = args
        if (client.account?.authorization) {
          const authorization =
            args.authorization ||
            (await (
              client.account as SmartAccount<StartaleSmartAccountImplementation>
            )?.eip7702Authorization?.())
          _args = {
            ...args,
            authorization
          }
        }
        return await sendUserOperation(client, _args)
      }
    }))
    .extend((client: AnyData) => ({
      prepareTokenPaymasterUserOp: async (args: PrepareTokenPaymasterUserOpParameters) => {
        let _args = args
        if (client.account?.authorization) {
          const authorization =
            args.authorization ||
            (await (
              client.account as SmartAccount<StartaleSmartAccountImplementation>
            )?.eip7702Authorization?.())
          _args = {
            ...args,
            authorization
          }
        }
        return await prepareTokenPaymasterUserOp(client, _args)
      }
    }))
    .extend(scsBundlerActions())
    .extend(erc7579Actions())
    .extend(smartAccountActions()) as unknown as StartaleAccountClient

  return bundler_
}

// Aliases for backwards compatibility
export const createSmartAccountClient = createSCSBundlerClient
export const createStartaleAccountClient = createSmartAccountClient
export const createStartaleSessionClient = createSmartAccountClient
export type SCSBundlerClient = StartaleAccountClient
