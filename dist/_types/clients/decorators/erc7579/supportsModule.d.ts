import { type Chain, type Client, type ReadContractParameters, type Transport } from "viem";
import type { SmartAccount } from "viem/account-abstraction";
import type { ModularSmartAccount, ModuleType } from "../../../modules/utils/Types";
export type SupportsModuleParameters<TSmartAccount extends SmartAccount | undefined> = {
    account?: TSmartAccount;
} & {
    type: ModuleType;
};
declare const abi: readonly [{
    readonly name: "supportsModule";
    readonly type: "function";
    readonly stateMutability: "view";
    readonly inputs: readonly [{
        readonly type: "uint256";
        readonly name: "moduleTypeId";
    }];
    readonly outputs: readonly [{
        readonly type: "bool";
    }];
}];
/**
 * Parses a module type to its corresponding ID.
 *
 * @param type - The module type to parse.
 * @returns The corresponding bigint ID for the module type.
 * @throws {Error} If an invalid module type is provided.
 */
export declare function parseModuleTypeId(type: ModuleType): bigint;
/**
 * Checks if a smart account supports a specific module type.
 *
 * @param client - The client instance.
 * @param args - Parameters including the smart account and module type to check.
 * @returns A boolean indicating whether the module type is supported.
 * @throws {AccountNotFoundError} If the account is not found.
 *
 * @example
 * import { supportsModule } from '@biconomy/abstractjs'
 *
 * const isSupported = await supportsModule(nexusClient, {
 *   type: 'executor'
 * })
 * console.log(isSupported) // true or false
 */
export declare function supportsModule<TSmartAccount extends SmartAccount | undefined>(client: Client<Transport, Chain | undefined, TSmartAccount>, args: SupportsModuleParameters<TSmartAccount>): Promise<boolean>;
export declare const toSupportsModuleReads: <TSmartAccount extends SmartAccount | undefined>(account: ModularSmartAccount, { type }: SupportsModuleParameters<TSmartAccount>) => Promise<ReadContractParameters<typeof abi, "supportsModule", [bigint]>[]>;
export {};
//# sourceMappingURL=supportsModule.d.ts.map