import type { Account, Chain, Client, Transport } from "viem";
import { type WaitForUserOperationReceiptParameters, type WaitForUserOperationReceiptReturnType } from "viem/account-abstraction";
import type { BicoRpcSchema } from ".";
export declare function waitForUserOperationReceipt(client: Client<Transport, Chain | undefined, Account | undefined, BicoRpcSchema>, parameters: WaitForUserOperationReceiptParameters): Promise<WaitForUserOperationReceiptReturnType>;
//# sourceMappingURL=waitForUserOperationReceipt.d.ts.map