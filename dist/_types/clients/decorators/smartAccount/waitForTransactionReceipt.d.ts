import type { Chain, Client, Transport, WaitForTransactionReceiptParameters, WaitForTransactionReceiptReturnType } from "viem";
import type { SmartAccount } from "viem/account-abstraction";
export declare function waitForTransactionReceipt<TAccount extends SmartAccount | undefined>(client: Client<Transport, Chain | undefined, TAccount>, { account: account_, hash }: WaitForTransactionReceiptParameters & {
    account?: TAccount;
}): Promise<WaitForTransactionReceiptReturnType>;
//# sourceMappingURL=waitForTransactionReceipt.d.ts.map