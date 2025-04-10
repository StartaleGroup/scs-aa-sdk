"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.smartAccountCalls = void 0;
exports.smartAccountActions = smartAccountActions;
const debugUserOperation_1 = require("./debugUserOperation.js");
const prepareTokenPaymasterUserOp_1 = require("./prepareTokenPaymasterUserOp.js");
const prepareUserOperationWithoutSignature_1 = require("./prepareUserOperationWithoutSignature.js");
const sendTokenPaymasterUserOp_1 = require("./sendTokenPaymasterUserOp.js");
const sendTransaction_1 = require("./sendTransaction.js");
const signMessage_1 = require("./signMessage.js");
const signTypedData_1 = require("./signTypedData.js");
const upgradeSmartAccount_1 = require("./upgradeSmartAccount.js");
const waitForTransactionReceipt_1 = require("./waitForTransactionReceipt.js");
const writeContract_1 = require("./writeContract.js");
function smartAccountActions() {
    return (client) => ({
        sendTokenPaymasterUserOp: (args) => (0, sendTokenPaymasterUserOp_1.sendTokenPaymasterUserOp)(client, args),
        prepareTokenPaymasterUserOp: (args) => (0, prepareTokenPaymasterUserOp_1.prepareTokenPaymasterUserOp)(client, args),
        sendTransaction: (args) => (0, sendTransaction_1.sendTransaction)(client, args),
        signMessage: (args) => (0, signMessage_1.signMessage)(client, args),
        signTypedData: (args) => (0, signTypedData_1.signTypedData)(client, args),
        writeContract: (args) => (0, writeContract_1.writeContract)(client, args),
        waitForTransactionReceipt: (args) => (0, waitForTransactionReceipt_1.waitForTransactionReceipt)(client, args),
        debugUserOperation: (args) => (0, debugUserOperation_1.debugUserOperation)(client, args),
        prepareUserOperation: (args) => (0, prepareUserOperationWithoutSignature_1.prepareUserOperationWithoutSignature)(client, args),
        upgradeSmartAccount: (args) => (0, upgradeSmartAccount_1.upgradeSmartAccount)(client, args)
    });
}
exports.smartAccountCalls = {
    toUpgradeSmartAccountCalls: upgradeSmartAccount_1.toUpgradeSmartAccountCalls
};
//# sourceMappingURL=index.js.map