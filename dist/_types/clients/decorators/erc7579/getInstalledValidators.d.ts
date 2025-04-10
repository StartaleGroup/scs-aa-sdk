import type { Chain, Client, Hex, ReadContractParameters, Transport } from "viem";
import type { SmartAccount } from "viem/account-abstraction";
import type { ModularSmartAccount } from "../../../modules/utils/Types";
export type GetInstalledValidatorsParameters<TSmartAccount extends SmartAccount | undefined> = {
    account?: TSmartAccount;
} & {
    pageSize?: bigint;
    cursor?: Hex;
};
declare const abi: readonly [{
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "cursor";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "size";
        readonly type: "uint256";
    }];
    readonly name: "getValidatorsPaginated";
    readonly outputs: readonly [{
        readonly internalType: "address[]";
        readonly name: "array";
        readonly type: "address[]";
    }, {
        readonly internalType: "address";
        readonly name: "next";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}];
/**
 * Retrieves the installed validators for a given smart account.
 *
 * @param client - The client instance.
 * @param parameters - Parameters including the smart account, page size, and cursor.
 * @returns A tuple containing an array of validator addresses and the next cursor.
 * @throws {AccountNotFoundError} If the account is not found.
 *
 * @example
 * import { getInstalledValidators } from '@biconomy/abstractjs'
 *
 * const [validators, nextCursor] = await getInstalledValidators(nexusClient, {
 *   pageSize: 10n
 * })
 * console.log(validators, nextCursor) // ['0x...', '0x...'], '0x...'
 */
export declare function getInstalledValidators<TSmartAccount extends SmartAccount | undefined>(client: Client<Transport, Chain | undefined, TSmartAccount>, parameters?: GetInstalledValidatorsParameters<TSmartAccount>): Promise<readonly [readonly Hex[], Hex]>;
export declare const toGetInstalledValidatorsReads: (account: ModularSmartAccount, { pageSize, cursor }: GetInstalledValidatorsParameters<ModularSmartAccount>) => Promise<ReadContractParameters<typeof abi, "getValidatorsPaginated", [Hex, bigint]>[]>;
export {};
//# sourceMappingURL=getInstalledValidators.d.ts.map