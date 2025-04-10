import type { Account, Chain, Client, Transport } from "viem";
import type { SmartAccount, UserOperationReceipt } from "viem/account-abstraction";
import type { BicoRpcSchema } from ".";
import { type GetUserOperationStatusParameters } from "./getUserOperationStatus";
export declare function waitForConfirmedUserOperationReceipt<TAccount extends SmartAccount | undefined>(client: Client<Transport, Chain | undefined, Account | undefined, BicoRpcSchema>, parameters: GetUserOperationStatusParameters & {
    account?: TAccount;
}): Promise<UserOperationReceipt>;
//# sourceMappingURL=waitForConfirmedUserOperationReceipt.d.ts.map