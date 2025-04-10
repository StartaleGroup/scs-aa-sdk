import { getDisableUserOpPoliciesAction } from "@rhinestone/module-sdk";
/**
 * Converts permission ID and policies into disable UserOp policies calls
 */
export const toDisableUserOpPoliciesCalls = async (_, parameters) => {
    const action = getDisableUserOpPoliciesAction({
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
//# sourceMappingURL=toDisableUserOpPoliciesCalls.js.map