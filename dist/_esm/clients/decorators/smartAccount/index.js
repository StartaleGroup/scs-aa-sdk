import { debugUserOperation } from "./debugUserOperation.js";
import { prepareTokenPaymasterUserOp } from "./prepareTokenPaymasterUserOp.js";
import { prepareUserOperationWithoutSignature } from "./prepareUserOperationWithoutSignature.js";
import { sendTokenPaymasterUserOp } from "./sendTokenPaymasterUserOp.js";
import { sendTransaction } from "./sendTransaction.js";
import { signMessage } from "./signMessage.js";
import { signTypedData } from "./signTypedData.js";
import { toUpgradeSmartAccountCalls, upgradeSmartAccount } from "./upgradeSmartAccount.js";
import { waitForTransactionReceipt } from "./waitForTransactionReceipt.js";
import { writeContract } from "./writeContract.js";
export function smartAccountActions() {
    return (client) => ({
        sendTokenPaymasterUserOp: (args) => sendTokenPaymasterUserOp(client, args),
        prepareTokenPaymasterUserOp: (args) => prepareTokenPaymasterUserOp(client, args),
        sendTransaction: (args) => sendTransaction(client, args),
        signMessage: (args) => signMessage(client, args),
        signTypedData: (args) => signTypedData(client, args),
        writeContract: (args) => writeContract(client, args),
        waitForTransactionReceipt: (args) => waitForTransactionReceipt(client, args),
        debugUserOperation: (args) => debugUserOperation(client, args),
        prepareUserOperation: (args) => prepareUserOperationWithoutSignature(client, args),
        upgradeSmartAccount: (args) => upgradeSmartAccount(client, args)
    });
}
export const smartAccountCalls = {
    toUpgradeSmartAccountCalls
};
//# sourceMappingURL=index.js.map