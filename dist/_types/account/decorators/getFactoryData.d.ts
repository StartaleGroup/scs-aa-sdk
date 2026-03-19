import { type Address, type Hex } from "viem";
import type { GenericModuleConfig, PrevalidationHookModuleConfig } from "../toStartaleSmartAccount";
export type GetFactoryDataParams = {
    /** Hex string of the validator init data */
    initData: Hex;
    /** Account index for deterministic deployment */
    index: bigint;
};
export declare const getFactoryData: ({ initData, index }: GetFactoryDataParams) => Hex;
export type ModuleConfig = {
    module: Address;
    data: Hex;
};
export type GetInitDataParams = {
    defaultValidator: GenericModuleConfig;
    prevalidationHooks: PrevalidationHookModuleConfig[];
    validators: GenericModuleConfig[];
    executors: GenericModuleConfig[];
    hook: GenericModuleConfig;
    fallbacks: GenericModuleConfig[];
    registryAddress: Address;
    bootStrapAddress: Address;
};
export type GetInitDataRhinestoneCompatibleParams = {
    /** The signer/owner address — used as default validator init data */
    ownerAddress: Address;
    /** Bootstrap address (defaults to BOOTSTRAP_ADDRESS constant) */
    bootStrapAddress?: Address;
    /** Whether to include the smart session emissary as an additional validator */
    sessionsEnabled?: boolean;
    /** Override intent executor address */
    intentExecutorAddress?: Address;
    /** Override smart session emissary address */
    smartSessionEmissaryAddress?: Address;
};
/**
 * Builds initData for a rhinestone-compatible account using
 * `initWithDefaultValidatorAndOtherModules`. Installs:
 *  - default validator (init data = ownerAddress)
 *  - intent executor (always)
 *  - smart session emissary in validators (only when sessionsEnabled)
 */
export declare const getInitDataRhinestoneCompatible: (params: GetInitDataRhinestoneCompatibleParams) => Hex;
export declare const getInitData: (params: GetInitDataParams) => Hex;
//# sourceMappingURL=getFactoryData.d.ts.map