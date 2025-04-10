import { readContract } from "viem/actions";
import { getAction, parseAccount } from "viem/utils";
import { AccountNotFoundError } from "../../../account/utils/AccountNotFound.js";
import { SENTINEL_ADDRESS } from "../../../account/utils/Constants.js";
const abi = [
    {
        inputs: [
            {
                internalType: "address",
                name: "cursor",
                type: "address"
            },
            {
                internalType: "uint256",
                name: "size",
                type: "uint256"
            }
        ],
        name: "getValidatorsPaginated",
        outputs: [
            {
                internalType: "address[]",
                name: "array",
                type: "address[]"
            },
            {
                internalType: "address",
                name: "next",
                type: "address"
            }
        ],
        stateMutability: "view",
        type: "function"
    }
];
/**
 * Retrieves the installed validators for a given smart account.
 *
 * @param client - The client instance.
 * @param parameters - Parameters including the smart account, page size, and cursor.
 * @returns A tuple containing an array of validator addresses and the next cursor.
 * @throws {AccountNotFoundError} If the account is not found.
 *
 * @example
 * import { getInstalledValidators } from '@biconomy/abstractjs'
 *
 * const [validators, nextCursor] = await getInstalledValidators(nexusClient, {
 *   pageSize: 10n
 * })
 * console.log(validators, nextCursor) // ['0x...', '0x...'], '0x...'
 */
export async function getInstalledValidators(client, parameters) {
    const { account: account_ = client.account, pageSize = 100n, cursor = SENTINEL_ADDRESS } = parameters ?? {};
    if (!account_) {
        throw new AccountNotFoundError({
            docsPath: "/nexus-client/methods#sendtransaction"
        });
    }
    const account = parseAccount(account_);
    const publicClient = account.client;
    const [getInstalledValidatorsRead] = await toGetInstalledValidatorsReads(account, { pageSize, cursor });
    return getAction(publicClient, readContract, "readContract")(getInstalledValidatorsRead);
}
export const toGetInstalledValidatorsReads = async (account, { pageSize = 100n, cursor = SENTINEL_ADDRESS }) => [
    {
        address: account.address,
        abi,
        functionName: "getValidatorsPaginated",
        args: [cursor, pageSize]
    }
];
//# sourceMappingURL=getInstalledValidators.js.map