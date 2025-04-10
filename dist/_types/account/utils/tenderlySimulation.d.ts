import type { RpcUserOperation } from "viem";
import { type UserOperation } from "viem/account-abstraction";
export type AnyUserOperation = Partial<UserOperation<"0.7"> | RpcUserOperation>;
export declare const DUMMY_SIMULATION_GAS: {
    callGasLimit: bigint;
    verificationGasLimit: bigint;
    preVerificationGas: bigint;
    maxFeePerGas: bigint;
    maxPriorityFeePerGas: bigint;
};
export declare const getSimulationUserOp: (partialUserOp: AnyUserOperation) => import("viem/account-abstraction").PackedUserOperation;
export declare function tenderlySimulation(partialUserOp: AnyUserOperation, chainId?: number): string | null;
//# sourceMappingURL=tenderlySimulation.d.ts.map