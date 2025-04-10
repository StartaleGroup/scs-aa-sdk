import type { Chain, Client, Hex, Transport } from "viem";
import type { Call } from "../../../../account/utils/Types";
import type { ModularSmartAccount } from "../../../utils/Types";
/**
 * Parameters for adding an owner to a smart account.
 *
 * @template TModularSmartAccount - The type of the smart account, which can be a ModularSmartAccount or undefined.
 */
export type AddOwnerParameters<TModularSmartAccount extends ModularSmartAccount | undefined> = {
    /** The smart account to add the owner to. If not provided, the client's account will be used. */
    account?: TModularSmartAccount;
    /** The address of the new owner to be added. */
    owner: Hex;
    /** The maximum fee per gas unit the transaction is willing to pay. */
    maxFeePerGas?: bigint;
    /** The maximum priority fee per gas unit the transaction is willing to pay. */
    maxPriorityFeePerGas?: bigint;
    /** The nonce of the transaction. If not provided, it will be determined automatically. */
    nonce?: bigint;
};
/**
 * Adds a new owner to a smart account.
 *
 * This function prepares and sends a user operation to add a new owner to the specified smart account.
 * It handles the creation of the necessary action data and sends the user operation.
 *
 * @template TModularSmartAccount - The type of the smart account, which can be a ModularSmartAccount or undefined.
 * @param client - The client used to interact with the blockchain.
 * @param parameters - The parameters for adding the new owner.
 * @returns A promise that resolves to the hash of the sent user operation.
 * @throws {AccountNotFoundError} If no account is provided and the client doesn't have an associated account.
 * @throws {Error} If there's an error getting the add owner action.
 */
export declare function addOwner<TModularSmartAccount extends ModularSmartAccount | undefined>(client: Client<Transport, Chain | undefined, TModularSmartAccount>, parameters: AddOwnerParameters<TModularSmartAccount>): Promise<Hex>;
export declare const toAddOwnerCalls: (account: ModularSmartAccount, parameters: AddOwnerParameters<ModularSmartAccount | undefined>) => Promise<Call[]>;
//# sourceMappingURL=addOwner.d.ts.map