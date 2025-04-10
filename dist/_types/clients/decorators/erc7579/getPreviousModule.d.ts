import type { Client, Hex } from "viem";
import type { SmartAccount } from "viem/account-abstraction";
import type { ModuleMeta } from "../../../modules/utils/Types";
export type GetPreviousModuleParameters<TSmartAccount extends SmartAccount | undefined> = {
    account?: TSmartAccount;
} & {
    module: ModuleMeta;
    installedValidators?: readonly Hex[];
    installedExecutors?: readonly Hex[];
};
/**
 * Gets the address of the previous module of the same type as the given module.
 *
 * @param client - The client instance.
 * @param parameters - Parameters including the smart account and the module to check.
 * @returns The address of the previous module, or the sentinel address if it's the first module.
 * @throws {AccountNotFoundError} If the account is not found.
 * @throws {Error} If the module type is unknown or the module is not found.
 *
 * @example
 * import { getPreviousModule } from '@biconomy/abstractjs'
 *
 * const previousModuleAddress = await getPreviousModule(nexusClient, {
 *   module: {
 *     type: 'validator',
 *     moduleAddress: '0x...',
 *   }
 * })
 * console.log(previousModuleAddress) // '0x...'
 */
export declare function getPreviousModule<TSmartAccount extends SmartAccount | undefined>(client: Client, parameters: GetPreviousModuleParameters<TSmartAccount>): Promise<Hex>;
//# sourceMappingURL=getPreviousModule.d.ts.map