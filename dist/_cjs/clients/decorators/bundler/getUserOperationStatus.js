"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserOperationStatus = getUserOperationStatus;
async function getUserOperationStatus(client, parameters) {
    return await client.request({
        method: "biconomy_getUserOperationStatus",
        params: [parameters.hash]
    });
}
//# sourceMappingURL=getUserOperationStatus.js.map