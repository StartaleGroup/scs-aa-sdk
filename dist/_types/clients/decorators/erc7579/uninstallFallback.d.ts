import { type Chain, type Client, type Hex, type Transport } from "viem";
import { type SmartAccount } from "viem/account-abstraction";
import type { Call } from "../../../account/utils/Types";
import type { ModularSmartAccount, ModuleMeta } from "../../../modules/utils/Types";
export type UninstallFallbackParameters<TSmartAccount extends SmartAccount | undefined> = {
    account?: TSmartAccount;
} & {
    module: ModuleMeta;
    maxFeePerGas?: bigint;
    maxPriorityFeePerGas?: bigint;
    nonce?: bigint;
};
/**
 * Uninstalls a fallback module from a smart account.
 *
 * @param client - The client instance.
 * @param parameters - Parameters including the smart account, module to uninstall, and optional gas settings.
 * @returns The hash of the user operation as a hexadecimal string.
 * @throws {AccountNotFoundError} If the account is not found.
 *
 * @example
 * import { uninstallFallback } from '@biconomy/abstractjs'
 *
 * const userOpHash = await uninstallFallback(nexusClient, {
 *   module: {
 *     type: 'fallback',
 *     address: '0x...',
 *     context: '0x'
 *   }
 * })
 * console.log(userOpHash) // '0x...'
 */
export declare function uninstallFallback<TSmartAccount extends SmartAccount | undefined>(client: Client<Transport, Chain | undefined, TSmartAccount>, parameters: UninstallFallbackParameters<TSmartAccount>): Promise<Hex>;
export declare const toUninstallFallbackCalls: (account: ModularSmartAccount, { address, initData, type }: ModuleMeta) => Promise<Call[]>;
//# sourceMappingURL=uninstallFallback.d.ts.map