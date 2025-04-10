import { ContractFunctionExecutionError, decodeFunctionResult, encodeFunctionData, encodePacked, toBytes, toHex } from "viem";
import { call, readContract } from "viem/actions";
import { getAction } from "viem/utils";
import { parseAccount } from "viem/utils";
import { AccountNotFoundError } from "../../../account/utils/AccountNotFound.js";
const abi = [
    {
        name: "supportsExecutionMode",
        type: "function",
        stateMutability: "view",
        inputs: [
            {
                type: "bytes32",
                name: "encodedMode"
            }
        ],
        outputs: [
            {
                type: "bool"
            }
        ]
    }
];
function parseCallType(callType) {
    switch (callType) {
        case "call":
            return "0x00";
        case "batchcall":
            return "0x01";
        case "delegatecall":
            return "0xff";
    }
}
/**
 * Encodes the execution mode for a smart account operation.
 *
 * @param mode - The execution mode parameters.
 * @returns The encoded execution mode as a hexadecimal string.
 */
export function encodeExecutionMode({ type, revertOnError, selector, data }) {
    return encodePacked(["bytes1", "bytes1", "bytes4", "bytes4", "bytes22"], [
        toHex(toBytes(parseCallType(type), { size: 1 })),
        toHex(toBytes(revertOnError ? "0x01" : "0x00", { size: 1 })),
        toHex(toBytes("0x0", { size: 4 })),
        toHex(toBytes(selector ?? "0x", { size: 4 })),
        toHex(toBytes(data ?? "0x", { size: 22 }))
    ]);
}
/**
 * Checks if a smart account supports a specific execution mode.
 *
 * @param client - The client instance.
 * @param args - Parameters including the smart account and execution mode details.
 * @returns A boolean indicating whether the execution mode is supported.
 * @throws {AccountNotFoundError} If the account is not found.
 *
 * @example
 * import { supportsExecutionMode } from '@biconomy/abstractjs'
 *
 * const isSupported = await supportsExecutionMode(nexusClient, {
 *   type: 'call',
 *   revertOnError: true,
 *   selector: '0x12345678'
 * })
 * console.log(isSupported) // true or false
 */
export async function supportsExecutionMode(client, args) {
    const { account: account_ = client.account, type, revertOnError, selector, data } = args;
    if (!account_) {
        throw new AccountNotFoundError({
            docsPath: "/nexus-client/methods#sendtransaction"
        });
    }
    const account = parseAccount(account_);
    const publicClient = account.client;
    const [supportsExecutionModeRead] = await toSupportsExecutionModeReads(account, { type, revertOnError, selector, data });
    try {
        return await getAction(publicClient, readContract, "readContract")(supportsExecutionModeRead);
    }
    catch (error) {
        if (error instanceof ContractFunctionExecutionError) {
            const { factory, factoryData } = await account.getFactoryArgs();
            const result = await getAction(publicClient, call, "call")({
                factory: factory,
                factoryData: factoryData,
                to: account.address,
                data: encodeFunctionData({
                    abi,
                    functionName: "supportsExecutionMode",
                    args: [
                        encodeExecutionMode({
                            type,
                            revertOnError,
                            selector,
                            data
                        })
                    ]
                })
            });
            if (!result || !result.data) {
                throw new Error("accountId result is empty");
            }
            return decodeFunctionResult({
                abi,
                functionName: "supportsExecutionMode",
                data: result.data
            });
        }
        throw error;
    }
}
export const toSupportsExecutionModeReads = async (account, { type, revertOnError, selector, data }) => [
    {
        abi,
        functionName: "supportsExecutionMode",
        args: [encodeExecutionMode({ type, revertOnError, selector, data })],
        address: account.address
    }
];
//# sourceMappingURL=supportsExecutionMode.js.map