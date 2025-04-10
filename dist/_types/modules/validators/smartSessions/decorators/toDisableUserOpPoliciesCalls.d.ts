import type { Address, Hex } from "viem";
import type { Call } from "../../../../account/utils/Types";
import type { ModularSmartAccount } from "../../../utils/Types";
/**
 * Converts permission ID and policies into disable UserOp policies calls
 */
export declare const toDisableUserOpPoliciesCalls: (_: ModularSmartAccount, parameters: {
    permissionId: Hex;
    userOpPolicies: Address[];
}) => Promise<Call[]>;
//# sourceMappingURL=toDisableUserOpPoliciesCalls.d.ts.map