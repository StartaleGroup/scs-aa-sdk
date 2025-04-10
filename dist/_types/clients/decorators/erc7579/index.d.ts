import type { Chain, Client, Hash, Hex, Transport } from "viem";
import type { SmartAccount } from "viem/account-abstraction";
import type { Call } from "../../../account";
import type { AnyData, ModuleType } from "../../../modules/utils/Types.js";
import { accountId } from "./accountId.js";
import { type GetActiveHookParameters, getActiveHook } from "./getActiveHook.js";
import { type GetFallbackBySelectorParameters, getFallbackBySelector } from "./getFallbackBySelector.js";
import { type GetInstalledExecutorsParameters, getInstalledExecutors } from "./getInstalledExecutors.js";
import { type GetInstalledValidatorsParameters, getInstalledValidators } from "./getInstalledValidators.js";
import { type GetPreviousModuleParameters, getPreviousModule } from "./getPreviousModule.js";
import { type InstallModuleParameters, installModule } from "./installModule.js";
import { type InstallModulesParameters, installModules } from "./installModules.js";
import { type IsModuleInstalledParameters, isModuleInstalled } from "./isModuleInstalled.js";
import { type SupportsExecutionModeParameters, supportsExecutionMode } from "./supportsExecutionMode.js";
import type { CallType, ExecutionMode } from "./supportsExecutionMode.js";
import { type SupportsModuleParameters, supportsModule } from "./supportsModule.js";
import { type UninstallModuleParameters, uninstallModule } from "./uninstallModule.js";
import { type UninstallModulesParameters, uninstallModules } from "./uninstallModules.js";
export type Erc7579Actions<TSmartAccount extends SmartAccount | undefined> = {
    accountId: (args?: {
        account?: TSmartAccount;
    }) => Promise<string>;
    installModule: (args: InstallModuleParameters<TSmartAccount>) => Promise<Hash>;
    installModules: (args: InstallModulesParameters<TSmartAccount>) => Promise<Hash>;
    isModuleInstalled: (args: IsModuleInstalledParameters<TSmartAccount>) => Promise<boolean>;
    supportsExecutionMode: (args: SupportsExecutionModeParameters<TSmartAccount>) => Promise<boolean>;
    supportsModule: (args: SupportsModuleParameters<TSmartAccount>) => Promise<boolean>;
    uninstallModule: (args: UninstallModuleParameters<TSmartAccount>) => Promise<Hash>;
    uninstallModules: (args: UninstallModulesParameters<TSmartAccount>) => Promise<Hash>;
    getInstalledValidators: (args?: GetInstalledValidatorsParameters<TSmartAccount>) => Promise<readonly [readonly Hex[], Hex]>;
    getInstalledExecutors: (args?: GetInstalledExecutorsParameters<TSmartAccount>) => Promise<readonly [readonly Hex[], Hex]>;
    getActiveHook: (args?: GetActiveHookParameters<TSmartAccount>) => Promise<Hex>;
    getFallbackBySelector: (args: GetFallbackBySelectorParameters<TSmartAccount>) => Promise<[Hex, Hex]>;
    getPreviousModule: (args: GetPreviousModuleParameters<TSmartAccount>) => Promise<Hex>;
};
export type { InstallModuleParameters, IsModuleInstalledParameters, CallType, ExecutionMode, SupportsExecutionModeParameters, ModuleType, SupportsModuleParameters, UninstallModuleParameters, GetInstalledValidatorsParameters, GetInstalledExecutorsParameters, GetActiveHookParameters, GetPreviousModuleParameters };
export { accountId, installModule, installModules, isModuleInstalled, supportsExecutionMode, supportsModule, uninstallModule, uninstallModules, getInstalledValidators, getInstalledExecutors, getActiveHook, getFallbackBySelector, getPreviousModule };
export declare function erc7579Actions(): <TSmartAccount extends SmartAccount | undefined>(client: Client<Transport, Chain | undefined, TSmartAccount>) => Erc7579Actions<TSmartAccount>;
export type CallFn = (...args: AnyData[]) => Promise<Call[]>;
export type ReadFn = (...args: AnyData[]) => Promise<any>;
export type CallDictionary = Record<string, CallFn>;
export type ReadDictionary = Record<string, ReadFn>;
export declare const erc7579Calls: {
    readonly toInstallModuleCalls: (account: import("../../../modules/utils/Types.js").ModularSmartAccount, { address, initData, type }: import("../../../modules/utils/Types.js").ModuleMeta) => Promise<Call[]>;
    readonly toUninstallModuleCalls: (account: import("../../../modules/utils/Types.js").ModularSmartAccount, { address, deInitData, type }: import("../../../modules/utils/Types.js").ModuleMeta) => Promise<Call[]>;
    readonly toInstallWithSafeSenderCalls: (account: import("../../../modules/utils/Types.js").ModularSmartAccount, { address, initData, type }: import("../../../modules/utils/Types.js").ModuleMeta) => Promise<Call[]>;
    readonly toSafeSenderCalls: (__: import("../../../modules/utils/Types.js").ModularSmartAccount, { address }: import("../../../modules/utils/Types.js").ModuleMeta) => Promise<Call[]>;
    readonly toUninstallFallbackCalls: (account: import("../../../modules/utils/Types.js").ModularSmartAccount, { address, initData, type }: import("../../../modules/utils/Types.js").ModuleMeta) => Promise<Call[]>;
};
export declare const erc7579Reads: {
    readonly toIsModuleInstalledReads: (account: import("../../../modules/utils/Types.js").ModularSmartAccount, { address, initData, type }: import("../../../modules/utils/Types.js").ModuleMeta) => Promise<import("viem").ReadContractParameters<readonly [{
        readonly name: "isModuleInstalled";
        readonly type: "function";
        readonly stateMutability: "view";
        readonly inputs: readonly [{
            readonly type: "uint256";
            readonly name: "moduleTypeId";
        }, {
            readonly type: "address";
            readonly name: "module";
        }, {
            readonly type: "bytes";
            readonly name: "additionalContext";
        }];
        readonly outputs: readonly [{
            readonly type: "bool";
        }];
    }], "isModuleInstalled", [bigint, `0x${string}`, Hex]>[]>;
    readonly toGetActiveHookReads: (account: import("../../../modules/utils/Types.js").ModularSmartAccount) => Promise<import("viem").ReadContractParameters<{
        inputs: never[];
        name: string;
        outputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        stateMutability: string;
        type: string;
    }[], "getActiveHook", []>[]>;
    readonly toGetFallbackBySelectorReads: (account: import("../../../modules/utils/Types.js").ModularSmartAccount, selector: Hex) => Promise<import("viem").ReadContractParameters<{
        inputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        name: string;
        outputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        stateMutability: string;
        type: string;
    }[], "getFallbackHandlerBySelector", [Hex]>[]>;
    readonly toGetInstalledExecutorsReads: (account: import("../../../modules/utils/Types.js").ModularSmartAccount, { pageSize, cursor }: GetInstalledExecutorsParameters<import("../../../modules/utils/Types.js").ModularSmartAccount>) => Promise<import("viem").ReadContractParameters<readonly [{
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "cursor";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "size";
            readonly type: "uint256";
        }];
        readonly name: "getExecutorsPaginated";
        readonly outputs: readonly [{
            readonly internalType: "address[]";
            readonly name: "array";
            readonly type: "address[]";
        }, {
            readonly internalType: "address";
            readonly name: "next";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }], "getExecutorsPaginated", [Hex, bigint]>[]>;
    readonly toGetInstalledValidatorsReads: (account: import("../../../modules/utils/Types.js").ModularSmartAccount, { pageSize, cursor }: GetInstalledValidatorsParameters<import("../../../modules/utils/Types.js").ModularSmartAccount>) => Promise<import("viem").ReadContractParameters<readonly [{
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "cursor";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "size";
            readonly type: "uint256";
        }];
        readonly name: "getValidatorsPaginated";
        readonly outputs: readonly [{
            readonly internalType: "address[]";
            readonly name: "array";
            readonly type: "address[]";
        }, {
            readonly internalType: "address";
            readonly name: "next";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }], "getValidatorsPaginated", [Hex, bigint]>[]>;
    readonly toSupportsExecutionModeReads: (account: import("../../../modules/utils/Types.js").ModularSmartAccount, { type, revertOnError, selector, data }: ExecutionMode<CallType>) => Promise<import("viem").ReadContractParameters<readonly [{
        readonly name: "supportsExecutionMode";
        readonly type: "function";
        readonly stateMutability: "view";
        readonly inputs: readonly [{
            readonly type: "bytes32";
            readonly name: "encodedMode";
        }];
        readonly outputs: readonly [{
            readonly type: "bool";
        }];
    }], "supportsExecutionMode", [Hex]>[]>;
    readonly toSupportsModuleReads: <TSmartAccount extends SmartAccount | undefined>(account: import("../../../modules/utils/Types.js").ModularSmartAccount, { type }: SupportsModuleParameters<TSmartAccount>) => Promise<import("viem").ReadContractParameters<readonly [{
        readonly name: "supportsModule";
        readonly type: "function";
        readonly stateMutability: "view";
        readonly inputs: readonly [{
            readonly type: "uint256";
            readonly name: "moduleTypeId";
        }];
        readonly outputs: readonly [{
            readonly type: "bool";
        }];
    }], "supportsModule", [bigint]>[]>;
};
//# sourceMappingURL=index.d.ts.map