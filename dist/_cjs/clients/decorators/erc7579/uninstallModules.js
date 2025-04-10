"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uninstallModules = uninstallModules;
const account_abstraction_1 = require("viem/account-abstraction");
const utils_1 = require("viem/utils");
const utils_2 = require("viem/utils");
const AccountNotFound_1 = require("../../../account/utils/AccountNotFound.js");
const uninstallModule_1 = require("./uninstallModule.js");
async function uninstallModules(client, parameters) {
    const { account: account_ = client.account, maxFeePerGas, maxPriorityFeePerGas, nonce, modules } = parameters;
    if (!account_) {
        throw new AccountNotFound_1.AccountNotFoundError({
            docsPath: "/nexus-client/methods#sendtransaction"
        });
    }
    const account = (0, utils_2.parseAccount)(account_);
    const calls = (await Promise.all(modules.flatMap((module) => (0, uninstallModule_1.toUninstallModuleCalls)(account, module)))).flat();
    return (0, utils_1.getAction)(client, account_abstraction_1.sendUserOperation, "sendUserOperation")({
        calls,
        maxFeePerGas,
        maxPriorityFeePerGas,
        nonce,
        account
    });
}
//# sourceMappingURL=uninstallModules.js.map