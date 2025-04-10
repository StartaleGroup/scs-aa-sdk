import { SMART_SESSIONS_ADDRESS, SmartSessionMode, encodeSmartSessionSignature } from "@rhinestone/module-sdk";
import { prepareUserOperation, sendUserOperation } from "viem/account-abstraction";
import { AccountNotFoundError } from "../../../../account/utils/AccountNotFound.js";
export async function usePermission(nexusClient, parameters) {
    const { account: nexusAccount = nexusClient.account, sessionDetails: sessionDetails_, nonce: nonce_, mode: mode_, ...rest } = parameters;
    const chainId = nexusAccount?.client.chain?.id;
    const publicClient = nexusAccount?.client;
    const signer = nexusAccount?.signer;
    const mode = mode_ === "ENABLE_AND_USE"
        ? SmartSessionMode.UNSAFE_ENABLE
        : SmartSessionMode.USE;
    const sessionDetails = {
        ...sessionDetails_,
        mode
    };
    if (!chainId) {
        throw new Error("Chain ID is not set");
    }
    if (!nexusAccount) {
        throw new AccountNotFoundError({
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
        // @ts-ignore
        (await nexusAccount.getNonce({ moduleAddress: SMART_SESSIONS_ADDRESS }));
    const userOperation = (await prepareUserOperation(nexusClient, {
        ...rest,
        signature: encodeSmartSessionSignature(sessionDetails),
        nonce
    }));
    const userOpHashToSign = nexusAccount.getUserOpHash(userOperation);
    sessionDetails.signature = await signer.signMessage({
        message: { raw: userOpHashToSign }
    });
    userOperation.signature = encodeSmartSessionSignature(sessionDetails);
    return await sendUserOperation(nexusClient, userOperation);
}
//# sourceMappingURL=usePermission.js.map