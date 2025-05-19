import { parseAccount } from "viem/utils";
import { AccountNotFoundError } from "../../../../account/utils/AccountNotFound.js";
export async function prepareForMultiSign(startaleAccountClient, parameters) {
    const { account: account_ = startaleAccountClient.account, ...rest } = parameters;
    if (!account_) {
        throw new AccountNotFoundError({
            docsPath: "/startale-client/methods#sendtransaction"
        });
    }
    const startaleAccount = parseAccount(account_);
    const publicClient = startaleAccount?.client;
    if (!publicClient) {
        throw new Error("Public client not found");
    }
    // @ts-ignore
    const userOp = await startaleAccountClient.prepareUserOperation(rest);
    // @ts-ignore
    const userOpHash = startaleAccount.getUserOpHash(userOp);
    return { userOpHash, userOp };
}
//# sourceMappingURL=prepareForMultiSign.js.map