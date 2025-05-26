"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTokenPaymasterUserOp = sendTokenPaymasterUserOp;
const account_abstraction_1 = require("viem/account-abstraction");
const utils_1 = require("viem/utils");
const prepareTokenPaymasterUserOp_1 = require("./prepareTokenPaymasterUserOp.js");
async function sendTokenPaymasterUserOp(client, args) {
    const { calls, feeTokenAddress, customApprovalAmount } = args;
    const userOp = await (0, utils_1.getAction)(client, prepareTokenPaymasterUserOp_1.prepareTokenPaymasterUserOp, "prepareTokenPaymasterUserOperation")({
        calls,
        feeTokenAddress,
        customApprovalAmount
    });
    const partialUserOp = {
        ...userOp,
        signature: undefined
    };
    const userOpHash = await (0, utils_1.getAction)(client, account_abstraction_1.sendUserOperation, "sendUserOperation")(partialUserOp);
    return userOpHash;
}
//# sourceMappingURL=sendTokenPaymasterUserOp.js.map