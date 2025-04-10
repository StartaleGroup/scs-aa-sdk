import { type Chain, type Client, type Hex, type ReadContractParameters, type Transport } from "viem";
import type { SmartAccount } from "viem/account-abstraction";
import type { ModularSmartAccount, ModuleMeta } from "../../../modules/utils/Types";
export type IsModuleInstalledParameters<TSmartAccount extends SmartAccount | undefined> = {
    account?: TSmartAccount;
} & {
    module: ModuleMeta;
};
declare const abi: readonly [{
    readonly name: "isModuleInstalled";
    readonly type: "function";
    readonly stateMutability: "view";
    readonly inputs: readonly [{
        readonly type: "uint256";
        readonly name: "moduleTypeId";
    }, {
        readonly type: "address";
        readonly name: "module";
    }, {
        readonly type: "bytes";
        readonly name: "additionalContext";
    }];
    readonly outputs: readonly [{
        readonly type: "bool";
    }];
}];
/**
 * Checks if a specific module is installed on a given smart account.
 *
 * @param client - The client instance.
 * @param parameters - Parameters including the smart account and the module to check.
 * @returns A boolean indicating whether the module is installed.
 * @throws {AccountNotFoundError} If the account is not found.
 * @throws {Error} If the accountId result is empty.
 *
 * @example
 * import { isModuleInstalled } from '@biconomy/abstractjs'
 *
 * const isInstalled = await isModuleInstalled(nexusClient, {
 *   module: {
 *     type: 'executor',
 *     address: '0x...',
 *     context: '0x'
 *   }
 * })
 * console.log(isInstalled) // true or false
 */
export declare function isModuleInstalled<TSmartAccount extends SmartAccount | undefined>(client: Client<Transport, Chain | undefined, TSmartAccount>, parameters: IsModuleInstalledParameters<TSmartAccount>): Promise<boolean>;
export declare const toIsModuleInstalledReads: (account: ModularSmartAccount, { address, initData, type }: ModuleMeta) => Promise<ReadContractParameters<typeof abi, "isModuleInstalled", [bigint, `0x${string}`, Hex]>[]>;
export declare const erc7579Reads: {
    toIsModuleInstalledReads: (account: ModularSmartAccount, { address, initData, type }: ModuleMeta) => Promise<ReadContractParameters<typeof abi, "isModuleInstalled", [bigint, `0x${string}`, Hex]>[]>;
};
export {};
//# sourceMappingURL=isModuleInstalled.d.ts.map