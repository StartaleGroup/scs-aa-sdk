import { encodeFunctionData, getAddress } from "viem";
import { sendUserOperation } from "viem/account-abstraction";
import { getAction, parseAccount } from "viem/utils";
import { AccountNotFoundError } from "../../../account/utils/AccountNotFound.js";
import { ACCOUNT_IMPLEMENTATION_ADDRESS } from "../../../constants/index.js";
/**
 * Upgrades a smart account to a new implementation.
 *
 * @param client - The client instance.
 * @param parameters - Parameters including the smart account, optional custom implementation address, and gas settings.
 * @returns The hash of the user operation as a hexadecimal string.
 * @throws {AccountNotFoundError} If the account is not found.
 *
 * @example
 * import { upgradeSmartAccount } from '@startale-scs/test-sdk'
 *
 * const userOpHash = await upgradeSmartAccount(startaleClient, {
 *   // Optional custom implementation address
 *   implementationAddress: '0x...',
 *   // Optional initialization data
 *   initData: '0x'
 * })
 * console.log(userOpHash) // '0x...'
 */
export async function upgradeSmartAccount(client, parameters) {
    const { account: account_ = client.account, maxFeePerGas, maxPriorityFeePerGas, nonce, implementationAddress = ACCOUNT_IMPLEMENTATION_ADDRESS, initData = "0x", ...rest } = parameters ?? {};
    if (!account_) {
        throw new AccountNotFoundError({
            docsPath: "/startale-client/methods#upgradeSmartAccount"
        });
    }
    const account = parseAccount(account_);
    const calls = await toUpgradeSmartAccountCalls(account, {
        implementationAddress,
        initData
    });
    const sendUserOperationParams = {
        calls,
        maxFeePerGas,
        maxPriorityFeePerGas,
        nonce,
        account,
        ...rest
    };
    return getAction(client, sendUserOperation, "sendUserOperation")(sendUserOperationParams);
}
export const toUpgradeSmartAccountCalls = async (account, { implementationAddress, initData }) => [
    {
        to: account.address,
        value: BigInt(0),
        data: encodeFunctionData({
            abi: [
                {
                    name: "upgradeToAndCall",
                    type: "function",
                    stateMutability: "payable",
                    inputs: [
                        {
                            type: "address",
                            name: "newImplementation"
                        },
                        {
                            type: "bytes",
                            name: "data"
                        }
                    ],
                    outputs: []
                }
            ],
            functionName: "upgradeToAndCall",
            args: [getAddress(implementationAddress), initData]
        })
    }
];
//# sourceMappingURL=upgradeSmartAccount.js.map