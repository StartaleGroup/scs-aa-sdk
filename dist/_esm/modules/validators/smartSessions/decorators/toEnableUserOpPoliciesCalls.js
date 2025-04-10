import { getEnableUserOpPoliciesAction } from "@rhinestone/module-sdk";
/**
 * Converts permission ID and policies into disable UserOp policies calls
 */
export const toEnableUserOpPoliciesCalls = async (_, parameters) => {
    const action = getEnableUserOpPoliciesAction({
        permissionId: parameters.permissionId,
        userOpPolicies: parameters.userOpPolicies
    });
    return [
        {
            to: action.target,
            value: BigInt(action.value.toString()),
            data: action.callData
        }
    ];
};
//# sourceMappingURL=toEnableUserOpPoliciesCalls.js.map