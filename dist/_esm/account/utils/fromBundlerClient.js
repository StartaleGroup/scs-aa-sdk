/**
 * Extracts the PublicClient from a bundler client
 * @param {BundlerClientTypes} bundlerClient - The bundler client to extract from
 * @returns {PublicClient<Transport, Chain, Account>} The public client instance
 * @throws {Error} If the Nexus account is not found
 */
export const fromBundlerClientToPublicClient = (bundlerClient) => {
    const nexusAccount = fromBundlerClientToNexusAccount(bundlerClient);
    if (!nexusAccount.client) {
        throw new Error("Public client not found");
    }
    return nexusAccount.client;
};
/**
 * Extracts the NexusAccount from a bundler client
 * @param {BundlerClientTypes} bundlerClient - The bundler client to extract from
 * @returns {NexusAccount} The Nexus account instance
 * @throws {Error} If the account is not a valid Nexus smart account
 */
export const fromBundlerClientToNexusAccount = (bundlerClient) => {
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
    const nexusAccount = fromBundlerClientToNexusAccount(bundlerClient);
    const chain = nexusAccount.chain;
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
 * @throws {Error} If the Nexus account is not found
 */
export const fromBundlerClientToSigner = (bundlerClient) => {
    const nexusAccount = fromBundlerClientToNexusAccount(bundlerClient);
    if (!nexusAccount.signer || !nexusAccount.signer.address) {
        throw new Error("Signer not found");
    }
    return nexusAccount.signer;
};
//# sourceMappingURL=fromBundlerClient.js.map