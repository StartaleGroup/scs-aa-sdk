import type { Chain, Client, Hex, Transport } from "viem";
import type { Call } from "../../../../account/utils/Types";
import type { AnyData, ModularSmartAccount } from "../../../utils/Types";
export type PrepareForMultiSignParameters<TModularSmartAccount> = {
    /** Verification gas limit. */
    verificationGasLimit?: bigint;
    /** Call gas limit. */
    callGasLimit?: bigint;
    /** Pre verification gas. */
    preVerificationGas?: bigint;
    /** The maximum fee per gas unit the transaction is willing to pay. */
    maxFeePerGas?: bigint;
    /** The maximum priority fee per gas unit the transaction is willing to pay. */
    maxPriorityFeePerGas?: bigint;
    /** The calls to be included in the user operation. */
    calls: Call[];
} & {
    account?: TModularSmartAccount;
};
export type PrepareForMultiSignPayload = {
    userOpHash: Hex;
    userOp: AnyData;
};
export declare function prepareForMultiSign<TModularSmartAccount extends ModularSmartAccount | undefined>(nexusClient: Client<Transport, Chain | undefined, TModularSmartAccount>, parameters: PrepareForMultiSignParameters<TModularSmartAccount>): Promise<PrepareForMultiSignPayload>;
//# sourceMappingURL=prepareForMultiSign.d.ts.map