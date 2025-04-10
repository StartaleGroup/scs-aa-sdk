import { encodeAbiParameters, encodeFunctionData, pad, parseAbi, toHex } from "viem";
import { BootstrapAbi } from "../../constants/abi/BootstrapAbi.js";
export const getFactoryData = ({ initData, index }) => {
    const salt = pad(toHex(index), { size: 32 });
    return encodeFunctionData({
        abi: parseAbi([
            "function createAccount(bytes initData, bytes32 salt) external returns (address)"
        ]),
        functionName: "createAccount",
        args: [initData, salt]
    });
};
export const getInitData = (params) => encodeAbiParameters([
    { name: "bootstrap", type: "address" },
    { name: "initData", type: "bytes" }
], [
    params.bootStrapAddress,
    encodeFunctionData({
        abi: BootstrapAbi,
        functionName: "initWithDefaultValidatorAndOtherModules",
        args: [
            params.defaultValidator.data,
            params.validators,
            params.executors,
            params.hook,
            params.fallbacks,
            params.prevalidationHooks
        ]
    })
]);
//# sourceMappingURL=getFactoryData.js.map