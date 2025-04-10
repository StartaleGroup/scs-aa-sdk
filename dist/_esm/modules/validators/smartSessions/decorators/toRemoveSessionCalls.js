import { getRemoveSessionAction } from "@rhinestone/module-sdk";
export const toRemoveSessionCalls = async (_, parameters) => {
    const action = getRemoveSessionAction({
        permissionId: parameters.permissionId
    });
    return [
        {
            to: action.target,
            value: BigInt(action.value.toString()),
            data: action.callData
        }
    ];
};
//# sourceMappingURL=toRemoveSessionCalls.js.map