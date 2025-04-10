"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareUserOperationWithoutSignature = prepareUserOperationWithoutSignature;
const account_abstraction_1 = require("viem/account-abstraction");
const utils_1 = require("viem/utils");
const Utils_1 = require("../../../account/utils/Utils.js");
const gasFields = [
    "preVerificationGas",
    "verificationGasLimit",
    "callGasLimit",
    "maxFeePerGas",
    "maxPriorityFeePerGas",
    "paymasterVerificationGasLimit",
    "paymasterPostOpGasLimit"
];
async function prepareUserOperationWithoutSignature(client, parameters) {
    const { gasBuffer, ...args } = parameters;
    let userOp = await (0, utils_1.getAction)(client, account_abstraction_1.prepareUserOperation, "prepareUserOperation")(args);
    if (gasBuffer) {
        const { fields, factor } = gasBuffer;
        const adjustedGasEstimates = gasFields.reduce((adjustedValues, field) => {
            if (fields.includes(field)) {
                adjustedValues[field] = (0, Utils_1.safeMultiplier)(userOp[field], factor);
            }
            return adjustedValues;
        }, {});
        userOp = {
            ...userOp,
            ...adjustedGasEstimates
        };
    }
    const { signature, ...userOpWithoutSignature } = userOp;
    return userOpWithoutSignature;
}
//# sourceMappingURL=prepareUserOperationWithoutSignature.js.map