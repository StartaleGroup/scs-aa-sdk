import { DUMMY_SIGNATURE } from "../index.js";
export const toValidator = (parameters) => {
    const { deInitData = "0x", type = "validator", signer, data = "0x", module, ...rest } = parameters;
    return {
        deInitData,
        data,
        module,
        address: module,
        signer,
        type,
        getStubSignature: async () => DUMMY_SIGNATURE,
        signUserOpHash: async (userOpHash) => await signer.signMessage({ message: { raw: userOpHash } }),
        signMessage: async (message) => await signer.signMessage({ message }),
        ...rest
    };
};
//# sourceMappingURL=toValidator.js.map