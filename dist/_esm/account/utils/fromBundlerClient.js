/**
 * Extracts the PublicClient from a bundler client
 * @param {BundlerClientTypes} bundlerClient - The bundler client to extract from
 * @returns {PublicClient<Transport, Chain, Account>} The public client instance
 * @throws {Error} If the Smart account is not found
 */
export const fromBundlerClientToPublicClient = (bundlerClient) => {
    const startaleAccount = fromBundlerClientToStartaleAccount(bundlerClient);
    if (!startaleAccount.client) {
        throw new Error("Public client not found");
    }
    return startaleAccount.client;
};
/**
 * Extracts the StartaleSmartAccount from a bundler client
 * @param {BundlerClientTypes} bundlerClient - The bundler client to extract from
 * @returns {StartaleSmartAccount} The Startale smart account instance
 * @throws {Error} If the account is not a valid Startale smart account
 */
export const fromBundlerClientToStartaleAccount = (bundlerClient) => {
    const startaleAccount = bundlerClient.account;
    if (!startaleAccount.type || startaleAccount.type !== "smart") {
        throw new Error("Startale account not found");
    }
    return bundlerClient.account;
};
/**
 * Extracts the Chain information from a bundler client
 * @param {BundlerClientTypes} bundlerClient - The bundler client to extract from
 * @returns {Chain} The chain information
 * @throws {Error} If the chain information is not found
 */
export const fromBundlerClientToChain = (bundlerClient) => {
    const startaleAccount = fromBundlerClientToStartaleAccount(bundlerClient);
    const chain = startaleAccount.chain;
    if (!chain.id) {
        throw new Error("Chain not found");
    }
    return chain;
};
/**
 * Extracts the chain ID from a bundler client
 * @param {BundlerClientTypes} bundlerClient - The bundler client to extract from
 * @returns {number} The chain ID
 * @throws {Error} If the chain information is not found
 */
export const fromBundlerClientToChainId = (bundlerClient) => {
    const chain = fromBundlerClientToChain(bundlerClient);
    if (!chain.id) {
        throw new Error("Chain ID not found");
    }
    return chain.id;
};
/**
 * Extracts the Signer from a bundler client
 * @param {BundlerClientTypes} bundlerClient - The bundler client to extract from
 * @returns {Signer} The signer instance
 * @throws {Error} If the Startale smart account is not found
 */
export const fromBundlerClientToSigner = (bundlerClient) => {
    const startaleAccount = fromBundlerClientToStartaleAccount(bundlerClient);
    if (!startaleAccount.signer || !startaleAccount.signer.address) {
        throw new Error("Signer not found");
    }
    return startaleAccount.signer;
};
//# sourceMappingURL=fromBundlerClient.js.map