import type { Chain, Client, Hex, PublicClient, Transport } from "viem"
import { sendUserOperation } from "viem/account-abstraction"
import { getAction, parseAccount } from "viem/utils"
import { AccountNotFoundError } from "../../../../account/utils/AccountNotFound"
import type { Call } from "../../../../account/utils/Types"
import type { ModularSmartAccount } from "../../../utils/Types"
import type { RevokeSessionResponse } from "../Types"
import { getRemoveSessionAction } from "@rhinestone/module-sdk"

/**
 * Parameters for revoking a session by permissionId in a modular smart account.
 *
 * @template TModularSmartAccount - Type of the modular smart account, extending ModularSmartAccount or undefined.
 */
export type RevokeSessionParameters<
  TModularSmartAccount extends ModularSmartAccount | undefined
> = {
  /** The permission ID to revoke. */
  permissionId: Hex
  /** The maximum fee per gas unit the transaction is willing to pay. */
  maxFeePerGas?: bigint
  /** The maximum priority fee per gas unit the transaction is willing to pay. */
  maxPriorityFeePerGas?: bigint
  /** The nonce of the transaction. If not provided, it will be determined automatically. */
  nonce?: bigint
  /** Optional public client for blockchain interactions. */
  publicClient?: PublicClient
  /** The modular smart account to revoke the session for. If not provided, the client's account will be used. */
  account?: TModularSmartAccount
  /** Additional calls to be included in the user operation. */
  calls?: Call[]
}

/**
 * Revokes a particular session by permissionId in the SmartSessionValidator module of a given smart account.
 *
 * This function prepares and sends a user operation to revoke a particular session by permissionId
 * for the specified modular smart account.
 *
 * @template TModularSmartAccount - Type of the modular smart account, extending ModularSmartAccount or undefined.
 * @param client - The client used to interact with the blockchain.
 * @param parameters - Parameters including the smart account, permissionId, and optional gas settings.
 * @returns A promise that resolves to an object containing the user operation hash.
 *
 * @throws {AccountNotFoundError} If the account is not found.
 * @throws {Error} If there's an error getting the enable sessions action.
 *
 * @example
 * ```typescript
 * import { revokeSession } from '@startale-scs/aa-sdk'
 *
 * const result = await revokeSession(startaleClient, {
 *   permissionId: '0x...',
 * });
 * console.log(result.userOpHash); // '0x...'
 * ```
 *
 * @remarks
 * - Ensure that the client has sufficient gas to cover the transaction.
 * - The session is revoked by the permissionId.
 */
export async function revokeSession<
  TModularSmartAccount extends ModularSmartAccount | undefined
>(
  client: Client<Transport, Chain | undefined, TModularSmartAccount>,
  parameters: RevokeSessionParameters<TModularSmartAccount>
): Promise<RevokeSessionResponse> {
  const {
    account: account_ = client.account,
    maxFeePerGas,
    maxPriorityFeePerGas,
    nonce,
    calls: calls_
  } = parameters

  if (!account_) {
    throw new AccountNotFoundError({
      docsPath: "/startale-client/methods#sendtransaction"
    })
  }

  const account = parseAccount(account_) as ModularSmartAccount
  if (!account || !account.address) {
    throw new Error("Account not found")
  }

  const action = getRemoveSessionAction({
    permissionId: parameters.permissionId
  });

  const userOpHash = await getAction(
    client,
    sendUserOperation,
    "sendUserOperation"
  )({
    calls: [
      {
        to: action.target,
        value: BigInt(action.value.toString()),
        data: action.callData
      },
      ...(calls_ || [])
    ],
    maxFeePerGas,
    maxPriorityFeePerGas,
    nonce,
    account
  })

  return {
    userOpHash,
  }
}