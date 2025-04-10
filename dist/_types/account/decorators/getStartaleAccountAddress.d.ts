import { type Address } from "viem";
import type { PublicClient } from "viem";
/**
 * Parameters for getting the MEE counterfactual address
 * @property publicClient - {@link PublicClient} The public client to use for the read contract
 * @property signerAddress - {@link Address} The address of the EOA signer
 * @property index - Optional BigInt index for deterministic deployment (defaults to 0)
 */
export type GetUniversalAddressParams<ExtendedPublicClient extends PublicClient> = {
    factoryAddress: Address;
    publicClient: ExtendedPublicClient;
    initData: Address;
    index: bigint;
};
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
export declare const getStartaleAccountAddress: (params: GetUniversalAddressParams<PublicClient>) => Promise<Address>;
//# sourceMappingURL=getStartaleAccountAddress.d.ts.map