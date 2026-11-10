import type { Chain, Client, Hex, Transport } from "viem"
import { type SmartAccount, sendUserOperation } from "viem/account-abstraction"
import { getAction } from "viem/utils"
import { parseAccount } from "viem/utils"
import { AccountNotFoundError } from "../../../account/utils/AccountNotFound"
import type { Call } from "../../../account/utils/Types"
import type {
  ModularSmartAccount,
  ModuleMeta
} from "../../../modules/utils/Types"
import { toFallbackDeInitData, toUninstallModuleCalls } from "./uninstallModule"

export type UninstallFallbackParameters<
  TSmartAccount extends SmartAccount | undefined
> = { account?: TSmartAccount } & {
  module: ModuleMeta
  maxFeePerGas?: bigint
  maxPriorityFeePerGas?: bigint
  nonce?: bigint
}

/**
 * Uninstalls a fallback handler from a smart account by calling the account's
 * `uninstallModule` with module type 3.
 *
 * `deInitData` must start with the 4-byte selector the handler was installed
 * for. The account clears the handler for that selector and passes the rest of
 * `deInitData` to the handler's `onUninstall`.
 *
 * @param client - The client instance.
 * @param parameters - Parameters including the smart account, module to uninstall, and optional gas settings.
 * @returns The hash of the user operation as a hexadecimal string.
 * @throws {AccountNotFoundError} If the account is not found.
 *
 * @example
 * import { uninstallFallback } from '@startale-scs/aa-sdk'
 *
 * const userOpHash = await uninstallFallback(startaleClient, {
 *   module: {
 *     type: 'fallback',
 *     address: '0x...',
 *     deInitData: '0x12345678' // the selector the handler was installed for
 *   }
 * })
 * console.log(userOpHash) // '0x...'
 */
export async function uninstallFallback<
  TSmartAccount extends SmartAccount | undefined
>(
  client: Client<Transport, Chain | undefined, TSmartAccount>,
  parameters: UninstallFallbackParameters<TSmartAccount>
): Promise<Hex> {
  const {
    account: account_ = client.account,
    maxFeePerGas,
    maxPriorityFeePerGas,
    nonce,
    module
  } = parameters

  if (!account_) {
    throw new AccountNotFoundError({
      docsPath: "/startale-client/methods#sendtransaction"
    })
  }

  const account = parseAccount(account_) as ModularSmartAccount
  const calls = await toUninstallFallbackCalls(account, module)

  return getAction(
    client,
    sendUserOperation,
    "sendUserOperation"
  )({
    calls,
    maxFeePerGas,
    maxPriorityFeePerGas,
    nonce,
    account: account
  })
}

export const toUninstallFallbackCalls = async (
  account: ModularSmartAccount,
  { address, deInitData }: ModuleMeta
): Promise<Call[]> =>
  toUninstallModuleCalls(account, {
    address,
    type: "fallback",
    deInitData: toFallbackDeInitData(deInitData)
  })
