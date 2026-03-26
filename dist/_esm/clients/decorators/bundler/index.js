import { getGasFeeValues } from "./getGasFeeValues.js";
import { waitForUserOperationReceipt } from "./waitForUserOperationReceipt.js";
export const scsBundlerActions = () => (client) => ({
    getGasFeeValues: async () => getGasFeeValues(client),
    waitForUserOperationReceipt: async (parameters) => waitForUserOperationReceipt(client, parameters)
});
//# sourceMappingURL=index.js.map