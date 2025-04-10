import { formatUserOperationRequest, getUserOperationError, toPackedUserOperation } from "viem/account-abstraction";
import { parseAccount } from "viem/accounts";
import { AccountNotFoundError } from "../../../account/utils/AccountNotFound.js";
import { parseRequestArguments } from "../../../account/utils/Utils.js";
import { deepHexlify } from "../../../account/utils/deepHexlify.js";
import { getAAError } from "../../../account/utils/getAAError.js";
import { DUMMY_SIMULATION_GAS, tenderlySimulation } from "../../../account/utils/tenderlySimulation.js";
/**
 * Broadcasts a User Operation to the Bundler.
 *
 * - Docs: https://viem.sh/actions/bundler/debugUserOperation
 *
 * @param client - Client to use
 * @param parameters - {@link DebugUserOperationParameters}
 * @returns The User Operation hash. {@link DebugUserOperationReturnType}
 *
 * @example
 * import { createBundlerClient, http, parseEther } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { toSmartAccount } from 'viem/accounts'
 * import { debugUserOperation } from 'viem/actions'
 *
 * const account = await toSmartAccount({ ... })
 *
 * const bundlerClient = createBundlerClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 *
 * const values = await debugUserOperation(bundlerClient, {
 *   account,
 *   calls: [{ to: '0x...', value: parseEther('1') }],
 * })
 */
export async function debugUserOperation(client, parameters) {
    const chainId = Number(client.account?.client?.chain?.id?.toString() ?? 84532);
    try {
        const { account: account_ = client.account, entryPointAddress } = parameters;
        if (!account_ && !parameters.sender)
            throw new AccountNotFoundError();
        const account = account_ ? parseAccount(account_) : undefined;
        // @ts-ignore
        const callData = await account?.encodeCalls(parameters?.calls);
        // @ts-ignore
        const sender = await account?.getAddress();
        // @ts-ignore
        const nonce = await account?.getNonce();
        // @ts-ignore
        const factoryArgs = await account?.getFactoryArgs();
        const request = {
            sender,
            callData,
            nonce,
            ...factoryArgs,
            ...parameters,
            ...DUMMY_SIMULATION_GAS
        };
        const signature = (parameters.signature ||
            (await account?.signUserOperation(request)));
        const userOpWithSignature = { ...request, signature };
        const packed = toPackedUserOperation(userOpWithSignature);
        console.log("Packed userOp:\n", JSON.stringify([deepHexlify(packed)], null, 2));
        const rpcParameters = formatUserOperationRequest(userOpWithSignature);
        console.log("Bundler userOp:", rpcParameters);
        const tenderlyUrl = tenderlySimulation(rpcParameters, chainId);
        console.log({ tenderlyUrl });
        try {
            const hash = await client.request({
                method: "eth_sendUserOperation",
                params: [
                    rpcParameters,
                    (entryPointAddress ?? account?.entryPoint.address)
                ]
            }, { retryCount: 0 });
            console.log("User Operation Hash:", hash);
            return hash;
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        }
        catch (error) {
            if (error?.details) {
                const aaError = await getAAError(error?.details);
                console.log({ aaError });
            }
            const calls = parameters.calls;
            throw getUserOperationError(error, {
                ...request,
                ...(calls ? { calls } : {}),
                signature
            });
        }
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    }
    catch (error) {
        if (error.metaMessages) {
            try {
                const messageJson = parseRequestArguments(error.metaMessages);
                const tenderlyUrl = tenderlySimulation(messageJson);
                console.log({ tenderlyUrl });
            }
            catch (error) { }
        }
        throw error;
    }
}
//# sourceMappingURL=debugUserOperation.js.map