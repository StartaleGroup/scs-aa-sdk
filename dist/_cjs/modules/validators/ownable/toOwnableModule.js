"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toOwnableModule = void 0;
const constants_1 = require("../../../constants/index.js");
const toValidator_1 = require("../toValidator.js");
const toOwnableModule = (parameters) => {
    const { signer, threshold, owners } = parameters;
    return (0, toValidator_1.toValidator)({
        ...(0, constants_1.getOwnableValidator)({ threshold, owners }),
        type: "validator",
        signer,
        getStubSignature: async () => (0, constants_1.getOwnableValidatorMockSignature)({ threshold })
    });
};
exports.toOwnableModule = toOwnableModule;
//# sourceMappingURL=toOwnableModule.js.map