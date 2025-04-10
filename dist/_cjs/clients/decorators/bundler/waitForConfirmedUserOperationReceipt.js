"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitForConfirmedUserOperationReceipt = waitForConfirmedUserOperationReceipt;
const utils_1 = require("viem/utils");
const AccountNotFound_1 = require("../../../account/utils/AccountNotFound.js");
const getUserOperationStatus_1 = require("./getUserOperationStatus.js");
async function waitForConfirmedUserOperationReceipt(client, parameters) {
    const account_ = (0, utils_1.parseAccount)(parameters?.account ?? client.account);
    if (!account_)
        throw new AccountNotFound_1.AccountNotFoundError({
            docsPath: "/docs/actions/wallet/waitForConfirmedUserOperationReceipt"
        });
    const userOperationStatus = await (0, utils_1.getAction)(client, getUserOperationStatus_1.getUserOperationStatus, "getUserOperationStatus")(parameters);
    if (userOperationStatus.state === "CONFIRMED") {
        userOperationStatus.userOperationReceipt.receipt;
        return {
            ...userOperationStatus.userOperationReceipt,
            receipt: userOperationStatus.userOperationReceipt.receipt
        };
    }
    if (userOperationStatus.state === "REJECTED") {
        throw new Error(userOperationStatus.message);
    }
    await new Promise((resolve) => setTimeout(resolve, client.pollingInterval ?? 1000));
    return await (0, utils_1.getAction)(client, waitForConfirmedUserOperationReceipt, "waitForConfirmedUserOperationReceipt")(parameters);
}
//# sourceMappingURL=waitForConfirmedUserOperationReceipt.js.map