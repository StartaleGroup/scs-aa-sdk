import { OWNABLE_VALIDATOR_ADDRESS, SmartSessionMode, encodeValidationData, getAccount, getEnableSessionDetails, getOwnableValidatorMockSignature } from "@rhinestone/module-sdk";
import { zeroAddress } from "viem";
import { AccountNotFoundError } from "../../../../account/utils/AccountNotFound.js";
import { generateSalt } from "../Helpers.js";
export async function grantPermission(nexusClient, parameters) {
    const { account: nexusAccount = nexusClient.account, redeemer, chainId: bigChainId, ...session_ } = parameters;
    const publicClient = nexusAccount?.client;
    const signer = nexusAccount?.signer;
    const chainIdFromAccount = nexusAccount?.client?.chain?.id;
    if (!chainIdFromAccount) {
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
    const session = {
        sessionValidator: OWNABLE_VALIDATOR_ADDRESS,
        permitERC4337Paymaster: false,
        sessionValidatorInitData: encodeValidationData({
            threshold: 1,
            owners: [redeemer]
        }),
        salt: generateSalt(),
        userOpPolicies: [],
        erc7739Policies: { allowedERC7739Content: [], erc1271Policies: [] },
        chainId: bigChainId ?? BigInt(chainIdFromAccount),
        ...session_
    };
    const nexusAccountForRhinestone = getAccount({
        address: await nexusAccount.getAddress(),
        type: "nexus"
    });
    const sessionDetailsWithPermissionEnableHash = await getEnableSessionDetails({
        enableMode: SmartSessionMode.UNSAFE_ENABLE,
        sessions: [session],
        account: nexusAccountForRhinestone,
        clients: [publicClient],
        enableValidatorAddress: zeroAddress, // default validator
        ignoreSecurityAttestations: true
    });
    const { permissionEnableHash, ...sessionDetails } = sessionDetailsWithPermissionEnableHash;
    if (!sessionDetails.enableSessionData?.enableSession.permissionEnableSig) {
        throw new Error("enableSessionData is undefined");
    }
    sessionDetails.enableSessionData.enableSession.permissionEnableSig =
        await signer.signMessage({ message: { raw: permissionEnableHash } });
    sessionDetails.signature = getOwnableValidatorMockSignature({ threshold: 1 });
    return sessionDetails;
}
//# sourceMappingURL=grantPermission.js.map