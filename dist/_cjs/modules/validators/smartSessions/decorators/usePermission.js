"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePermission = usePermission;
const module_sdk_1 = require("@rhinestone/module-sdk");
const account_abstraction_1 = require("viem/account-abstraction");
const AccountNotFound_1 = require("../../../../account/utils/AccountNotFound.js");
async function usePermission(nexusClient, parameters) {
    const { account: nexusAccount = nexusClient.account, sessionDetails: sessionDetails_, nonce: nonce_, mode: mode_, ...rest } = parameters;
    const chainId = nexusAccount?.client.chain?.id;
    const publicClient = nexusAccount?.client;
    const signer = nexusAccount?.signer;
    const mode = mode_ === "ENABLE_AND_USE"
        ? module_sdk_1.SmartSessionMode.UNSAFE_ENABLE
        : module_sdk_1.SmartSessionMode.USE;
    const sessionDetails = {
        ...sessionDetails_,
        mode
    };
    if (!chainId) {
        throw new Error("Chain ID is not set");
    }
    if (!nexusAccount) {
        throw new AccountNotFound_1.AccountNotFoundError({
            docsPath: "/nexus-client/methods#sendtransaction"
        });
    }
    if (!publicClient) {
        throw new Error("Public client is not set");
    }
    if (!signer) {
        throw new Error("Signer is not set");
    }
    if (!sessionDetails.enableSessionData) {
        throw new Error("Session data is not set");
    }
    const nonce = nonce_ ??
        (await nexusAccount.getNonce({ moduleAddress: module_sdk_1.SMART_SESSIONS_ADDRESS }));
    const userOperation = (await (0, account_abstraction_1.prepareUserOperation)(nexusClient, {
        ...rest,
        signature: (0, module_sdk_1.encodeSmartSessionSignature)(sessionDetails),
        nonce
    }));
    const userOpHashToSign = nexusAccount.getUserOpHash(userOperation);
    sessionDetails.signature = await signer.signMessage({
        message: { raw: userOpHashToSign }
    });
    userOperation.signature = (0, module_sdk_1.encodeSmartSessionSignature)(sessionDetails);
    return await (0, account_abstraction_1.sendUserOperation)(nexusClient, userOperation);
}
//# sourceMappingURL=usePermission.js.map