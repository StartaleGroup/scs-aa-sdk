import type { Chain, Client, Hex, ReadContractParameters, Transport } from "viem";
import type { SmartAccount } from "viem/account-abstraction";
import type { ModularSmartAccount } from "../../../modules/utils/Types";
export type GetFallbackBySelectorParameters<TSmartAccount extends SmartAccount | undefined> = {
    account?: TSmartAccount;
} & Partial<{
    selector?: Hex;
}>;
declare const abi: {
    inputs: {
        internalType: string;
        name: string;
        type: string;
    }[];
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
 * Retrieves the fallback handler for a given selector in a smart account.
 *
 * @param client - The client instance.
 * @param parameters - Parameters including the smart account and optional selector.
 * @returns A tuple containing the call type and address of the fallback handler.
 * @throws {AccountNotFoundError} If the account is not found.
 *
 * @example
 * import { getFallbackBySelector } from '@biconomy/abstractjs'
 *
 * const [callType, handlerAddress] = await getFallbackBySelector(nexusClient, {
 *   selector: '0x12345678'
 * })
 * console.log(callType, handlerAddress) // '0x1' '0x...'
 */
export declare function getFallbackBySelector<TSmartAccount extends SmartAccount | undefined>(client: Client<Transport, Chain | undefined, TSmartAccount>, parameters: GetFallbackBySelectorParameters<TSmartAccount>): Promise<[Hex, Hex]>;
export declare const toGetFallbackBySelectorReads: (account: ModularSmartAccount, selector: Hex) => Promise<ReadContractParameters<typeof abi, "getFallbackHandlerBySelector", [Hex]>[]>;
export {};
//# sourceMappingURL=getFallbackBySelector.d.ts.map