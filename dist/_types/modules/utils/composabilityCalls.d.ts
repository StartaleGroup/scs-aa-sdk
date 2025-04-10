import { type Address } from "viem";
import type { AnyData } from "../../modules/utils/Types";
import { type FunctionContext, type RuntimeValue } from "./runtimeAbiEncoding";
export type InputParam = {
    fetcherType: InputParamFetcherType;
    paramData: string;
    constraints: Constraint[];
};
export type OutputParam = {
    fetcherType: OutputParamFetcherType;
    paramData: string;
};
export declare const InputParamFetcherType: {
    readonly RAW_BYTES: 0;
    readonly STATIC_CALL: 1;
};
export declare const OutputParamFetcherType: {
    readonly EXEC_RESULT: 0;
    readonly STATIC_CALL: 1;
};
export declare const ConstraintType: {
    readonly EQ: 0;
    readonly GTE: 1;
    readonly LTE: 2;
    readonly IN: 3;
};
export type InputParamFetcherType = (typeof InputParamFetcherType)[keyof typeof InputParamFetcherType];
export type OutputParamFetcherType = (typeof OutputParamFetcherType)[keyof typeof OutputParamFetcherType];
export type ConstraintType = (typeof ConstraintType)[keyof typeof ConstraintType];
export type Constraint = {
    constraintType: ConstraintType;
    referenceData: string;
};
export type BaseComposableCall = {
    to: Address;
    value: bigint;
    functionSig: string;
    inputParams: InputParam[];
    outputParams: OutputParam[];
};
export type ComposableCall = BaseComposableCall & {
    gasLimit?: bigint;
};
export type ConstraintField = {
    type: ConstraintType;
    value: AnyData;
};
export type RuntimeERC20BalanceOfParams = {
    targetAddress: Address;
    tokenAddress: Address;
    constraints?: ConstraintField[];
};
export declare const isRuntimeComposableValue: (value: AnyData) => boolean;
export declare const prepareInputParam: (fetcherType: InputParamFetcherType, paramData: string, constraints?: Constraint[]) => InputParam;
export declare const prepareOutputParam: (fetcherType: OutputParamFetcherType, paramData: string) => OutputParam;
export declare const prepareConstraint: (constraintType: ConstraintType, referenceData: string) => Constraint;
export declare const greaterThanOrEqualTo: (value: AnyData) => ConstraintField;
export declare const lessThanOrEqualTo: (value: AnyData) => ConstraintField;
export declare const equalTo: (value: AnyData) => ConstraintField;
export declare const runtimeERC20BalanceOf: ({ targetAddress, tokenAddress, constraints }: RuntimeERC20BalanceOfParams) => RuntimeValue;
export declare const isComposableCallRequired: (functionContext: FunctionContext, args: Array<AnyData>) => boolean;
export declare const prepareComposableParams: (functionContext: FunctionContext, args: Array<AnyData>) => InputParam[];
//# sourceMappingURL=composabilityCalls.d.ts.map