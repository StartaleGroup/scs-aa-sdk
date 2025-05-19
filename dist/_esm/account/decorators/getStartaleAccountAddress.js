import { pad, toHex } from "viem";
import { ACCOUNT_FACTORY_ADDRESS } from "../../constants/index.js";
import { AccountFactoryAbi } from "../../constants/abi/AccountFactory.js";
/**
 * Gets the counterfactual address for the smart account
 *
 * @param params - {@link GetUniversalAddressParams} Configuration for address computation
 * @param params.publicClient - The public client to use for the read contract
 * @param params.signerAddress - The address of the EOA signer
 * @param params.index - Optional account index (defaults to 0)
 *
 * @returns Promise resolving to the {@link Address} of the counterfactual account
 *
 * @example
 * const accountAddress = await getSmartAccountAddress({
 *   publicClient: viemPublicClient,
 *   initData: "0x123...",
 *   index: BigInt(0)
 * });
 */
export const getStartaleAccountAddress = async (params) => {
    const { publicClient, initData, factoryAddress = ACCOUNT_FACTORY_ADDRESS, index = 0n } = params;
    const salt = pad(toHex(index), { size: 32 });
    return await publicClient.readContract({
        address: factoryAddress,
        abi: AccountFactoryAbi,
        functionName: "computeAccountAddress",
        args: [initData, salt]
    });
};
//# sourceMappingURL=getStartaleAccountAddress.js.map