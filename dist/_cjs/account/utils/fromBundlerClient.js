"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromBundlerClientToSigner = exports.fromBundlerClientToChainId = exports.fromBundlerClientToChain = exports.fromBundlerClientToNexusAccount = exports.fromBundlerClientToPublicClient = void 0;
const fromBundlerClientToPublicClient = (bundlerClient) => {
    const nexusAccount = (0, exports.fromBundlerClientToNexusAccount)(bundlerClient);
    if (!nexusAccount.client) {
        throw new Error("Public client not found");
    }
    return nexusAccount.client;
};
exports.fromBundlerClientToPublicClient = fromBundlerClientToPublicClient;
const fromBundlerClientToNexusAccount = (bundlerClient) => {
    const startaleAccount = bundlerClient.account;
    if (!startaleAccount.type || startaleAccount.type !== "smart") {
        throw new Error("Startale account not found");
    }
    return bundlerClient.account;
};
exports.fromBundlerClientToNexusAccount = fromBundlerClientToNexusAccount;
const fromBundlerClientToChain = (bundlerClient) => {
    const nexusAccount = (0, exports.fromBundlerClientToNexusAccount)(bundlerClient);
    const chain = nexusAccount.chain;
    if (!chain.id) {
        throw new Error("Chain not found");
    }
    return chain;
};
exports.fromBundlerClientToChain = fromBundlerClientToChain;
const fromBundlerClientToChainId = (bundlerClient) => {
    const chain = (0, exports.fromBundlerClientToChain)(bundlerClient);
    if (!chain.id) {
        throw new Error("Chain ID not found");
    }
    return chain.id;
};
exports.fromBundlerClientToChainId = fromBundlerClientToChainId;
const fromBundlerClientToSigner = (bundlerClient) => {
    const nexusAccount = (0, exports.fromBundlerClientToNexusAccount)(bundlerClient);
    if (!nexusAccount.signer || !nexusAccount.signer.address) {
        throw new Error("Signer not found");
    }
    return nexusAccount.signer;
};
exports.fromBundlerClientToSigner = fromBundlerClientToSigner;
//# sourceMappingURL=fromBundlerClient.js.map