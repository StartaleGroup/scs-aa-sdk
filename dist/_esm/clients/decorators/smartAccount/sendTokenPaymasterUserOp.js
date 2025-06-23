import { sendUserOperation } from "viem/account-abstraction";
import { getAction } from "viem/utils";
import { prepareTokenPaymasterUserOp } from "./prepareTokenPaymasterUserOp.js";
/**
 * Prepares and sends a user operation with token paymaster
 *
 * @param client - The Startale client instance
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
        calls,
        // Removed batching approval here as it is part of prepareTokenPaymasterUserOp
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