import { getGasFeeValues } from "./getGasFeeValues.js";
import { getUserOperationStatus } from "./getUserOperationStatus.js";
import { waitForConfirmedUserOperationReceipt } from "./waitForConfirmedUserOperationReceipt.js";
import { waitForUserOperationReceipt } from "./waitForUserOperationReceipt.js";
export const bicoBundlerActions = () => (client) => ({
    getGasFeeValues: async () => getGasFeeValues(client),
    getUserOperationStatus: async (parameters) => getUserOperationStatus(client, parameters),
    waitForConfirmedUserOperationReceipt: async (parameters) => waitForConfirmedUserOperationReceipt(client, parameters),
    waitForUserOperationReceipt: async (parameters) => waitForUserOperationReceipt(client, parameters)
});
//# sourceMappingURL=index.js.map