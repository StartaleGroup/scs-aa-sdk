"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInitData = exports.getFactoryData = void 0;
const viem_1 = require("viem");
const BootstrapAbi_1 = require("../../constants/abi/BootstrapAbi.js");
const getFactoryData = ({ initData, index }) => {
    const salt = (0, viem_1.pad)((0, viem_1.toHex)(index), { size: 32 });
    return (0, viem_1.encodeFunctionData)({
        abi: (0, viem_1.parseAbi)([
            "function createAccount(bytes initData, bytes32 salt) external returns (address)"
        ]),
        functionName: "createAccount",
        args: [initData, salt]
    });
};
exports.getFactoryData = getFactoryData;
const getInitData = (params) => (0, viem_1.encodeAbiParameters)([
    { name: "bootstrap", type: "address" },
    { name: "initData", type: "bytes" }
], [
    params.bootStrapAddress,
    (0, viem_1.encodeFunctionData)({
        abi: BootstrapAbi_1.BootstrapAbi,
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
exports.getInitData = getInitData;
//# sourceMappingURL=getFactoryData.js.map