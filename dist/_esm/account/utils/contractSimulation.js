import { http, createPublicClient, parseEther } from "viem";
import { ENTRY_POINT_ADDRESS, EntrypointAbi } from "../../constants/index.js";
import { getChain } from "./getChain.js";
import { getSimulationUserOp } from "./tenderlySimulation.js";
/**
 * Simulates a user operation through the EntryPoint contract
 *
 * @param partialUserOp - {@link AnyUserOperation} The user operation to simulate
 * @param chainId - The numeric ID of the chain to simulate on
 *
 * @returns Promise resolving to the simulation result from the EntryPoint contract
 *
 * @remarks
 * This function creates a temporary public client and simulates the operation with
 * a state override that ensures the sender has sufficient balance (1000 ETH).
 *
 * @example
 * const userOp = {
 *   sender: "0x123...",
 *   nonce: 0n,
 *   initCode: "0x",
 *   callData: "0x...",
 *   // ... other UserOperation fields
 * };
 *
 * const simulation = await contractSimulation(userOp, 1); // Simulate on mainnet
 * console.log("Simulation successful:", simulation.result);
 */
export async function contractSimulation(partialUserOp, chainId) {
    const packed = getSimulationUserOp(partialUserOp);
    return createPublicClient({
        chain: getChain(chainId),
        transport: http()
    }).simulateContract({
        account: partialUserOp.sender,
        address: ENTRY_POINT_ADDRESS,
        abi: EntrypointAbi,
        functionName: "handleOps",
        args: [[packed], packed.sender],
        stateOverride: [
            {
                address: partialUserOp.sender,
                balance: parseEther("1000")
            }
        ]
    });
}
//# sourceMappingURL=contractSimulation.js.map