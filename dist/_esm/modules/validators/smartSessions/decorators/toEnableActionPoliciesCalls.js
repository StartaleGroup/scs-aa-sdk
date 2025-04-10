import { getEnableActionPoliciesAction } from "@rhinestone/module-sdk";
/**
 * Converts permission ID and action policies into enable action policies calls
 */
export const toEnableActionPoliciesCalls = async (_, parameters) => {
    const action = getEnableActionPoliciesAction({
        permissionId: parameters.permissionId,
        actionPolicies: parameters.actionPolicies
    });
    return [
        {
            to: action.target,
            value: BigInt(action.value.toString()),
            data: action.callData
        }
    ];
};
//# sourceMappingURL=toEnableActionPoliciesCalls.js.map