"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitForUserOperationReceipt = waitForUserOperationReceipt;
const account_abstraction_1 = require("viem/account-abstraction");
const utils_1 = require("viem/utils");
const waitForConfirmedUserOperationReceipt_1 = require("./waitForConfirmedUserOperationReceipt.js");
async function waitForUserOperationReceipt(client, parameters) {
    return await Promise.any([
        (0, utils_1.getAction)(client, account_abstraction_1.waitForUserOperationReceipt, "waitForUserOperationReceipt")(parameters),
        (0, utils_1.getAction)(client, waitForConfirmedUserOperationReceipt_1.waitForConfirmedUserOperationReceipt, "waitForConfirmedUserOperationReceipt")(parameters)
    ]);
}
//# sourceMappingURL=waitForUserOperationReceipt.js.map