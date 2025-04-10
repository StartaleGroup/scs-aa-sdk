import { getDisableActionPoliciesAction } from "@rhinestone/module-sdk";
/**
 * Converts permission ID, action ID and policies into disable action policies calls
 */
export const toDisableActionPoliciesCalls = async (_, parameters) => {
    const action = getDisableActionPoliciesAction({
        permissionId: parameters.permissionId,
        actionId: parameters.actionId,
        policies: parameters.policies
    });
    return [
        {
            to: action.target,
            value: BigInt(action.value.toString()),
            data: action.callData
        }
    ];
};
//# sourceMappingURL=toDisableActionPoliciesCalls.js.map