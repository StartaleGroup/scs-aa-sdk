import { waitForUserOperationReceipt as waitForUserOperationReceipt_ } from "viem/account-abstraction";
import { getAction } from "viem/utils";
import { waitForConfirmedUserOperationReceipt } from "./waitForConfirmedUserOperationReceipt.js";
export async function waitForUserOperationReceipt(client, parameters) {
    return await Promise.any([
        getAction(client, waitForUserOperationReceipt_, "waitForUserOperationReceipt")(parameters),
        getAction(client, waitForConfirmedUserOperationReceipt, "waitForConfirmedUserOperationReceipt")(parameters)
    ]);
}
//# sourceMappingURL=waitForUserOperationReceipt.js.map