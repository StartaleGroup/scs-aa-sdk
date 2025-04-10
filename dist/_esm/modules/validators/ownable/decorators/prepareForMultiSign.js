import { parseAccount } from "viem/utils";
import { AccountNotFoundError } from "../../../../account/utils/AccountNotFound.js";
export async function prepareForMultiSign(nexusClient, parameters) {
    const { account: account_ = nexusClient.account, ...rest } = parameters;
    if (!account_) {
        throw new AccountNotFoundError({
            docsPath: "/nexus-client/methods#sendtransaction"
        });
    }
    const nexusAccount = parseAccount(account_);
    const publicClient = nexusAccount?.client;
    if (!publicClient) {
        throw new Error("Public client not found");
    }
    // @ts-ignore
    const userOp = await nexusClient.prepareUserOperation(rest);
    // @ts-ignore
    const userOpHash = nexusAccount.getUserOpHash(userOp);
    return { userOpHash, userOp };
}
//# sourceMappingURL=prepareForMultiSign.js.map