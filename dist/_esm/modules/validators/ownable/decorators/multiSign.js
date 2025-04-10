import { sendUserOperation } from "viem/account-abstraction";
import { parseAccount } from "viem/utils";
import { AccountNotFoundError } from "../../../../account/utils/AccountNotFound.js";
import { getOwnableValidatorSignature } from "../../../../constants/index.js";
export async function multiSign(client, parameters) {
    const { account: account_ = client.account, signatures, ...rest } = parameters;
    if (!account_) {
        throw new AccountNotFoundError({
            docsPath: "/nexus-client/methods#sendtransaction"
        });
    }
    const account = parseAccount(account_);
    const publicClient = account?.client;
    if (!publicClient) {
        throw new Error("Public client not found");
    }
    return sendUserOperation(client, {
        ...rest,
        signature: getOwnableValidatorSignature({ signatures })
    });
}
//# sourceMappingURL=multiSign.js.map