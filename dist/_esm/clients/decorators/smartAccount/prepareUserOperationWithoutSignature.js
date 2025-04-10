import { prepareUserOperation } from "viem/account-abstraction";
import { getAction } from "viem/utils";
import { safeMultiplier } from "../../../account/utils/Utils.js";
const gasFields = [
    "preVerificationGas",
    "verificationGasLimit",
    "callGasLimit",
    "maxFeePerGas",
    "maxPriorityFeePerGas",
    "paymasterVerificationGasLimit",
    "paymasterPostOpGasLimit"
];
export async function prepareUserOperationWithoutSignature(client, parameters) {
    const { gasBuffer, ...args } = parameters;
    let userOp = await getAction(client, prepareUserOperation, "prepareUserOperation")(args);
    if (gasBuffer) {
        // Fields that need gas safety margin applied
        const { fields, factor } = gasBuffer;
        const adjustedGasEstimates = gasFields.reduce((adjustedValues, field) => {
            if (fields.includes(field)) {
                adjustedValues[field] = safeMultiplier(userOp[field], factor);
            }
            return adjustedValues;
        }, {});
        // Apply gas safety margin to specified fields and merge with original userOp
        userOp = {
            ...userOp,
            ...adjustedGasEstimates
        };
    }
    // Remove signature from userOp if it exists
    const { signature, ...userOpWithoutSignature } = userOp;
    // @ts-ignore
    return userOpWithoutSignature;
}
//# sourceMappingURL=prepareUserOperationWithoutSignature.js.map