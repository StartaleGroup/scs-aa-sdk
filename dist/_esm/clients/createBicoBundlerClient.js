import { http } from "viem";
import { createBundlerClient } from "viem/account-abstraction";
import { biconomySponsoredPaymasterContext } from "./createBicoPaymasterClient.js";
import { bicoBundlerActions } from "./decorators/bundler/index.js";
import { getGasFeeValues } from "./decorators/bundler/getGasFeeValues.js";
import { erc7579Actions } from "./decorators/erc7579/index.js";
import { smartAccountActions } from "./decorators/smartAccount/index.js";
/**
 * Creates a Bico Bundler Client with a given Transport configured for a Chain.
 *
 * @param parameters - Configuration for the Bico Bundler Client
 * @returns A Bico Bundler Client
 *
 * @example
 * import { createBicoBundlerClient, http } from '@biconomy/abstractjs'
 * import { mainnet } from 'viem/chains'
 *
 * const bundlerClient = createBicoBundlerClient({ chain: mainnet });
 */
export const createBicoBundlerClient = (parameters) => {
    const { mock = false, transport, bundlerUrl, apiKey, paymaster, paymasterContext, userOperation, chain } = parameters;
    if (!apiKey && !bundlerUrl && !transport && !chain) {
        throw new Error("Cannot set determine a bundler url, please provide a chain.");
    }
    const defaultedTransport = transport
        ? transport
        : bundlerUrl
            ? http(bundlerUrl)
            : http(
            // @ts-ignore: Type saftey provided by the if statement above
            `https://bundler.biconomy.io/api/v3/${chain?.id}/${apiKey ?? "nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f14"}`);
    const defaultedPaymasterContext = paymaster
        ? (paymasterContext ?? biconomySponsoredPaymasterContext)
        : undefined;
    const defaultedUserOperation = userOperation ?? {
        estimateFeesPerGas: async () => {
            return (await getGasFeeValues(bundler_)).fast;
        }
    };
    const bundler_ = createBundlerClient({
        ...parameters,
        transport: defaultedTransport,
        paymasterContext: defaultedPaymasterContext,
        userOperation: defaultedUserOperation
    })
        .extend((client) => ({ ...client, mock }))
        .extend(bicoBundlerActions())
        .extend(erc7579Actions())
        .extend(smartAccountActions());
    return bundler_;
};
// Aliases for backwards compatibility
export const createSmartAccountClient = createBicoBundlerClient;
export const createNexusClient = createSmartAccountClient;
export const createNexusSessionClient = createSmartAccountClient;
//# sourceMappingURL=createBicoBundlerClient.js.map