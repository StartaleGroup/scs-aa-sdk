"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromBundlerClientToSigner = exports.fromBundlerClientToChainId = exports.fromBundlerClientToChain = exports.fromBundlerClientToStartaleAccount = exports.fromBundlerClientToPublicClient = void 0;
const fromBundlerClientToPublicClient = (bundlerClient) => {
    const startaleAccount = (0, exports.fromBundlerClientToStartaleAccount)(bundlerClient);
    if (!startaleAccount.client) {
        throw new Error("Public client not found");
    }
    return startaleAccount.client;
};
exports.fromBundlerClientToPublicClient = fromBundlerClientToPublicClient;
const fromBundlerClientToStartaleAccount = (bundlerClient) => {
    const startaleAccount = bundlerClient.account;
    if (!startaleAccount.type || startaleAccount.type !== "smart") {
        throw new Error("Startale account not found");
    }
    return bundlerClient.account;
};
exports.fromBundlerClientToStartaleAccount = fromBundlerClientToStartaleAccount;
const fromBundlerClientToChain = (bundlerClient) => {
    const startaleAccount = (0, exports.fromBundlerClientToStartaleAccount)(bundlerClient);
    const chain = startaleAccount.chain;
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
    const startaleAccount = (0, exports.fromBundlerClientToStartaleAccount)(bundlerClient);
    if (!startaleAccount.signer || !startaleAccount.signer.address) {
        throw new Error("Signer not found");
    }
    return startaleAccount.signer;
};
exports.fromBundlerClientToSigner = fromBundlerClientToSigner;
//# sourceMappingURL=fromBundlerClient.js.map