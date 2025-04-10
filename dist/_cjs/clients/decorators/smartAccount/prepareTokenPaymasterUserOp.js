"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareTokenPaymasterUserOp = prepareTokenPaymasterUserOp;
const viem_1 = require("viem");
const viem_2 = require("viem");
const utils_1 = require("viem/utils");
const Constants_1 = require("../../../account/utils/Constants.js");
const prepareUserOperationWithoutSignature_1 = require("./prepareUserOperationWithoutSignature.js");
async function prepareTokenPaymasterUserOp(client, args) {
    const { calls, customApprovalAmount, feeTokenAddress } = args;
    const userOp = await (0, utils_1.getAction)(client, prepareUserOperationWithoutSignature_1.prepareUserOperationWithoutSignature, "prepareUserOperation")({
        calls: [
            {
                to: feeTokenAddress,
                data: (0, viem_2.encodeFunctionData)({
                    functionName: "approve",
                    abi: viem_1.erc20Abi,
                    args: [Constants_1.BICONOMY_TOKEN_PAYMASTER, customApprovalAmount ?? viem_1.maxUint256]
                }),
                value: BigInt(0)
            },
            ...calls
        ],
        account: client.account
    });
    const partialUserOp = {
        ...userOp,
        signature: undefined
    };
    return partialUserOp;
}
//# sourceMappingURL=prepareTokenPaymasterUserOp.js.map