"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debugUserOperation = debugUserOperation;
const account_abstraction_1 = require("viem/account-abstraction");
const accounts_1 = require("viem/accounts");
const AccountNotFound_1 = require("../../../account/utils/AccountNotFound.js");
const Utils_1 = require("../../../account/utils/Utils.js");
const deepHexlify_1 = require("../../../account/utils/deepHexlify.js");
const getAAError_1 = require("../../../account/utils/getAAError.js");
const tenderlySimulation_1 = require("../../../account/utils/tenderlySimulation.js");
async function debugUserOperation(client, parameters) {
    const chainId = Number(client.account?.client?.chain?.id?.toString() ?? 84532);
    try {
        const { account: account_ = client.account, entryPointAddress } = parameters;
        if (!account_ && !parameters.sender)
            throw new AccountNotFound_1.AccountNotFoundError();
        const account = account_ ? (0, accounts_1.parseAccount)(account_) : undefined;
        const callData = await account?.encodeCalls(parameters?.calls);
        const sender = await account?.getAddress();
        const nonce = await account?.getNonce();
        const factoryArgs = await account?.getFactoryArgs();
        const request = {
            sender,
            callData,
            nonce,
            ...factoryArgs,
            ...parameters,
            ...tenderlySimulation_1.DUMMY_SIMULATION_GAS
        };
        const signature = (parameters.signature ||
            (await account?.signUserOperation(request)));
        const userOpWithSignature = { ...request, signature };
        const packed = (0, account_abstraction_1.toPackedUserOperation)(userOpWithSignature);
        console.log("Packed userOp:\n", JSON.stringify([(0, deepHexlify_1.deepHexlify)(packed)], null, 2));
        const rpcParameters = (0, account_abstraction_1.formatUserOperationRequest)(userOpWithSignature);
        console.log("Bundler userOp:", rpcParameters);
        const tenderlyUrl = (0, tenderlySimulation_1.tenderlySimulation)(rpcParameters, chainId);
        console.log({ tenderlyUrl });
        try {
            const hash = await client.request({
                method: "eth_sendUserOperation",
                params: [
                    rpcParameters,
                    (entryPointAddress ?? account?.entryPoint.address)
                ]
            }, { retryCount: 0 });
            console.log("User Operation Hash:", hash);
            return hash;
        }
        catch (error) {
            if (error?.details) {
                const aaError = await (0, getAAError_1.getAAError)(error?.details);
                console.log({ aaError });
            }
            const calls = parameters.calls;
            throw (0, account_abstraction_1.getUserOperationError)(error, {
                ...request,
                ...(calls ? { calls } : {}),
                signature
            });
        }
    }
    catch (error) {
        if (error.metaMessages) {
            try {
                const messageJson = (0, Utils_1.parseRequestArguments)(error.metaMessages);
                const tenderlyUrl = (0, tenderlySimulation_1.tenderlySimulation)(messageJson);
                console.log({ tenderlyUrl });
            }
            catch (error) { }
        }
        throw error;
    }
}
//# sourceMappingURL=debugUserOperation.js.map