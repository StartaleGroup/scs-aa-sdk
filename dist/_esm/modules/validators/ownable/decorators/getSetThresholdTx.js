import { parseAccount } from "viem/utils";
import { AccountNotFoundError } from "../../../../account/utils/AccountNotFound.js";
import { getSetOwnableValidatorThresholdAction } from "../../../../constants/index.js";
/**
 * Generates transaction data for setting a new threshold on a smart account.
 *
 * The threshold in a multi-signature wallet determines how many owners need to approve
 * a transaction before it can be executed. This function prepares the transaction data
 * needed to change this threshold, but does not actually send the transaction.
 *
 * @template TSmartAccount - Type of the smart account, extending SmartAccount or undefined.
 * @param client - The client instance used for blockchain interactions.
 * @param parameters - Object containing the account and new threshold value.
 * @returns A Promise resolving to a Call object with the transaction data.
 *
 * @throws {AccountNotFoundError} When no account is provided and the client lacks an associated account.
 * @throws {Error} If the account parsing fails or if there's an issue generating the action data.
 *
 * @example
 * ```typescript
 * const txData = await getSetThresholdTx(client, { threshold: 2 });
 * console.log(txData); // { to: '0x...', value: 0n, data: '0x...' }
 * ```
 */
export async function getSetThresholdTx(client, parameters) {
    const { account: account_ = client.account, threshold } = parameters;
    if (!account_) {
        throw new AccountNotFoundError({
            docsPath: "/nexus-client/methods#sendtransaction"
        });
    }
    const account = parseAccount(account_);
    if (!account)
        throw new Error("Account not found");
    const action = getSetOwnableValidatorThresholdAction({ threshold });
    if (!("callData" in action)) {
        throw new Error("Error getting set threshold actions");
    }
    return {
        to: action.target,
        value: BigInt(action.value.toString()),
        data: action.callData
    };
}
export const toSetThresholdCalls = async (account, parameters) => {
    return [await getSetThresholdTx({}, { ...parameters, account })];
};
//# sourceMappingURL=getSetThresholdTx.js.map