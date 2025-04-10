import type { Chain, Client, Hex, Transport } from "viem";
import type { Call } from "../../../../account/utils/Types";
import type { ModularSmartAccount } from "../../../utils/Types";
/**
 * Parameters for removing an owner from a smart account.
 *
 * @template TModularSmartAccount - Type of the smart account, extending SmartAccount or undefined.
 */
export type RemoveOwnerParameters<TModularSmartAccount extends ModularSmartAccount | undefined> = {
    /** The smart account to remove the owner from. If not provided, the client's account will be used. */
    account?: TModularSmartAccount;
    /** The address of the owner to be removed. */
    owner: Hex;
    /** The maximum fee per gas unit the transaction is willing to pay. */
    maxFeePerGas?: bigint;
    /** The maximum priority fee per gas unit the transaction is willing to pay. */
    maxPriorityFeePerGas?: bigint;
    /** The nonce of the transaction. If not provided, it will be determined automatically. */
    nonce?: bigint;
};
/**
 * Removes an owner from a smart account.
 *
 * This function prepares and sends a user operation to remove an existing owner from the specified smart account.
 * It handles the creation of the necessary action data and sends the user operation.
 *
 * @template TModularSmartAccount - Type of the smart account, extending SmartAccount or undefined.
 * @param client - The client used to interact with the blockchain.
 * @param parameters - The parameters for removing the owner.
 * @returns A promise that resolves to the hash of the sent user operation.
 *
 * @throws {AccountNotFoundError} If no account is provide
 * @throws {Error} If there's an error getting the remove owner action.
 *
 * @example
 * ```typescript
 * import { removeOwner } from '@biconomy/abstractjs'
 *
 * const userOpHash = await removeOwner(nexusClient, {
 *   owner: '0x...'
 * })
 * console.log(userOpHash) // '0x...'
 * ```
 */
export declare function removeOwner<TModularSmartAccount extends ModularSmartAccount | undefined>(client: Client<Transport, Chain | undefined, TModularSmartAccount>, parameters: RemoveOwnerParameters<TModularSmartAccount>): Promise<Hex>;
export declare const toRemoveOwnerCalls: (account: ModularSmartAccount, parameters: RemoveOwnerParameters<ModularSmartAccount | undefined>) => Promise<Call[]>;
//# sourceMappingURL=removeOwner.d.ts.map