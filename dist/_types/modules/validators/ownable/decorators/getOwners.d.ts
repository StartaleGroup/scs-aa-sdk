import type { Address, Chain, Client, Transport } from "viem";
import type { ModularSmartAccount } from "../../../utils/Types";
/**
 * Parameters for retrieving the owners of a smart account.
 *
 * @template TModularSmartAccount - The type of the smart account, which can be a ModularSmartAccount or undefined.
 */
export type GetOwnersParameters<TModularSmartAccount extends ModularSmartAccount | undefined> = {
    /** The smart account to get the owners for. If not provided, the client's account will be used. */
    account?: TModularSmartAccount;
};
/**
 * Retrieves the list of owners for a smart account.
 *
 * This function fetches the current owners of the specified smart account.
 *
 * @template TModularSmartAccount - The type of the smart account, which can be a ModularSmartAccount or undefined.
 * @param client - The client used to interact with the blockchain.
 * @param parameters - The parameters for retrieving the owners. If not provided, defaults will be used.
 * @returns A promise that resolves to an array of addresses representing the owners of the account.
 * @throws {AccountNotFoundError} If no account is provided and the client doesn't have an associated account.
 * @throws {Error} If the public client is not found.
 */
export declare function getOwners<TModularSmartAccount extends ModularSmartAccount | undefined>(client: Client<Transport, Chain | undefined, TModularSmartAccount>, parameters?: GetOwnersParameters<TModularSmartAccount>): Promise<Address[]>;
//# sourceMappingURL=getOwners.d.ts.map