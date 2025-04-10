import { type Abi, type AbiParameter } from "viem";
import type { AnyData } from "../../modules/utils/Types";
import { type InputParam, type OutputParam } from "./composabilityCalls";
export type FunctionContext = {
    inputs: readonly AbiParameter[];
    outputs: readonly AbiParameter[];
    name: string;
    functionType: "read" | "write";
    functionSig: string;
};
export type RuntimeValue = {
    isRuntime: boolean;
    inputParams: InputParam[];
    outputParams: OutputParam[];
};
export declare const encodeRuntimeFunctionData: (functionContext: FunctionContext, args: Array<AnyData>) => (`0x${string}` | RuntimeValue)[];
export declare const getFunctionContextFromAbi: (functionSig: string, abi: Abi) => FunctionContext;
//# sourceMappingURL=runtimeAbiEncoding.d.ts.map