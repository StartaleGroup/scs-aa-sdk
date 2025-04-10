import { getOwnableValidator, getOwnableValidatorMockSignature } from "../../../constants/index.js";
import { toValidator } from "../toValidator.js";
/**
 * Creates an Ownable module for a modular smart account.
 *
 * This function sets up an Ownable module with the specified parameters,
 * including threshold and owners for the smart account.
 *
 * @param parameters - The parameters for creating the Ownable module.
 * @returns A Module object representing the created Ownable module.
 *
 * @example
 * ```typescript
 * const ownableModule = toOwnableModule({
 *   account: mySmartAccount,
 *   signer: mySigner,
 *   moduleInitArgs: {
 *     threshold: 2,
 *     owners: ['0x123...', '0x456...']
 *   }
 * });
 * ```
 *
 * @remarks
 * - If the module is already installed, it will use the existing threshold.
 * - If not installed, it will use the threshold from the initialization parameters.
 * - The function generates a mock signature based on the threshold.
 */
export const toOwnableModule = (parameters) => {
    const { signer, threshold, owners } = parameters;
    return toValidator({
        ...getOwnableValidator({ threshold, owners }),
        type: "validator",
        signer,
        getStubSignature: async () => getOwnableValidatorMockSignature({ threshold })
    });
};
//# sourceMappingURL=toOwnableModule.js.map