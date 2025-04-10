import { parseAccount } from "viem/utils";
import { AccountNotFoundError } from "../../../../account/utils/AccountNotFound.js";
import { getAccount, getAddOwnableValidatorOwnerAction } from "../../../../constants/index.js";
/**
 * Generates the transaction data for adding a new owner to a smart account.
 *
 * This function prepares the necessary transaction data to add a new owner to the specified smart account.
 * It doesn't send the transaction, but returns the data needed to do so.
 *
 * @template TModularSmartAccount - The type of the smart account, which can be a ModularSmartAccount or undefined.
 * @param client - The client used to interact with the blockchain.
 * @param parameters - The parameters for adding the new owner.
 * @returns A promise that resolves to a Call object containing the transaction data.
 * @throws {AccountNotFoundError} If no account is provided and the client doesn't have an associated account.
 * @throws {Error} If there's an error getting the add owner action or if the public client is not found.
 */
export async function getAddOwnerTx(client, parameters) {
    const { account: account_ = client.account, owner } = parameters;
    if (!account_) {
        throw new AccountNotFoundError({
            docsPath: "/nexus-client/methods#sendtransaction"
        });
    }
    const account = parseAccount(account_);
    const publicClient = account.client;
    if (!publicClient) {
        throw new Error("Public client not found");
    }
    const nexusAccount = getAccount({
        address: account.address,
        type: "nexus"
    });
    const action = await getAddOwnableValidatorOwnerAction({
        account: nexusAccount,
        client: publicClient,
        owner
    });
    if (!("callData" in action)) {
        throw new Error("Error getting set threshold actions");
    }
    return {
        to: action.target,
        value: BigInt(action.value.toString()),
        data: action.callData
    };
}
export const toAddOwnerCalls = async (account, parameters) => {
    return [await getAddOwnerTx({}, { ...parameters, account })];
};
//# sourceMappingURL=getAddOwnerTx.js.map