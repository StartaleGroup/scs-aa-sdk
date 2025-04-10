import { getAction, parseAccount } from "viem/utils";
import { AccountNotFoundError } from "../../../account/utils/AccountNotFound.js";
import { getUserOperationStatus } from "./getUserOperationStatus.js";
export async function waitForConfirmedUserOperationReceipt(client, parameters) {
    const account_ = parseAccount(parameters?.account ?? client.account);
    if (!account_)
        throw new AccountNotFoundError({
            docsPath: "/docs/actions/wallet/waitForConfirmedUserOperationReceipt"
        });
    const userOperationStatus = await getAction(client, getUserOperationStatus, "getUserOperationStatus")(parameters);
    // Recursively loop until the status is CONFIRMED with the pollingInterval
    if (userOperationStatus.state === "CONFIRMED") {
        userOperationStatus.userOperationReceipt.receipt;
        return {
            ...userOperationStatus.userOperationReceipt,
            // Overwrite the receipt type from the confirmed status
            receipt: userOperationStatus.userOperationReceipt.receipt
        };
    }
    if (userOperationStatus.state === "REJECTED") {
        throw new Error(userOperationStatus.message);
    }
    await new Promise((resolve) => setTimeout(resolve, client.pollingInterval ?? 1000));
    return await getAction(client, waitForConfirmedUserOperationReceipt, "waitForConfirmedUserOperationReceipt")(parameters);
}
//# sourceMappingURL=waitForConfirmedUserOperationReceipt.js.map