"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPreviousModule = getPreviousModule;
const utils_1 = require("viem/utils");
const AccountNotFound_1 = require("../../../account/utils/AccountNotFound.js");
const SENTINEL_ADDRESS = "0x0000000000000000000000000000000000000001";
async function getPreviousModule(client, parameters) {
    const { account: account_ = client.account, module } = parameters;
    if (!account_) {
        throw new AccountNotFound_1.AccountNotFoundError({
            docsPath: "/nexus-client/methods#sendtransaction"
        });
    }
    let installedModules;
    if (module.type === "validator") {
        if (!parameters.installedValidators)
            throw Error("installedValidators parameter is missing");
        installedModules = [...parameters.installedValidators];
    }
    else if (module.type === "executor") {
        if (!parameters.installedExecutors)
            throw Error("installedExecutors parameter is missing");
        installedModules = [...parameters.installedExecutors];
    }
    else {
        throw new Error(`Unknown module type ${module.type}`);
    }
    const index = installedModules.indexOf((0, utils_1.getAddress)(module.address));
    if (index === 0) {
        return SENTINEL_ADDRESS;
    }
    if (index > 0) {
        return installedModules[index - 1];
    }
    throw new Error(`Module ${module.address} not found in installed modules`);
}
//# sourceMappingURL=getPreviousModule.js.map