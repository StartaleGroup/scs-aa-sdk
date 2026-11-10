import type { Chain, Client, Hex, Transport } from "viem"
import { type SmartAccount, sendUserOperation } from "viem/account-abstraction"
import { getAction } from "viem/utils"
import { parseAccount } from "viem/utils"
import { AccountNotFoundError } from "../../../account/utils/AccountNotFound"
import type {
  ModularSmartAccount,
  ModuleMeta
} from "../../../modules/utils/Types"
import {
  toUninstallDeInitData,
  toUninstallModuleCalls
} from "./uninstallModule"

export type UninstallModulesParameters<
  TSmartAccount extends SmartAccount | undefined
> = { account?: TSmartAccount } & {
  modules: ModuleMeta[]
  maxFeePerGas?: bigint
  maxPriorityFeePerGas?: bigint
  nonce?: bigint
}

/**
 * Uninstalls multiple modules from a smart account in one user operation.
 *
 * Each module's `deInitData` is encoded the same way as in `uninstallModule`:
 * validators and executors get `abi.encode(prev, deInitData)`, with `prev` read
 * from the account and adjusted for the modules removed before it in the same
 * batch; a fallback's `deInitData` must start with its selector; hooks get
 * their `deInitData` as is.
 *
 * @param client - The client instance.
 * @param parameters - Parameters including the smart account, modules to uninstall, and optional gas settings.
 * @returns The hash of the user operation as a hexadecimal string.
 * @throws {AccountNotFoundError} If the account is not found.
 *
 * @example
 * import { uninstallModules } from '@startale-scs/aa-sdk'
 *
 * const userOpHash = await uninstallModules(startaleClient, {
 *   modules: [
 *     { type: 'validator', address: '0x...', deInitData: '0x' },
 *     { type: 'executor', address: '0x...', deInitData: '0x' },
 *     // selector the handler was installed for, then the handler's own data
 *     { type: 'fallback', address: '0x...', deInitData: '0x12345678' }
 *   ]
 * })
 * console.log(userOpHash) // '0x...'
 */
export async function uninstallModules<
  TSmartAccount extends SmartAccount | undefined
>(
  client: Client<Transport, Chain | undefined, TSmartAccount>,
  parameters: UninstallModulesParameters<TSmartAccount>
): Promise<Hex> {
  const {
    account: account_ = client.account,
    maxFeePerGas,
    maxPriorityFeePerGas,
    nonce,
    modules
  } = parameters

  if (!account_) {
    throw new AccountNotFoundError({
      docsPath: "/startale-client/methods#sendtransaction"
    })
  }

  const account = parseAccount(account_) as unknown as ModularSmartAccount
  const deInitData = await toUninstallDeInitData(client, account, modules)
  const calls = (
    await Promise.all(
      modules.map(({ address, type }, i) =>
        toUninstallModuleCalls(account, {
          address,
          type,
          deInitData: deInitData[i]
        })
      )
    )
  ).flat()

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
