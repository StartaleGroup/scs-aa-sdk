import { parseAccount } from "viem/utils";
import { AccountNotFoundError } from "../../../account/utils/AccountNotFound.js";
export async function waitForTransactionReceipt(client, { account: account_ = client.account, hash }) {
    if (!account_)
        throw new AccountNotFoundError({
            docsPath: "/docs/actions/wallet/waitForTransactionReceipt"
        });
    const account = parseAccount(account_);
    const accountClient = account?.client;
    if (!accountClient)
        throw new Error("Requires a Public Client");
    return accountClient.waitForTransactionReceipt({ hash });
}
//# sourceMappingURL=waitForTransactionReceipt.js.map