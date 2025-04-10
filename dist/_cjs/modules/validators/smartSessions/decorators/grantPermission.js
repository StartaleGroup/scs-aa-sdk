"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.grantPermission = grantPermission;
const module_sdk_1 = require("@rhinestone/module-sdk");
const viem_1 = require("viem");
const AccountNotFound_1 = require("../../../../account/utils/AccountNotFound.js");
const Helpers_1 = require("../Helpers.js");
async function grantPermission(nexusClient, parameters) {
    const { account: nexusAccount = nexusClient.account, redeemer, chainId: bigChainId, ...session_ } = parameters;
    const publicClient = nexusAccount?.client;
    const signer = nexusAccount?.signer;
    const chainIdFromAccount = nexusAccount?.client?.chain?.id;
    if (!chainIdFromAccount) {
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
    const session = {
        sessionValidator: module_sdk_1.OWNABLE_VALIDATOR_ADDRESS,
        permitERC4337Paymaster: false,
        sessionValidatorInitData: (0, module_sdk_1.encodeValidationData)({
            threshold: 1,
            owners: [redeemer]
        }),
        salt: (0, Helpers_1.generateSalt)(),
        userOpPolicies: [],
        erc7739Policies: { allowedERC7739Content: [], erc1271Policies: [] },
        chainId: bigChainId ?? BigInt(chainIdFromAccount),
        ...session_
    };
    const nexusAccountForRhinestone = (0, module_sdk_1.getAccount)({
        address: await nexusAccount.getAddress(),
        type: "nexus"
    });
    const sessionDetailsWithPermissionEnableHash = await (0, module_sdk_1.getEnableSessionDetails)({
        enableMode: module_sdk_1.SmartSessionMode.UNSAFE_ENABLE,
        sessions: [session],
        account: nexusAccountForRhinestone,
        clients: [publicClient],
        enableValidatorAddress: viem_1.zeroAddress,
        ignoreSecurityAttestations: true
    });
    const { permissionEnableHash, ...sessionDetails } = sessionDetailsWithPermissionEnableHash;
    if (!sessionDetails.enableSessionData?.enableSession.permissionEnableSig) {
        throw new Error("enableSessionData is undefined");
    }
    sessionDetails.enableSessionData.enableSession.permissionEnableSig =
        await signer.signMessage({ message: { raw: permissionEnableHash } });
    sessionDetails.signature = (0, module_sdk_1.getOwnableValidatorMockSignature)({ threshold: 1 });
    return sessionDetails;
}
//# sourceMappingURL=grantPermission.js.map