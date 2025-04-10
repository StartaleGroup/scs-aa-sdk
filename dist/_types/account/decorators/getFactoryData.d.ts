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
export declare const getInitData: (params: GetInitDataParams) => Hex;
//# sourceMappingURL=getFactoryData.d.ts.map