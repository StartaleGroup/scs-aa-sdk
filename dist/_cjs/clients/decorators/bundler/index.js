"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bicoBundlerActions = void 0;
const getGasFeeValues_1 = require("./getGasFeeValues.js");
const getUserOperationStatus_1 = require("./getUserOperationStatus.js");
const waitForConfirmedUserOperationReceipt_1 = require("./waitForConfirmedUserOperationReceipt.js");
const waitForUserOperationReceipt_1 = require("./waitForUserOperationReceipt.js");
const bicoBundlerActions = () => (client) => ({
    getGasFeeValues: async () => (0, getGasFeeValues_1.getGasFeeValues)(client),
    getUserOperationStatus: async (parameters) => (0, getUserOperationStatus_1.getUserOperationStatus)(client, parameters),
    waitForConfirmedUserOperationReceipt: async (parameters) => (0, waitForConfirmedUserOperationReceipt_1.waitForConfirmedUserOperationReceipt)(client, parameters),
    waitForUserOperationReceipt: async (parameters) => (0, waitForUserOperationReceipt_1.waitForUserOperationReceipt)(client, parameters)
});
exports.bicoBundlerActions = bicoBundlerActions;
//# sourceMappingURL=index.js.map