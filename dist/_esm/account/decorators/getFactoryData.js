import { encodeAbiParameters, encodeFunctionData, pad, parseAbi, toHex, zeroAddress, zeroHash } from "viem";
import { BootstrapAbi } from "../../constants/abi/BootstrapAbi.js";
import { BOOTSTRAP_ADDRESS, RHINESTONE_INTENT_EXECUTOR_ADDRESS, RHINESTONE_SMART_SESSION_EMISSARY_ADDRESS } from "../../constants/index.js";
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
/**
 * Builds initData for a rhinestone-compatible account using
 * `initWithDefaultValidatorAndOtherModules`. Installs:
 *  - default validator (init data = ownerAddress)
 *  - intent executor (always)
 *  - smart session emissary in validators (only when sessionsEnabled)
 */
export const getInitDataRhinestoneCompatible = (params) => {
    const { ownerAddress, bootStrapAddress = BOOTSTRAP_ADDRESS, sessionsEnabled = false, intentExecutorAddress = RHINESTONE_INTENT_EXECUTOR_ADDRESS, smartSessionEmissaryAddress = RHINESTONE_SMART_SESSION_EMISSARY_ADDRESS } = params;
    const validators = sessionsEnabled
        ? [{ module: smartSessionEmissaryAddress, data: "0x" }]
        : [];
    const executors = [
        { module: intentExecutorAddress, data: "0x" }
    ];
    return getInitData({
        defaultValidator: { module: zeroAddress, data: ownerAddress },
        validators,
        executors,
        hook: { module: zeroAddress, data: zeroHash },
        fallbacks: [],
        registryAddress: zeroAddress,
        bootStrapAddress,
        prevalidationHooks: []
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