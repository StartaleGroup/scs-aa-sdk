import type { Chain, Client, Hash, SendTransactionParameters, Transport } from "viem";
import { type SendUserOperationParameters, type SmartAccount } from "viem/account-abstraction";
/**
 * Creates, signs, and sends a new transaction to the network using a smart account.
 * This function also allows you to sponsor this transaction if the sender is a smart account.
 *
 * @param client - The client instance.
 * @param args - Parameters for sending the transaction or user operation.
 * @returns The transaction hash as a hexadecimal string.
 * @throws {AccountNotFoundError} If the account is not found.
 *
 * @example
 * import { sendTransaction } from '@biconomy/abstractjs'
 *
 * const hash = await sendTransaction(nexusClient, {
 *   to: '0x...',
 *   value: parseEther('0.1'),
 *   data: '0x...'
 * })
 * console.log(hash) // '0x...'
 */
export declare function sendTransaction<account extends SmartAccount | undefined, chain extends Chain | undefined, accountOverride extends SmartAccount | undefined = undefined, chainOverride extends Chain | undefined = Chain | undefined, calls extends readonly unknown[] = readonly unknown[]>(client: Client<Transport, chain, account>, args: SendTransactionParameters<chain, account, chainOverride> | SendUserOperationParameters<account, accountOverride, calls>): Promise<Hash>;
//# sourceMappingURL=sendTransaction.d.ts.map