import { readContract } from "viem/actions";
import { getAction, parseAccount } from "viem/utils";
import { AccountNotFoundError } from "../../../account/utils/AccountNotFound.js";
const abi = [
    {
        inputs: [],
        name: "getActiveHook",
        outputs: [
            {
                internalType: "address",
                name: "hook",
                type: "address"
            }
        ],
        stateMutability: "view",
        type: "function"
    }
];
/**
 * Retrieves the active hook for a given smart account.
 *
 * @param client - The client instance.
 * @param parameters - Parameters for getting the smart account.
 * @returns The address of the active hook as a hexadecimal string.
 * @throws {AccountNotFoundError} If the account is not found.
 *
 * @example
 * import { getActiveHook } from '@biconomy/abstractjs'
 *
 * const activeHook = await getActiveHook(nexusClient)
 * console.log(activeHook) // '0x...'
 */
export async function getActiveHook(client, parameters) {
    const account_ = parameters?.account ?? client.account;
    if (!account_) {
        throw new AccountNotFoundError({
            docsPath: "/nexus-client/methods#sendtransaction"
        });
    }
    const account = parseAccount(account_);
    const publicClient = account.client;
    const [getActiveHookRead] = await toGetActiveHookReads(account);
    return getAction(publicClient, readContract, "readContract")(getActiveHookRead);
}
export const toGetActiveHookReads = async (account) => [
    {
        address: account.address,
        abi,
        functionName: "getActiveHook"
    }
];
//# sourceMappingURL=getActiveHook.js.map