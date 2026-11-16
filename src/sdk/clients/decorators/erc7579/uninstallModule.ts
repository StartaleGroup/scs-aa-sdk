import {
  type Chain,
  type Client,
  type Hex,
  type Transport,
  encodeAbiParameters,
  encodeFunctionData,
  getAddress,
  size
} from "viem"
import { type SmartAccount, sendUserOperation } from "viem/account-abstraction"
import { getAction } from "viem/utils"
import { parseAccount } from "viem/utils"
import { AccountNotFoundError } from "../../../account/utils/AccountNotFound"
import type { Call } from "../../../account/utils/Types"
import type {
  ModularSmartAccount,
  ModuleMeta
} from "../../../modules/utils/Types"
import { getInstalledExecutors } from "./getInstalledExecutors"
import { getInstalledValidators } from "./getInstalledValidators"
import { getPreviousModule } from "./getPreviousModule"
import { parseModuleTypeId } from "./supportsModule"

export type UninstallModuleParameters<
  TSmartAccount extends SmartAccount | undefined
> = { account?: TSmartAccount } & {
  module: ModuleMeta
  maxFeePerGas?: bigint
  maxPriorityFeePerGas?: bigint
  nonce?: bigint
}

/**
 * Uninstalls a module from a smart account.
 *
 * `deInitData` is the module's own data and is encoded the way the account
 * expects for the module type:
 * - validator, executor: `abi.encode(prev, deInitData)`, where `prev` is the
 *   module before this one in the account's list of that type, read from the
 *   account
 * - fallback: sent as is; it must start with the 4-byte selector the handler
 *   was installed for, followed by the handler's own data
 * - hook: sent as is
 *
 * @param client - The client instance.
 * @param parameters - Parameters including the smart account, module to uninstall, and optional gas settings.
 * @returns The hash of the user operation as a hexadecimal string.
 * @throws {AccountNotFoundError} If the account is not found.
 *
 * @example
 * import { uninstallModule } from '@startale-scs/aa-sdk'
 *
 * const userOpHash = await uninstallModule(startaleClient, {
 *   module: {
 *     type: 'executor',
 *     address: '0x...',
 *     deInitData: '0x'
 *   }
 * })
 * console.log(userOpHash) // '0x...'
 */
export async function uninstallModule<
  TSmartAccount extends SmartAccount | undefined
>(
  client: Client<Transport, Chain | undefined, TSmartAccount>,
  parameters: UninstallModuleParameters<TSmartAccount>
): Promise<Hex> {
  const {
    account: account_ = client.account,
    maxFeePerGas,
    maxPriorityFeePerGas,
    nonce,
    module: { address, type }
  } = parameters

  if (!account_) {
    throw new AccountNotFoundError({
      docsPath: "/startale-client/methods#sendtransaction"
    })
  }

  const account = parseAccount(account_) as ModularSmartAccount
  const [deInitData] = await toUninstallDeInitData(client, account, [
    parameters.module
  ])

  const calls = await toUninstallModuleCalls(account, {
    address,
    deInitData,
    type
  })

  return getAction(
    client,
    sendUserOperation,
    "sendUserOperation"
  )({
    calls,
    maxFeePerGas,
    maxPriorityFeePerGas,
    nonce,
    account
  })
}

/**
 * Builds the `deInitData` the account's `uninstallModule` decodes for each
 * module, in order. Validators and executors are kept in linked lists, so they
 * get `abi.encode(prev, deInitData)`. `prev` is looked up in the account's
 * installed list of that type, as it will be once the modules before it in
 * `modules` are removed, so several modules from one list can be uninstalled
 * in the same batch. A fallback's `deInitData` must start with its selector.
 * Hooks get their `deInitData` as is.
 */
export const toUninstallDeInitData = async (
  client: Client<Transport, Chain | undefined, SmartAccount | undefined>,
  account: ModularSmartAccount,
  modules: ModuleMeta[]
): Promise<Hex[]> => {
  const installed: { validator?: Hex[]; executor?: Hex[] } = {}
  const result: Hex[] = []

  for (const { address, type, deInitData = "0x" } of modules) {
    if (type === "fallback") {
      result.push(toFallbackDeInitData(deInitData))
      continue
    }
    if (type === "hook") {
      result.push(deInitData)
      continue
    }

    if (!installed[type]) {
      const [modulesOfType] =
        type === "validator"
          ? await getInstalledValidators(client, { account })
          : await getInstalledExecutors(client, { account })
      installed[type] = [...modulesOfType]
    }
    const installedOfType = installed[type]

    const prevModule = await getPreviousModule(client, {
      module: { address, type },
      ...(type === "validator"
        ? { installedValidators: installedOfType }
        : { installedExecutors: installedOfType }),
      account
    })
    installedOfType.splice(installedOfType.indexOf(getAddress(address)), 1)

    result.push(
      encodeAbiParameters(
        [
          { name: "prev", type: "address" },
          { name: "disableModuleData", type: "bytes" }
        ],
        [prevModule, deInitData]
      )
    )
  }

  return result
}

/**
 * The account finds a fallback handler by the selector in the first 4 bytes of
 * `deInitData` and passes the rest to the handler's `onUninstall`. Without a
 * selector the account reverts with `ModuleNotInstalled`.
 */
export const toFallbackDeInitData = (deInitData: Hex = "0x"): Hex => {
  if (size(deInitData) < 4) {
    throw new Error(
      `A fallback's deInitData must start with the 4-byte selector it handles, got ${deInitData}`
    )
  }
  return deInitData
}

export const toUninstallModuleCalls = async (
  account: ModularSmartAccount,
  { address, deInitData = "0x", type }: ModuleMeta
): Promise<Call[]> => [
  {
    to: account.address,
    value: BigInt(0),
    data: encodeFunctionData({
      abi: [
        {
          name: "uninstallModule",
          type: "function",
          stateMutability: "nonpayable",
          inputs: [
            {
              type: "uint256",
              name: "moduleTypeId"
            },
            {
              type: "address",
              name: "module"
            },
            {
              type: "bytes",
              name: "deInitData"
            }
          ],
          outputs: []
        }
      ],
      functionName: "uninstallModule",
      args: [parseModuleTypeId(type), getAddress(address), deInitData]
    })
  }
]
