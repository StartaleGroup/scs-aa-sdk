import { getAddress } from "viem/utils";
import { AccountNotFoundError } from "../../../account/utils/AccountNotFound.js";
const SENTINEL_ADDRESS = "0x0000000000000000000000000000000000000001";
/**
 * Gets the address of the previous module of the same type as the given module.
 *
 * @param client - The client instance.
 * @param parameters - Parameters including the smart account and the module to check.
 * @returns The address of the previous module, or the sentinel address if it's the first module.
 * @throws {AccountNotFoundError} If the account is not found.
 * @throws {Error} If the module type is unknown or the module is not found.
 *
 * @example
 * import { getPreviousModule } from '@biconomy/abstractjs'
 *
 * const previousModuleAddress = await getPreviousModule(nexusClient, {
 *   module: {
 *     type: 'validator',
 *     moduleAddress: '0x...',
 *   }
 * })
 * console.log(previousModuleAddress) // '0x...'
 */
export async function getPreviousModule(client, parameters) {
    const { account: account_ = client.account, module } = parameters;
    if (!account_) {
        throw new AccountNotFoundError({
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
    const index = installedModules.indexOf(getAddress(module.address));
    if (index === 0) {
        return SENTINEL_ADDRESS;
    }
    if (index > 0) {
        return installedModules[index - 1];
    }
    throw new Error(`Module ${module.address} not found in installed modules`);
}
//# sourceMappingURL=getPreviousModule.js.map