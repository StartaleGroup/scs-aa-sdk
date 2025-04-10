import { erc20Abi, maxUint256 } from "viem";
import { encodeFunctionData } from "viem";
import { getAction } from "viem/utils";
import { BICONOMY_TOKEN_PAYMASTER } from "../../../account/utils/Constants.js";
import { prepareUserOperationWithoutSignature } from "./prepareUserOperationWithoutSignature.js";
/**
 * Prepares a user operation with token paymaster configuration, including ERC20 token approval
 *
 * This function handles:
 * 1. Checking current token allowance of Smart Account
 * 2. Creating an approval transaction for the token paymaster if needed
 * 3. Preparing the user operation with the approval and user transactions
 *
 * @param client - The NexusClient instance
 * @param args.txs - Array of transactions to be executed
 * @param args.feeTokenAddress - Token used for paying for the gas
 * @param args.customApprovalAmount - Optional custom approval amount
 *
 * @returns A prepared user operation without signature (will be signed by the Smart Account when sent)
 *
 * @example
 * ```typescript
 * const userOp = await prepareTokenPaymasterUserOp(nexusClient, {
 *    txs: [
 *      {
 *        to: recipientAddress,
 *        value: 1n,
 *        data: "0x"
        }
      ],
      customApprovalAmount: usdcFeeAmount
    })
 * ```
 *
 * @throws Will throw an error if client account or paymaster context is not properly configured
 */
export async function prepareTokenPaymasterUserOp(client, args) {
    const { calls, customApprovalAmount, feeTokenAddress } = args;
    const userOp = await getAction(client, prepareUserOperationWithoutSignature, "prepareUserOperation")({
        calls: [
            {
                to: feeTokenAddress,
                data: encodeFunctionData({
                    functionName: "approve",
                    abi: erc20Abi,
                    args: [BICONOMY_TOKEN_PAYMASTER, customApprovalAmount ?? maxUint256]
                }),
                value: BigInt(0)
            },
            ...calls
        ],
        account: client.account
    });
    const partialUserOp = {
        ...userOp,
        signature: undefined
    };
    return partialUserOp;
}
//# sourceMappingURL=prepareTokenPaymasterUserOp.js.map