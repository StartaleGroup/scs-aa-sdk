"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toValidator = void 0;
const __1 = require("../index.js");
const toValidator = (parameters) => {
    const { deInitData = "0x", type = "validator", signer, data = "0x", module, ...rest } = parameters;
    return {
        deInitData,
        data,
        module,
        address: module,
        signer,
        type,
        getStubSignature: async () => __1.DUMMY_SIGNATURE,
        signUserOpHash: async (userOpHash) => await signer.signMessage({ message: { raw: userOpHash } }),
        signMessage: async (message) => await signer.signMessage({ message }),
        ...rest
    };
};
exports.toValidator = toValidator;
//# sourceMappingURL=toValidator.js.map