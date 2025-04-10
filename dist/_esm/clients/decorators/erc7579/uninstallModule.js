import { encodeAbiParameters, encodeFunctionData, getAddress } from "viem";
import { sendUserOperation } from "viem/account-abstraction";
import { getAction } from "viem/utils";
import { parseAccount } from "viem/utils";
import { getInstalledValidators, getPreviousModule } from "./index.js";
import { AccountNotFoundError } from "../../../account/utils/AccountNotFound.js";
import { parseModuleTypeId } from "./supportsModule.js";
/**
 * Uninstalls a module from a smart account.
 *
 * @param client - The client instance.
 * @param parameters - Parameters including the smart account, module to uninstall, and optional gas settings.
 * @returns The hash of the user operation as a hexadecimal string.
 * @throws {AccountNotFoundError} If the account is not found.
 *
 * @example
 * import { uninstallModule } from '@biconomy/abstractjs'
 *
 * const userOpHash = await uninstallModule(nexusClient, {
 *   module: {
 *     type: 'executor',
 *     address: '0x...',
 *     context: '0x'
 *   }
 * })
 * console.log(userOpHash) // '0x...'
 */
export async function uninstallModule(client, parameters) {
    const { account: account_ = client.account, maxFeePerGas, maxPriorityFeePerGas, nonce, module: { address, initData, type } } = parameters;
    if (!account_) {
        throw new AccountNotFoundError({
            docsPath: "/nexus-client/methods#sendtransaction"
        });
    }
    const account = parseAccount(account_);
    const [installedValidators] = await getInstalledValidators(client);
    const prevModule = await getPreviousModule(client, {
        module: {
            address,
            type
        },
        installedValidators,
        account
    });
    const deInitData = encodeAbiParameters([
        { name: "prev", type: "address" },
        { name: "disableModuleData", type: "bytes" }
    ], [prevModule, initData ?? "0x"]);
    const calls = await toUninstallModuleCalls(account, {
        address,
        deInitData,
        type
    });
    return getAction(client, sendUserOperation, "sendUserOperation")({
        calls,
        maxFeePerGas,
        maxPriorityFeePerGas,
        nonce,
        account
    });
}
export const toUninstallModuleCalls = async (account, { address, deInitData = "0x", type }) => [
    {
        to: account.address,
        value: BigInt(0),
        data: encodeFunctionData({
            abi: [
                {
                    name: "uninstallModule",
                    type: "function",
                    stateMutability: "nonpayable",
                    inputs: [
                        {
                            type: "uint256",
                            name: "moduleTypeId"
                        },
                        {
                            type: "address",
                            name: "module"
                        },
                        {
                            type: "bytes",
                            name: "deInitData"
                        }
                    ],
                    outputs: []
                }
            ],
            functionName: "uninstallModule",
            args: [parseModuleTypeId(type), getAddress(address), deInitData]
        })
    }
];
//# sourceMappingURL=uninstallModule.js.map