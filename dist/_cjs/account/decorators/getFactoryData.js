"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInitData = exports.getInitDataRhinestoneCompatible = exports.getFactoryData = void 0;
const viem_1 = require("viem");
const BootstrapAbi_1 = require("../../constants/abi/BootstrapAbi.js");
const constants_1 = require("../../constants/index.js");
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
const getInitDataRhinestoneCompatible = (params) => {
    const { ownerAddress, bootStrapAddress = constants_1.BOOTSTRAP_ADDRESS, sessionsEnabled = false, intentExecutorAddress = constants_1.RHINESTONE_INTENT_EXECUTOR_ADDRESS, smartSessionEmissaryAddress = constants_1.RHINESTONE_SMART_SESSION_EMISSARY_ADDRESS } = params;
    const validators = sessionsEnabled
        ? [{ module: smartSessionEmissaryAddress, data: "0x" }]
        : [];
    const executors = [
        { module: intentExecutorAddress, data: "0x" }
    ];
    return (0, exports.getInitData)({
        defaultValidator: { module: viem_1.zeroAddress, data: ownerAddress },
        validators,
        executors,
        hook: { module: viem_1.zeroAddress, data: viem_1.zeroHash },
        fallbacks: [],
        registryAddress: viem_1.zeroAddress,
        bootStrapAddress,
        prevalidationHooks: []
    });
};
exports.getInitDataRhinestoneCompatible = getInitDataRhinestoneCompatible;
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