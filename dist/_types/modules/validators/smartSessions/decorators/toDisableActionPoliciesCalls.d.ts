import type { Address, Hex } from "viem";
import type { Call } from "../../../../account/utils/Types";
import type { ModularSmartAccount } from "../../../utils/Types";
/**
 * Converts permission ID, action ID and policies into disable action policies calls
 */
export declare const toDisableActionPoliciesCalls: (_: ModularSmartAccount, parameters: {
    permissionId: Hex;
    actionId: Hex;
    policies: Address[];
}) => Promise<Call[]>;
//# sourceMappingURL=toDisableActionPoliciesCalls.d.ts.map