"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTokenPaymasterUserOp = sendTokenPaymasterUserOp;
const viem_1 = require("viem");
const viem_2 = require("viem");
const viem_3 = require("viem");
const account_abstraction_1 = require("viem/account-abstraction");
const utils_1 = require("viem/utils");
const Constants_1 = require("../../../account/utils/Constants.js");
const prepareTokenPaymasterUserOp_1 = require("./prepareTokenPaymasterUserOp.js");
async function sendTokenPaymasterUserOp(client, args) {
    const { calls, feeTokenAddress, customApprovalAmount } = args;
    const userOp = await (0, utils_1.getAction)(client, prepareTokenPaymasterUserOp_1.prepareTokenPaymasterUserOp, "prepareTokenPaymasterUserOperation")({
        calls: [
            {
                to: feeTokenAddress,
                data: (0, viem_3.encodeFunctionData)({
                    functionName: "approve",
                    abi: viem_2.erc20Abi,
                    args: [Constants_1.BICONOMY_TOKEN_PAYMASTER, customApprovalAmount ?? viem_1.maxUint256]
                }),
                value: BigInt(0)
            },
            ...calls
        ],
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