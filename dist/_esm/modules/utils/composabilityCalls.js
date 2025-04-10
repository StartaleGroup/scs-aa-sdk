import { encodeAbiParameters, encodeFunctionData, erc20Abi } from "viem";
import { encodeRuntimeFunctionData } from "./runtimeAbiEncoding.js";
export const InputParamFetcherType = {
    RAW_BYTES: 0,
    STATIC_CALL: 1
};
export const OutputParamFetcherType = {
    EXEC_RESULT: 0,
    STATIC_CALL: 1
};
export const ConstraintType = {
    EQ: 0,
    GTE: 1,
    LTE: 2,
    IN: 3
};
// Detects whether the value is runtime injected value or not
export const isRuntimeComposableValue = (value) => {
    if (value &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        value.isRuntime) {
        return true;
    }
    return false;
};
export const prepareInputParam = (fetcherType, paramData, constraints = []) => {
    return { fetcherType, paramData, constraints };
};
export const prepareOutputParam = (fetcherType, paramData) => {
    return { fetcherType, paramData };
};
export const prepareConstraint = (constraintType, referenceData) => {
    return { constraintType, referenceData };
};
// type any is being implicitly used. The appropriate value validation happens in the runtime function
export const greaterThanOrEqualTo = (value) => {
    return { type: ConstraintType.GTE, value };
};
// type any is being implicitly used. The appropriate value validation happens in the runtime function
export const lessThanOrEqualTo = (value) => {
    return { type: ConstraintType.LTE, value };
};
// type any is being implicitly used. The appropriate value validation happens in the runtime function
export const equalTo = (value) => {
    return { type: ConstraintType.EQ, value };
};
export const runtimeERC20BalanceOf = ({ targetAddress, tokenAddress, constraints = [] }) => {
    const defaultFunctionSig = "balanceOf";
    const encodedParam = encodeAbiParameters([{ type: "address" }, { type: "bytes" }], [
        tokenAddress,
        encodeFunctionData({
            abi: erc20Abi,
            functionName: defaultFunctionSig,
            args: [targetAddress]
        })
    ]);
    const constraintsToAdd = [];
    if (constraints.length > 0) {
        for (const constraint of constraints) {
            // Contraint type IN is ignored for the runtimeBalanceOf
            // This is mostly a number/unit/int, so it makes sense to only have EQ, GTE, LTE
            if (!Object.values(ConstraintType).slice(0, 3).includes(constraint.type)) {
                throw new Error("Invalid contraint type");
            }
            // Handle value validation in a appropriate to runtime function
            if (typeof constraint.value !== "bigint" ||
                constraint.value < BigInt(0)) {
                throw new Error("Invalid contraint value");
            }
            const valueHex = `0x${constraint.value.toString(16).padStart(64, "0")}`;
            const encodedConstraintValue = encodeAbiParameters([{ type: "bytes32" }], [valueHex]);
            constraintsToAdd.push(prepareConstraint(constraint.type, encodedConstraintValue));
        }
    }
    return {
        isRuntime: true,
        inputParams: [
            prepareInputParam(InputParamFetcherType.STATIC_CALL, encodedParam, constraintsToAdd)
        ],
        outputParams: []
    };
};
export const isComposableCallRequired = (functionContext, args) => {
    if (!functionContext.inputs || functionContext.inputs.length <= 0)
        return false;
    const isComposableCall = functionContext.inputs.some((input, inputIndex) => {
        // Only struct and arrays has child elements and require iterating them internally.
        // String and bytes are also dynamic but they are mostly treated as one single value for detection
        if (input.type === "tuple") {
            // Struct arguments are handled here
            // Composable call detection
            const isComposableCallDetected = Object.values(args[inputIndex]).some((internalArg) => isRuntimeComposableValue(internalArg));
            return isComposableCallDetected;
        }
        if (input.type.match(/^(.*)\[(\d+)?\]$/)) {
            // matches against both static and dynamic arrays.
            // Array arguments are handled here
            // Composable call detection
            const isComposableCallDetected = args[inputIndex].some((internalArg) => isRuntimeComposableValue(internalArg));
            return isComposableCallDetected;
        }
        // Below mentioned common values are handled here.
        // intX, uintX, bytesX, bytes, string, bool, address are direct values and doesn't need iteration on child elements.
        // Composable call detection
        return isRuntimeComposableValue(args[inputIndex]);
    });
    return isComposableCall;
};
export const prepareComposableParams = (functionContext, args) => {
    const composableParams = encodeRuntimeFunctionData(functionContext, args).map((calldata) => {
        if (isRuntimeComposableValue(calldata)) {
            // Just handling input params here. In future, we may need to add support for output params as well
            return calldata?.inputParams;
        }
        // These are non runtime values which are encoded by the encodeRuntimeFunctionData helper.
        // These params are injected are individual raw bytes which will be combined on the composable contract
        return [
            prepareInputParam(InputParamFetcherType.RAW_BYTES, calldata)
        ];
    });
    // Head Params,Head Params,Head Params + (len + Tail Params),(len + Tail Params),(len + Tail Params)
    // Static type doesn't have tail
    // Dynamic types have tail params where the head only have offset which points the dynamic param in tail
    return composableParams.flat();
};
//# sourceMappingURL=composabilityCalls.js.map