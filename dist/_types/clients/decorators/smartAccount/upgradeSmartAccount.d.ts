import { type Chain, type Client, type Hash, type Hex, type Transport } from "viem";
import { type SmartAccount, type UserOperation } from "viem/account-abstraction";
import type { Call } from "../../../account";
import type { ModularSmartAccount } from "../../../modules";
export type UpgradeSmartAccountParameters<TSmartAccount extends SmartAccount | undefined> = {
    account?: TSmartAccount;
} & {
    /** Optional custom implementation address. If not provided, the latest default implementation will be used */
    implementationAddress?: Hex;
    /** Optional initialization data to pass to the new implementation */
    initData?: Hex;
    maxFeePerGas?: bigint;
    maxPriorityFeePerGas?: bigint;
    nonce?: bigint;
} & Partial<Omit<UserOperation<"0.7", bigint>, "callData">>;
/**
 * Upgrades a smart account to a new implementation.
 *
 * @param client - The client instance.
 * @param parameters - Parameters including the smart account, optional custom implementation address, and gas settings.
 * @returns The hash of the user operation as a hexadecimal string.
 * @throws {AccountNotFoundError} If the account is not found.
 *
 * @example
 * import { upgradeSmartAccount } from '@biconomy/abstractjs'
 *
 * const userOpHash = await upgradeSmartAccount(nexusClient, {
 *   // Optional custom implementation address
 *   implementationAddress: '0x...',
 *   // Optional initialization data
 *   initData: '0x'
 * })
 * console.log(userOpHash) // '0x...'
 */
export declare function upgradeSmartAccount<TSmartAccount extends SmartAccount | undefined>(client: Client<Transport, Chain | undefined, TSmartAccount>, parameters?: UpgradeSmartAccountParameters<TSmartAccount>): Promise<Hash>;
export declare const toUpgradeSmartAccountCalls: (account: ModularSmartAccount, { implementationAddress, initData }: {
    implementationAddress: Hex;
    initData: Hex;
}) => Promise<Call[]>;
//# sourceMappingURL=upgradeSmartAccount.d.ts.map