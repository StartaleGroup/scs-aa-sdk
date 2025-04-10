"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toSmartSessionsModule = void 0;
const module_sdk_1 = require("@rhinestone/module-sdk");
const toValidator_1 = require("../toValidator.js");
const toSmartSessionsModule = (parameters) => {
    const { signer } = parameters ?? {};
    return (0, toValidator_1.toValidator)({
        ...(0, module_sdk_1.getSmartSessionsValidator)({ useRegistry: false }),
        signer,
        type: "validator"
    });
};
exports.toSmartSessionsModule = toSmartSessionsModule;
//# sourceMappingURL=toSmartSessionsModule.js.map