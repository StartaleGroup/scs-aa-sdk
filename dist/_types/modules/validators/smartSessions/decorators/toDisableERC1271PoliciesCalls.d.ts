import { type ERC7739Context } from "@rhinestone/module-sdk";
import type { Address, Hex } from "viem";
import type { Call } from "../../../../account/utils/Types";
import type { ModularSmartAccount } from "../../../utils/Types";
/**
 * Converts permission ID, policies and contents into disable ERC1271 policies calls
 */
export declare const toDisableERC1271PoliciesCalls: (_: ModularSmartAccount, parameters: {
    permissionId: Hex;
    policies: Address[];
    contents: ERC7739Context[];
}) => Promise<Call[]>;
//# sourceMappingURL=toDisableERC1271PoliciesCalls.d.ts.map