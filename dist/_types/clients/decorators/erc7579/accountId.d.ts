import { type Chain, type Client, type Transport } from "viem";
import type { SmartAccount } from "viem/account-abstraction";
/**
 * Retrieves the account ID for a given smart account.
 *
 * @param client - The client instance.
 * @param args - Optional parameters for getting the smart account.
 * @returns The account ID as a string.
 * @throws {AccountNotFoundError} If the account is not found.
 * @throws {Error} If the accountId result is empty.
 *
 * @example
 * import { accountId } from '@biconomy/abstractjs'
 *
 * const id = await accountId(nexusClient)
 * console.log(id) // 'example_account_id'
 */
export declare function accountId<TSmartAccount extends SmartAccount | undefined>(client: Client<Transport, Chain | undefined, TSmartAccount>, args?: {
    account?: TSmartAccount;
}): Promise<string>;
//# sourceMappingURL=accountId.d.ts.map