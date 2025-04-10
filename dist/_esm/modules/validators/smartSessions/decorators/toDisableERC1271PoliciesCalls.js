import { getDisableERC1271PoliciesAction } from "@rhinestone/module-sdk";
/**
 * Converts permission ID, policies and contents into disable ERC1271 policies calls
 */
export const toDisableERC1271PoliciesCalls = async (_, parameters) => {
    const action = getDisableERC1271PoliciesAction({
        permissionId: parameters.permissionId,
        policies: parameters.policies,
        contents: parameters.contents
    });
    return [
        {
            to: action.target,
            value: BigInt(action.value.toString()),
            data: action.callData
        }
    ];
};
//# sourceMappingURL=toDisableERC1271PoliciesCalls.js.map