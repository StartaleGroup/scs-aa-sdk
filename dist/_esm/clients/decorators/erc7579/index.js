import { accountId } from "./accountId.js";
import { getActiveHook, toGetActiveHookReads } from "./getActiveHook.js";
import { getFallbackBySelector, toGetFallbackBySelectorReads } from "./getFallbackBySelector.js";
import { getInstalledExecutors, toGetInstalledExecutorsReads } from "./getInstalledExecutors.js";
import { getInstalledValidators, toGetInstalledValidatorsReads } from "./getInstalledValidators.js";
import { getPreviousModule } from "./getPreviousModule.js";
import { installModule, toInstallModuleCalls, toInstallWithSafeSenderCalls, toSafeSenderCalls } from "./installModule.js";
import { installModules } from "./installModules.js";
import { isModuleInstalled, toIsModuleInstalledReads } from "./isModuleInstalled.js";
import { supportsExecutionMode, toSupportsExecutionModeReads } from "./supportsExecutionMode.js";
import { supportsModule, toSupportsModuleReads } from "./supportsModule.js";
import { toUninstallFallbackCalls } from "./uninstallFallback.js";
import { toUninstallModuleCalls, uninstallModule } from "./uninstallModule.js";
import { uninstallModules } from "./uninstallModules.js";
export { accountId, installModule, installModules, isModuleInstalled, supportsExecutionMode, supportsModule, uninstallModule, uninstallModules, getInstalledValidators, getInstalledExecutors, getActiveHook, getFallbackBySelector, getPreviousModule };
export function erc7579Actions() {
    return (client) => ({
        accountId: (args) => accountId(client, args),
        installModule: (args) => installModule(client, args),
        installModules: (args) => installModules(client, args),
        isModuleInstalled: (args) => isModuleInstalled(client, args),
        supportsExecutionMode: (args) => supportsExecutionMode(client, args),
        supportsModule: (args) => supportsModule(client, args),
        uninstallModule: (args) => uninstallModule(client, args),
        uninstallModules: (args) => uninstallModules(client, args),
        getInstalledValidators: (args) => getInstalledValidators(client, args),
        getInstalledExecutors: (args) => getInstalledExecutors(client, args),
        getActiveHook: (args) => getActiveHook(client, args),
        getFallbackBySelector: (args) => getFallbackBySelector(client, args),
        getPreviousModule: (args) => getPreviousModule(client, args)
    });
}
export const erc7579Calls = {
    toInstallModuleCalls,
    toUninstallModuleCalls,
    toInstallWithSafeSenderCalls,
    toSafeSenderCalls,
    toUninstallFallbackCalls
};
export const erc7579Reads = {
    toIsModuleInstalledReads,
    toGetActiveHookReads,
    toGetFallbackBySelectorReads,
    toGetInstalledExecutorsReads,
    toGetInstalledValidatorsReads,
    toSupportsExecutionModeReads,
    toSupportsModuleReads
};
//# sourceMappingURL=index.js.map