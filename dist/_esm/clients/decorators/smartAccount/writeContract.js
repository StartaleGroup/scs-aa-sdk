import { encodeFunctionData } from "viem";
import { getAction } from "viem/utils";
import { sendTransaction } from "./sendTransaction.js";
/**
 * Executes a write operation on a smart contract using a smart account.
 *
 * @param client - The client instance.
 * @param parameters - Parameters for the contract write operation.
 * @returns The transaction hash as a hexadecimal string.
 * @throws {Error} If the 'to' address is missing in the request.
 *
 * @example
 * import { writeContract } from '@biconomy/abstractjs'
 * import { encodeFunctionData } from 'viem'
 *
 * const encodedCall = encodeFunctionData({
 *   abi: CounterAbi,
 *   functionName: "incrementNumber"
 * })
 * const call = {
 *   to: '0x61f70428b61864B38D9B45b7B032c700B960acCD',
 *   data: encodedCall
 * }
 * const hash = await writeContract(nexusClient, call)
 * console.log(hash) // '0x...'
 */
export async function writeContract(client, { abi, address, args, dataSuffix, functionName, ...request }) {
    const data = encodeFunctionData({
        abi,
        args,
        functionName
    });
    const hash = await getAction(client, (sendTransaction), "sendTransaction")({
        data: `${data}${dataSuffix ? dataSuffix.replace("0x", "") : ""}`,
        to: address,
        ...request
    });
    return hash;
}
//# sourceMappingURL=writeContract.js.map