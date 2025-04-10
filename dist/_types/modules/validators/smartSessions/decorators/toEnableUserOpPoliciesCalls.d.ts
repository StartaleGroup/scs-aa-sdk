import { type PolicyData } from "@rhinestone/module-sdk";
import type { Hex } from "viem";
import type { Call } from "../../../../account/utils/Types";
import type { ModularSmartAccount } from "../../../utils/Types";
/**
 * Converts permission ID and policies into disable UserOp policies calls
 */
export declare const toEnableUserOpPoliciesCalls: (_: ModularSmartAccount, parameters: {
    permissionId: Hex;
    userOpPolicies: PolicyData[];
}) => Promise<Call[]>;
//# sourceMappingURL=toEnableUserOpPoliciesCalls.d.ts.map