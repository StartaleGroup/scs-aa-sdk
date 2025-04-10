import type { Chain, Client, Hash, Transport } from "viem";
import type { Call } from "../../../../account/utils";
import type { ModularSmartAccount } from "../../../utils/Types";
import type { GrantPermissionResponse } from "./grantPermission";
export type UsePermissionParameters<TModularSmartAccount extends ModularSmartAccount | undefined> = {
    /** Additional calls to be included in the user operation. */
    calls: Call[];
    /** Data string returned from grantPermission. Could be stored in local storage or a database. */
    sessionDetails: GrantPermissionResponse;
    /** Mode. ENABLE the first time, or USE when > 1 time. */
    mode: "ENABLE_AND_USE" | "USE";
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
    /** The nonce of the transaction. If not provided, it will be determined automatically. */
    nonce?: bigint;
    /** The modular smart account to create sessions for. If not provided, the client's account will be used. */
    account?: TModularSmartAccount;
} & {
    account?: TModularSmartAccount;
};
export type UsePermissionResponse = GrantPermissionResponse;
export declare function usePermission<TModularSmartAccount extends ModularSmartAccount | undefined>(nexusClient: Client<Transport, Chain | undefined, TModularSmartAccount>, parameters: UsePermissionParameters<TModularSmartAccount>): Promise<Hash>;
//# sourceMappingURL=usePermission.d.ts.map