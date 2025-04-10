import { type ActionData } from "@rhinestone/module-sdk";
import type { Hex } from "viem";
import type { Call } from "../../../../account/utils/Types";
import type { ModularSmartAccount } from "../../../utils/Types";
/**
 * Converts permission ID and action policies into enable action policies calls
 */
export declare const toEnableActionPoliciesCalls: (_: ModularSmartAccount, parameters: {
    permissionId: Hex;
    actionPolicies: ActionData[];
}) => Promise<Call[]>;
//# sourceMappingURL=toEnableActionPoliciesCalls.d.ts.map