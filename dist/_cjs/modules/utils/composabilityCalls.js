"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareComposableParams = exports.isComposableCallRequired = exports.runtimeERC20BalanceOf = exports.equalTo = exports.lessThanOrEqualTo = exports.greaterThanOrEqualTo = exports.prepareConstraint = exports.prepareOutputParam = exports.prepareInputParam = exports.isRuntimeComposableValue = exports.ConstraintType = exports.OutputParamFetcherType = exports.InputParamFetcherType = void 0;
const viem_1 = require("viem");
const runtimeAbiEncoding_1 = require("./runtimeAbiEncoding.js");
exports.InputParamFetcherType = {
    RAW_BYTES: 0,
    STATIC_CALL: 1
};
exports.OutputParamFetcherType = {
    EXEC_RESULT: 0,
    STATIC_CALL: 1
};
exports.ConstraintType = {
    EQ: 0,
    GTE: 1,
    LTE: 2,
    IN: 3
};
const isRuntimeComposableValue = (value) => {
    if (value &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        value.isRuntime) {
        return true;
    }
    return false;
};
exports.isRuntimeComposableValue = isRuntimeComposableValue;
const prepareInputParam = (fetcherType, paramData, constraints = []) => {
    return { fetcherType, paramData, constraints };
};
exports.prepareInputParam = prepareInputParam;
const prepareOutputParam = (fetcherType, paramData) => {
    return { fetcherType, paramData };
};
exports.prepareOutputParam = prepareOutputParam;
const prepareConstraint = (constraintType, referenceData) => {
    return { constraintType, referenceData };
};
exports.prepareConstraint = prepareConstraint;
const greaterThanOrEqualTo = (value) => {
    return { type: exports.ConstraintType.GTE, value };
};
exports.greaterThanOrEqualTo = greaterThanOrEqualTo;
const lessThanOrEqualTo = (value) => {
    return { type: exports.ConstraintType.LTE, value };
};
exports.lessThanOrEqualTo = lessThanOrEqualTo;
const equalTo = (value) => {
    return { type: exports.ConstraintType.EQ, value };
};
exports.equalTo = equalTo;
const runtimeERC20BalanceOf = ({ targetAddress, tokenAddress, constraints = [] }) => {
    const defaultFunctionSig = "balanceOf";
    const encodedParam = (0, viem_1.encodeAbiParameters)([{ type: "address" }, { type: "bytes" }], [
        tokenAddress,
        (0, viem_1.encodeFunctionData)({
            abi: viem_1.erc20Abi,
            functionName: defaultFunctionSig,
            args: [targetAddress]
        })
    ]);
    const constraintsToAdd = [];
    if (constraints.length > 0) {
        for (const constraint of constraints) {
            if (!Object.values(exports.ConstraintType).slice(0, 3).includes(constraint.type)) {
                throw new Error("Invalid contraint type");
            }
            if (typeof constraint.value !== "bigint" ||
                constraint.value < BigInt(0)) {
                throw new Error("Invalid contraint value");
            }
            const valueHex = `0x${constraint.value.toString(16).padStart(64, "0")}`;
            const encodedConstraintValue = (0, viem_1.encodeAbiParameters)([{ type: "bytes32" }], [valueHex]);
            constraintsToAdd.push((0, exports.prepareConstraint)(constraint.type, encodedConstraintValue));
        }
    }
    return {
        isRuntime: true,
        inputParams: [
            (0, exports.prepareInputParam)(exports.InputParamFetcherType.STATIC_CALL, encodedParam, constraintsToAdd)
        ],
        outputParams: []
    };
};
exports.runtimeERC20BalanceOf = runtimeERC20BalanceOf;
const isComposableCallRequired = (functionContext, args) => {
    if (!functionContext.inputs || functionContext.inputs.length <= 0)
        return false;
    const isComposableCall = functionContext.inputs.some((input, inputIndex) => {
        if (input.type === "tuple") {
            const isComposableCallDetected = Object.values(args[inputIndex]).some((internalArg) => (0, exports.isRuntimeComposableValue)(internalArg));
            return isComposableCallDetected;
        }
        if (input.type.match(/^(.*)\[(\d+)?\]$/)) {
            const isComposableCallDetected = args[inputIndex].some((internalArg) => (0, exports.isRuntimeComposableValue)(internalArg));
            return isComposableCallDetected;
        }
        return (0, exports.isRuntimeComposableValue)(args[inputIndex]);
    });
    return isComposableCall;
};
exports.isComposableCallRequired = isComposableCallRequired;
const prepareComposableParams = (functionContext, args) => {
    const composableParams = (0, runtimeAbiEncoding_1.encodeRuntimeFunctionData)(functionContext, args).map((calldata) => {
        if ((0, exports.isRuntimeComposableValue)(calldata)) {
            return calldata?.inputParams;
        }
        return [
            (0, exports.prepareInputParam)(exports.InputParamFetcherType.RAW_BYTES, calldata)
        ];
    });
    return composableParams.flat();
};
exports.prepareComposableParams = prepareComposableParams;
//# sourceMappingURL=composabilityCalls.js.map