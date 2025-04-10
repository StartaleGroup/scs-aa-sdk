import type { Address, Chain, Client, Hex, Transport } from "viem";
import { type SmartAccount } from "viem/account-abstraction";
import type { ModuleType } from "../../../modules/utils/Types";
export type InstallModulesParameters<TSmartAccount extends SmartAccount | undefined> = {
    account?: TSmartAccount;
} & {
    modules: {
        type: ModuleType;
        address: Address;
        data: Hex;
    }[];
    maxFeePerGas?: bigint;
    maxPriorityFeePerGas?: bigint;
    nonce?: bigint;
};
/**
 * Installs multiple modules on a given smart account.
 *
 * @param client - The client instance.
 * @param parameters - Parameters including the smart account, modules to install, and optional gas settings.
 * @returns The hash of the user operation as a hexadecimal string.
 * @throws {AccountNotFoundError} If the account is not found.
 *
 * @example
 * import { installModules } from '@biconomy/abstractjs'
 *
 * const userOpHash = await installModules(nexusClient, {
 *   modules: [
 *     { type: 'executor', address: '0x...', context: '0x' },
 *     { type: 'validator', address: '0x...', context: '0x' }
 *   ]
 * })
 * console.log(userOpHash) // '0x...'
 */
export declare function installModules<TSmartAccount extends SmartAccount | undefined>(client: Client<Transport, Chain | undefined, TSmartAccount>, parameters: InstallModulesParameters<TSmartAccount>): Promise<Hex>;
//# sourceMappingURL=installModules.d.ts.map