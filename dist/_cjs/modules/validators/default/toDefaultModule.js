"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toDefaultModule = void 0;
const viem_1 = require("viem");
const smartSessions_1 = require("../smartSessions/index.js");
const toValidator_1 = require("../toValidator.js");
const toDefaultModule = (parameters) => (0, toValidator_1.toValidator)({
    initData: parameters.signer.address,
    data: parameters.signer.address,
    deInitData: "0x",
    ...parameters,
    address: viem_1.zeroAddress,
    module: viem_1.zeroAddress,
    type: "validator",
    getStubSignature: async () => smartSessions_1.DUMMY_SIGNATURE
});
exports.toDefaultModule = toDefaultModule;
//# sourceMappingURL=toDefaultModule.js.map