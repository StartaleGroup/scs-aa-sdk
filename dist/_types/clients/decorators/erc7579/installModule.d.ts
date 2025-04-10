import { type Chain, type Client, type Hex, type Transport } from "viem";
import { type SmartAccount, type UserOperation } from "viem/account-abstraction";
import type { Call } from "../../../account/utils/Types";
import type { ModularSmartAccount, ModuleMeta } from "../../../modules/utils/Types";
export type InstallModuleParameters<TSmartAccount extends SmartAccount | undefined> = {
    account?: TSmartAccount;
} & {
    module: ModuleMeta;
    maxFeePerGas?: bigint;
    maxPriorityFeePerGas?: bigint;
    nonce?: bigint;
} & Partial<Omit<UserOperation<"0.7", bigint>, "callData">>;
/**
 * Installs a module on a given smart account.
 *
 * @param client - The client instance.
 * @param parameters - Parameters including the smart account, module to install, and optional gas settings.
 * @returns The hash of the user operation as a hexadecimal string.
 * @throws {AccountNotFoundError} If the account is not found.
 *
 * @example
 * import { installModule } from '@biconomy/abstractjs'
 *
 * const userOpHash = await installModule(nexusClient, {
 *   module: {
 *     type: 'executor',
 *     address: '0x...',
 *     context: '0x'
 *   }
 * })
 * console.log(userOpHash) // '0x...'
 */
export declare function installModule<TSmartAccount extends SmartAccount | undefined>(client: Client<Transport, Chain | undefined, TSmartAccount>, parameters: InstallModuleParameters<TSmartAccount>): Promise<Hex>;
export declare const toSafeSenderCalls: (__: ModularSmartAccount, { address }: ModuleMeta) => Promise<Call[]>;
export declare const toInstallModuleCalls: (account: ModularSmartAccount, { address, initData, type }: ModuleMeta) => Promise<Call[]>;
export declare const toInstallWithSafeSenderCalls: (account: ModularSmartAccount, { address, initData, type }: ModuleMeta) => Promise<Call[]>;
//# sourceMappingURL=installModule.d.ts.map