"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFunctionContextFromAbi = exports.encodeRuntimeFunctionData = void 0;
const viem_1 = require("viem");
const composabilityCalls_1 = require("./composabilityCalls.js");
const integerRegex = /^(u?int)(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/;
const encodeString = (value) => {
    const hexValue = (0, viem_1.stringToHex)(value);
    const partsLength = Math.ceil((0, viem_1.size)(hexValue) / 32);
    const parts = [];
    for (let i = 0; i < partsLength; i++) {
        parts.push((0, viem_1.padHex)((0, viem_1.slice)(hexValue, i * 32, (i + 1) * 32), {
            dir: "right"
        }));
    }
    return {
        dynamic: true,
        data: [
            (0, viem_1.concat)([(0, viem_1.padHex)((0, viem_1.numberToHex)((0, viem_1.size)(hexValue), { size: 32 })), ...parts])
        ]
    };
};
const encodeBytes = (value, { param }) => {
    const [, paramSize] = param.type.split("bytes");
    if ((0, composabilityCalls_1.isRuntimeComposableValue)(value)) {
        if (paramSize) {
            return { dynamic: false, data: [value] };
        }
        return { dynamic: true, data: [value] };
    }
    const bytesSize = (0, viem_1.size)(value);
    if (!paramSize) {
        let value_ = value;
        if (bytesSize % 32 !== 0)
            value_ = (0, viem_1.padHex)(value_, {
                dir: "right",
                size: Math.ceil((value.length - 2) / 2 / 32) * 32
            });
        return {
            dynamic: true,
            data: [(0, viem_1.padHex)((0, viem_1.numberToHex)(bytesSize, { size: 32 })), value_]
        };
    }
    if (bytesSize !== Number.parseInt(paramSize))
        throw new viem_1.AbiEncodingBytesSizeMismatchError({
            expectedSize: Number.parseInt(paramSize),
            value: value
        });
    return { dynamic: false, data: [(0, viem_1.padHex)(value, { dir: "right" })] };
};
const encodeNumber = (value, { signed, size = 256 }) => {
    if (typeof size === "number") {
        const max = BigInt(2) ** (BigInt(size) - (signed ? BigInt(1) : BigInt(0))) - BigInt(1);
        const min = signed ? -max - BigInt(1) : BigInt(0);
        if (value > max || value < min)
            throw new viem_1.IntegerOutOfRangeError({
                max: max.toString(),
                min: min.toString(),
                signed,
                size: size / 8,
                value: value.toString()
            });
    }
    return {
        dynamic: false,
        data: [
            (0, viem_1.numberToHex)(value, {
                size: 32,
                signed
            })
        ]
    };
};
const encodeBool = (value) => {
    if (typeof value !== "boolean")
        throw new viem_1.BaseError(`Invalid boolean value: "${value}" (type: ${typeof value}). Expected: \`true\` or \`false\`.`);
    return { dynamic: false, data: [(0, viem_1.padHex)((0, viem_1.boolToHex)(value))] };
};
const encodeAddress = (value) => {
    if (!(0, viem_1.isAddress)(value))
        throw new viem_1.InvalidAddressError({ address: value });
    return { dynamic: false, data: [(0, viem_1.padHex)(value.toLowerCase())] };
};
const encodeArray = (value, { length, param }) => {
    const dynamic = length === null;
    if (!Array.isArray(value))
        throw new viem_1.InvalidArrayError(value);
    if (!dynamic && value.length !== length)
        throw new viem_1.AbiEncodingArrayLengthMismatchError({
            expectedLength: length,
            givenLength: value.length,
            type: `${param.type}[${length}]`
        });
    let dynamicChild = false;
    const preparedParams = [];
    for (let i = 0; i < value.length; i++) {
        const preparedParam = prepareParam({ param, value: value[i] });
        if (preparedParam.dynamic)
            dynamicChild = true;
        preparedParams.push(preparedParam);
    }
    if (dynamic || dynamicChild) {
        const data = encodeParams(preparedParams);
        if (dynamic) {
            const length = (0, viem_1.numberToHex)(preparedParams.length, { size: 32 });
            return {
                dynamic: true,
                data: preparedParams.length > 0 ? [length, ...data] : [length]
            };
        }
        if (dynamicChild)
            return { dynamic: true, data: data };
    }
    const data = preparedParams.flatMap(({ data }) => data);
    return {
        dynamic: false,
        data: data
    };
};
const encodeTuple = (value, { param }) => {
    let dynamic = false;
    const preparedParams = [];
    for (let i = 0; i < param.components.length; i++) {
        const param_ = param.components[i];
        const index = Array.isArray(value) ? i : param_.name;
        const preparedParam = prepareParam({
            param: param_,
            value: value[index]
        });
        preparedParams.push(preparedParam);
        if (preparedParam.dynamic)
            dynamic = true;
    }
    return {
        dynamic,
        data: dynamic
            ? encodeParams(preparedParams)
            : preparedParams.flatMap(({ data }) => data)
    };
};
const getArrayComponents = (type) => {
    const matches = type.match(/^(.*)\[(\d+)?\]$/);
    return matches
        ?
            [matches[2] ? Number(matches[2]) : null, matches[1]]
        : undefined;
};
const encodeParams = (preparedParams) => {
    let staticSize = 0;
    for (let i = 0; i < preparedParams.length; i++) {
        const { dynamic, data } = preparedParams[i];
        if (dynamic) {
            staticSize += 32;
        }
        else {
            const len = data.reduce((acc, val) => {
                if ((0, composabilityCalls_1.isRuntimeComposableValue)(val)) {
                    return acc + 32;
                }
                return acc + (0, viem_1.size)(val);
            }, 0);
            staticSize += len;
        }
    }
    const staticParams = [];
    const dynamicParams = [];
    let dynamicSize = 0;
    for (let i = 0; i < preparedParams.length; i++) {
        const { dynamic, data } = preparedParams[i];
        if (dynamic) {
            staticParams.push((0, viem_1.numberToHex)(staticSize + dynamicSize, { size: 32 }));
            dynamicParams.push(...data);
            const len = data.reduce((acc, val) => {
                if ((0, composabilityCalls_1.isRuntimeComposableValue)(val)) {
                    return acc + 32;
                }
                return acc + (0, viem_1.size)(val);
            }, 0);
            dynamicSize += len;
        }
        else {
            staticParams.push(...data);
        }
    }
    return [...staticParams, ...dynamicParams];
};
const prepareParams = ({ params, values }) => {
    const preparedParams = [];
    for (let i = 0; i < params.length; i++) {
        preparedParams.push(prepareParam({ param: params[i], value: values[i] }));
    }
    return preparedParams;
};
const prepareParam = ({ param, value }) => {
    const runtimeValue = { dynamic: false, data: [value] };
    const arrayComponents = getArrayComponents(param.type);
    if (arrayComponents) {
        const [length, type] = arrayComponents;
        return encodeArray(value, { length, param: { ...param, type } });
    }
    if (param.type === "address") {
        if ((0, composabilityCalls_1.isRuntimeComposableValue)(value))
            return runtimeValue;
        return encodeAddress(value);
    }
    if (param.type === "bool") {
        if ((0, composabilityCalls_1.isRuntimeComposableValue)(value))
            return runtimeValue;
        return encodeBool(value);
    }
    if (param.type.startsWith("uint") || param.type.startsWith("int")) {
        if ((0, composabilityCalls_1.isRuntimeComposableValue)(value))
            return runtimeValue;
        const signed = param.type.startsWith("int");
        const [, , size = "256"] = integerRegex.exec(param.type) ?? [];
        return encodeNumber(value, {
            signed,
            size: Number(size)
        });
    }
    if (param.type.startsWith("bytes")) {
        return encodeBytes(value, { param });
    }
    if (param.type === "string") {
        if ((0, composabilityCalls_1.isRuntimeComposableValue)(value))
            return runtimeValue;
        return encodeString(value);
    }
    if (param.type === "tuple") {
        return encodeTuple(value, {
            param: param
        });
    }
    throw new viem_1.InvalidAbiEncodingTypeError(param.type, {
        docsPath: "/docs/contract/encodeAbiParameters"
    });
};
const encodeRuntimeFunctionData = (functionContext, args) => {
    if (!functionContext.inputs || functionContext.inputs.length === 0) {
        return ["0x"];
    }
    if (functionContext.inputs.length !== args.length) {
        throw new viem_1.AbiEncodingLengthMismatchError({
            expectedLength: functionContext?.inputs?.length,
            givenLength: args.length
        });
    }
    const preparedParams = prepareParams({
        params: functionContext.inputs,
        values: args
    });
    const data = encodeParams(preparedParams);
    if (data.length === 0)
        return ["0x"];
    return data;
};
exports.encodeRuntimeFunctionData = encodeRuntimeFunctionData;
const getFunctionContextFromAbi = (functionSig, abi) => {
    if (abi.length === 0) {
        throw new Error("Invalid ABI");
    }
    const [functionInfo] = abi.filter((item) => item.type === "function" && item.name === functionSig);
    if (!functionInfo) {
        throw new Error(`${functionSig} not found on the ABI`);
    }
    const { inputs, name, outputs, stateMutability } = functionInfo;
    return {
        inputs,
        name,
        outputs,
        functionType: ["view", "pure"].includes(stateMutability) ? "read" : "write",
        functionSig: (0, viem_1.toFunctionSelector)(functionInfo)
    };
};
exports.getFunctionContextFromAbi = getFunctionContextFromAbi;
//# sourceMappingURL=runtimeAbiEncoding.js.map