import { getEnableERC1271PoliciesAction } from "@rhinestone/module-sdk";
/**
 * Converts permission ID and ERC1271 policies into enable policies calls
 */
export const toEnableERC1271PoliciesCalls = async (_, parameters) => {
    const action = getEnableERC1271PoliciesAction({
        permissionId: parameters.permissionId,
        erc1271Policies: parameters.erc1271Policies
    });
    return [
        {
            to: action.target,
            value: BigInt(action.value.toString()),
            data: action.callData
        }
    ];
};
//# sourceMappingURL=toEnableERC1271PoliciesCalls.js.map