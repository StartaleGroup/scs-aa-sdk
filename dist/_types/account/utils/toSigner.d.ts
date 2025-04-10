import { type Account, type Address, type Chain, type LocalAccount, type OneOf, type Transport, type WalletClient } from "viem";
import type { AnyData } from "../../modules/utils/Types";
import type { EthersWallet } from "./Utils";
export interface BaseProvider {
    request(...args: AnyData): Promise<AnyData>;
}
export type EthereumProvider<T extends BaseProvider = BaseProvider> = T & BaseProvider;
/** Represents a local account that can sign transactions and messages */
export type Signer = LocalAccount;
/**
 * Converts various signer types into a standardized LocalAccount format.
 * Handles conversion from different wallet implementations including ethers.js wallets,
 * EIP-1193 providers, and existing LocalAccounts.
 *
 * @param signer - The signer to convert, must implement required signing methods
 * @param address - Optional address to use for the account
 * @returns A Promise resolving to a LocalAccount
 *
 * @throws {Error} When signTransaction is called (not supported)
 * @throws {Error} When address is required but not provided
 */
export declare function toSigner<provider extends EthereumProvider, wallet extends EthersWallet>({ signer, address }: {
    signer: OneOf<provider | wallet | WalletClient<Transport, Chain | undefined, Account> | LocalAccount>;
    address?: Address;
}): Promise<LocalAccount>;
//# sourceMappingURL=toSigner.d.ts.map