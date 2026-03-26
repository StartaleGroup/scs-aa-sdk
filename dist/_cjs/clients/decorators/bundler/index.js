"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scsBundlerActions = void 0;
const getGasFeeValues_1 = require("./getGasFeeValues.js");
const waitForUserOperationReceipt_1 = require("./waitForUserOperationReceipt.js");
const scsBundlerActions = () => (client) => ({
    getGasFeeValues: async () => (0, getGasFeeValues_1.getGasFeeValues)(client),
    waitForUserOperationReceipt: async (parameters) => (0, waitForUserOperationReceipt_1.waitForUserOperationReceipt)(client, parameters)
});
exports.scsBundlerActions = scsBundlerActions;
//# sourceMappingURL=index.js.map