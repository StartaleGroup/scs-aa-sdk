"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.erc7579Reads = exports.erc7579Calls = exports.getPreviousModule = exports.getFallbackBySelector = exports.getActiveHook = exports.getInstalledExecutors = exports.getInstalledValidators = exports.uninstallModules = exports.uninstallModule = exports.supportsModule = exports.supportsExecutionMode = exports.isModuleInstalled = exports.installModules = exports.installModule = exports.accountId = void 0;
exports.erc7579Actions = erc7579Actions;
const accountId_js_1 = require("./accountId.js");
Object.defineProperty(exports, "accountId", { enumerable: true, get: function () { return accountId_js_1.accountId; } });
const getActiveHook_js_1 = require("./getActiveHook.js");
Object.defineProperty(exports, "getActiveHook", { enumerable: true, get: function () { return getActiveHook_js_1.getActiveHook; } });
const getFallbackBySelector_js_1 = require("./getFallbackBySelector.js");
Object.defineProperty(exports, "getFallbackBySelector", { enumerable: true, get: function () { return getFallbackBySelector_js_1.getFallbackBySelector; } });
const getInstalledExecutors_js_1 = require("./getInstalledExecutors.js");
Object.defineProperty(exports, "getInstalledExecutors", { enumerable: true, get: function () { return getInstalledExecutors_js_1.getInstalledExecutors; } });
const getInstalledValidators_js_1 = require("./getInstalledValidators.js");
Object.defineProperty(exports, "getInstalledValidators", { enumerable: true, get: function () { return getInstalledValidators_js_1.getInstalledValidators; } });
const getPreviousModule_js_1 = require("./getPreviousModule.js");
Object.defineProperty(exports, "getPreviousModule", { enumerable: true, get: function () { return getPreviousModule_js_1.getPreviousModule; } });
const installModule_js_1 = require("./installModule.js");
Object.defineProperty(exports, "installModule", { enumerable: true, get: function () { return installModule_js_1.installModule; } });
const installModules_js_1 = require("./installModules.js");
Object.defineProperty(exports, "installModules", { enumerable: true, get: function () { return installModules_js_1.installModules; } });
const isModuleInstalled_js_1 = require("./isModuleInstalled.js");
Object.defineProperty(exports, "isModuleInstalled", { enumerable: true, get: function () { return isModuleInstalled_js_1.isModuleInstalled; } });
const supportsExecutionMode_js_1 = require("./supportsExecutionMode.js");
Object.defineProperty(exports, "supportsExecutionMode", { enumerable: true, get: function () { return supportsExecutionMode_js_1.supportsExecutionMode; } });
const supportsModule_js_1 = require("./supportsModule.js");
Object.defineProperty(exports, "supportsModule", { enumerable: true, get: function () { return supportsModule_js_1.supportsModule; } });
const uninstallFallback_js_1 = require("./uninstallFallback.js");
const uninstallModule_js_1 = require("./uninstallModule.js");
Object.defineProperty(exports, "uninstallModule", { enumerable: true, get: function () { return uninstallModule_js_1.uninstallModule; } });
const uninstallModules_js_1 = require("./uninstallModules.js");
Object.defineProperty(exports, "uninstallModules", { enumerable: true, get: function () { return uninstallModules_js_1.uninstallModules; } });
function erc7579Actions() {
    return (client) => ({
        accountId: (args) => (0, accountId_js_1.accountId)(client, args),
        installModule: (args) => (0, installModule_js_1.installModule)(client, args),
        installModules: (args) => (0, installModules_js_1.installModules)(client, args),
        isModuleInstalled: (args) => (0, isModuleInstalled_js_1.isModuleInstalled)(client, args),
        supportsExecutionMode: (args) => (0, supportsExecutionMode_js_1.supportsExecutionMode)(client, args),
        supportsModule: (args) => (0, supportsModule_js_1.supportsModule)(client, args),
        uninstallModule: (args) => (0, uninstallModule_js_1.uninstallModule)(client, args),
        uninstallModules: (args) => (0, uninstallModules_js_1.uninstallModules)(client, args),
        getInstalledValidators: (args) => (0, getInstalledValidators_js_1.getInstalledValidators)(client, args),
        getInstalledExecutors: (args) => (0, getInstalledExecutors_js_1.getInstalledExecutors)(client, args),
        getActiveHook: (args) => (0, getActiveHook_js_1.getActiveHook)(client, args),
        getFallbackBySelector: (args) => (0, getFallbackBySelector_js_1.getFallbackBySelector)(client, args),
        getPreviousModule: (args) => (0, getPreviousModule_js_1.getPreviousModule)(client, args)
    });
}
exports.erc7579Calls = {
    toInstallModuleCalls: installModule_js_1.toInstallModuleCalls,
    toUninstallModuleCalls: uninstallModule_js_1.toUninstallModuleCalls,
    toInstallWithSafeSenderCalls: installModule_js_1.toInstallWithSafeSenderCalls,
    toSafeSenderCalls: installModule_js_1.toSafeSenderCalls,
    toUninstallFallbackCalls: uninstallFallback_js_1.toUninstallFallbackCalls
};
exports.erc7579Reads = {
    toIsModuleInstalledReads: isModuleInstalled_js_1.toIsModuleInstalledReads,
    toGetActiveHookReads: getActiveHook_js_1.toGetActiveHookReads,
    toGetFallbackBySelectorReads: getFallbackBySelector_js_1.toGetFallbackBySelectorReads,
    toGetInstalledExecutorsReads: getInstalledExecutors_js_1.toGetInstalledExecutorsReads,
    toGetInstalledValidatorsReads: getInstalledValidators_js_1.toGetInstalledValidatorsReads,
    toSupportsExecutionModeReads: supportsExecutionMode_js_1.toSupportsExecutionModeReads,
    toSupportsModuleReads: supportsModule_js_1.toSupportsModuleReads
};
//# sourceMappingURL=index.js.map