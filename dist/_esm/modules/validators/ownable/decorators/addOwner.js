import { sendUserOperation } from "viem/account-abstraction";
import { getAction, parseAccount } from "viem/utils";
import { AccountNotFoundError } from "../../../../account/utils/AccountNotFound.js";
import { getAddOwnableValidatorOwnerAction } from "../../../../constants/index.js";
/**
 * Adds a new owner to a smart account.
 *
 * This function prepares and sends a user operation to add a new owner to the specified smart account.
 * It handles the creation of the necessary action data and sends the user operation.
 *
 * @template TModularSmartAccount - The type of the smart account, which can be a ModularSmartAccount or undefined.
 * @param client - The client used to interact with the blockchain.
 * @param parameters - The parameters for adding the new owner.
 * @returns A promise that resolves to the hash of the sent user operation.
 * @throws {AccountNotFoundError} If no account is provided and the client doesn't have an associated account.
 * @throws {Error} If there's an error getting the add owner action.
 */
export async function addOwner(client, parameters) {
    const { account: account_ = client.account, maxFeePerGas, maxPriorityFeePerGas, nonce } = parameters;
    if (!account_) {
        throw new AccountNotFoundError({
            docsPath: "/nexus-client/methods#sendtransaction"
        });
    }
    const account = parseAccount(account_);
    const calls = await toAddOwnerCalls(account, parameters);
    return getAction(client, sendUserOperation, "sendUserOperation")({
        calls,
        maxFeePerGas,
        maxPriorityFeePerGas,
        nonce,
        account
    });
}
export const toAddOwnerCalls = async (account, parameters) => {
    const action = await getAddOwnableValidatorOwnerAction({
        account: { address: account.address, deployedOnChains: [], type: "nexus" },
        client: account.client,
        owner: parameters.owner
    });
    if (!("callData" in action)) {
        throw new Error("Error getting add owner action");
    }
    return [
        {
            to: action.target,
            value: BigInt(action.value.toString()),
            data: action.callData
        }
    ];
};
//# sourceMappingURL=addOwner.js.map