import type { Chain, Client, Transport } from "viem";
import type { PrepareUserOperationParameters, PrepareUserOperationRequest, PrepareUserOperationReturnType, SmartAccount } from "viem/account-abstraction";
declare const gasFields: readonly ["preVerificationGas", "verificationGasLimit", "callGasLimit", "maxFeePerGas", "maxPriorityFeePerGas", "paymasterVerificationGasLimit", "paymasterPostOpGasLimit"];
type GasBufferFields = (typeof gasFields)[number];
/** Gas buffer configuration. This can be used to apply a gas buffer to the user operation after gas estimates have been returned from the bundler. */
export type GasBufferFactor = {
    gasBuffer?: {
        /** The factor to multiply the gas limit by */
        factor: number;
        /** The fields to apply the gas buffer to */
        fields: GasBufferFields[];
    };
};
export declare function prepareUserOperationWithoutSignature<account extends SmartAccount | undefined, const calls extends readonly unknown[], const request extends PrepareUserOperationRequest<account, accountOverride, calls>, accountOverride extends SmartAccount | undefined = undefined>(client: Client<Transport, Chain | undefined, account>, parameters: GasBufferFactor & PrepareUserOperationParameters<account, accountOverride, calls, request>): Promise<Omit<PrepareUserOperationReturnType<account, accountOverride, calls, request>, "signature">>;
export {};
//# sourceMappingURL=prepareUserOperationWithoutSignature.d.ts.map