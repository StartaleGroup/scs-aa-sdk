import { waitForUserOperationReceipt as waitForUserOperationReceipt_ } from "viem/account-abstraction";
import { getAction } from "viem/utils";
export async function waitForUserOperationReceipt(client, parameters) {
    return await Promise.any([
        getAction(client, waitForUserOperationReceipt_, "waitForUserOperationReceipt")(parameters),
    ]);
}
//# sourceMappingURL=waitForUserOperationReceipt.js.map