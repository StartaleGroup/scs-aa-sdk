import { type ERC7739Data } from "@rhinestone/module-sdk";
import type { Hex } from "viem";
import type { Call } from "../../../../account/utils/Types";
import type { ModularSmartAccount } from "../../../utils/Types";
/**
 * Converts permission ID and ERC1271 policies into enable policies calls
 */
export declare const toEnableERC1271PoliciesCalls: (_: ModularSmartAccount, parameters: {
    permissionId: Hex;
    erc1271Policies: ERC7739Data;
}) => Promise<Call[]>;
//# sourceMappingURL=toEnableERC1271PoliciesCalls.d.ts.map