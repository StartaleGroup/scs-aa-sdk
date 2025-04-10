import type { Chain, Client, Hex, ReadContractParameters, Transport } from "viem";
import type { SmartAccount } from "viem/account-abstraction";
import type { ModularSmartAccount } from "../../../modules/utils/Types";
export type GetActiveHookParameters<TSmartAccount extends SmartAccount | undefined> = {
    account?: TSmartAccount;
};
declare const abi: {
    inputs: never[];
    name: string;
    outputs: {
        internalType: string;
        name: string;
        type: string;
    }[];
    stateMutability: string;
    type: string;
}[];
/**
 * Retrieves the active hook for a given smart account.
 *
 * @param client - The client instance.
 * @param parameters - Parameters for getting the smart account.
 * @returns The address of the active hook as a hexadecimal string.
 * @throws {AccountNotFoundError} If the account is not found.
 *
 * @example
 * import { getActiveHook } from '@biconomy/abstractjs'
 *
 * const activeHook = await getActiveHook(nexusClient)
 * console.log(activeHook) // '0x...'
 */
export declare function getActiveHook<TSmartAccount extends SmartAccount | undefined>(client: Client<Transport, Chain | undefined, TSmartAccount>, parameters?: GetActiveHookParameters<TSmartAccount>): Promise<Hex>;
export declare const toGetActiveHookReads: (account: ModularSmartAccount) => Promise<ReadContractParameters<typeof abi, "getActiveHook", []>[]>;
export {};
//# sourceMappingURL=getActiveHook.d.ts.map