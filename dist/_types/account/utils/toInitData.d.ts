import type { Address, Hex } from "viem";
import type { AnyData } from "../../modules";
/**
 * Formats modules to ensure they have the correct structure for the contract
 * @param modules Array of modules to format
 * @returns Formatted modules with module and data properties
 */
export declare const toInitData: (mod: AnyData) => {
    module: Address;
    data: Hex;
};
//# sourceMappingURL=toInitData.d.ts.map