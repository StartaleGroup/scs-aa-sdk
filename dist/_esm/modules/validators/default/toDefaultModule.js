import { zeroAddress } from "viem";
import { DUMMY_SIGNATURE } from "../smartSessions/index.js";
import { toValidator } from "../toValidator.js";
export const toDefaultModule = (parameters) => toValidator({
    initData: parameters.signer.address,
    data: parameters.signer.address,
    deInitData: "0x",
    ...parameters,
    address: zeroAddress,
    module: zeroAddress,
    type: "validator",
    getStubSignature: async () => DUMMY_SIGNATURE
});
//# sourceMappingURL=toDefaultModule.js.map