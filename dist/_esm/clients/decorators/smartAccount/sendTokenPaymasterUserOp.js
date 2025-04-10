import { maxUint256 } from "viem";
import { erc20Abi } from "viem";
import { encodeFunctionData } from "viem";
import { sendUserOperation } from "viem/account-abstraction";
import { getAction } from "viem/utils";
import { BICONOMY_TOKEN_PAYMASTER } from "../../../account/utils/Constants.js";
import { prepareTokenPaymasterUserOp } from "./prepareTokenPaymasterUserOp.js";
/**
 * Prepares and sends a user operation with token paymaster
 *
 * @param client - The Nexus client instance
 * @param args - The parameters for the token paymaster user operation
 * @param args.calls - Array of transactions to be executed
 * @param args.feeTokenAddress - Address of the token to be used for paying gas fees
 * @param args.customApprovalAmount - Optional custom amount to approve for the paymaster (defaults to unlimited)
 *
 * @example
 * ```ts
 * const hash = await sendTokenPaymasterUserOp(client, {
 *   calls: [{
 *     to: "0x...", // Contract address
 *     data: "0x...", // Encoded function data
 *     value: BigInt(0)
 *   }],
 *   feeTokenAddress: "0x...", // USDC/USDT/etc address
 *   customApprovalAmount: BigInt(1000) // Optional: specific approval amount
 * })
 * ```
 *
 * @returns A promise that resolves to the user operation hash {@link Hash}
 */
export async function sendTokenPaymasterUserOp(client, args) {
    const { calls, feeTokenAddress, customApprovalAmount } = args;
    const userOp = await getAction(client, prepareTokenPaymasterUserOp, "prepareTokenPaymasterUserOperation")({
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
        feeTokenAddress,
        customApprovalAmount
    });
    const partialUserOp = {
        ...userOp,
        signature: undefined
    };
    const userOpHash = await getAction(client, sendUserOperation, "sendUserOperation")(partialUserOp);
    return userOpHash;
}
//# sourceMappingURL=sendTokenPaymasterUserOp.js.map