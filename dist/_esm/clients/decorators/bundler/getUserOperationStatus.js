// Review: If we could integrate our specific API
export async function getUserOperationStatus(client, parameters) {
    return await client.request({
        method: "biconomy_getUserOperationStatus",
        params: [parameters.hash]
    });
}
//# sourceMappingURL=getUserOperationStatus.js.map