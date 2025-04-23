import type { PublicClient } from "viem";
import type { Client } from "viem";
import type { Transport } from "viem";
import type { Chain } from "viem";
import type { Account } from "viem";
import type { BundlerClient, SmartAccount } from "viem/account-abstraction";
import type { StartaleAccountClient } from "../../clients/createBicoBundlerClient";
import type { StartaleSmartAccount } from "../toStartaleSmartAccount";
import type { Signer } from "./toSigner";
/**
 * Union type representing all supported bundler client types
 * @typedef {BundlerClient | StartaleAccountClient | Client<Transport, Chain | undefined, Account>} BundlerClientTypes
 */
export type BundlerClientTypes = BundlerClient | StartaleAccountClient | Client<Transport, Chain | undefined, SmartAccount | undefined>;
/**
 * Extracts the PublicClient from a bundler client
 * @param {BundlerClientTypes} bundlerClient - The bundler client to extract from
 * @returns {PublicClient<Transport, Chain, Account>} The public client instance
 * @throws {Error} If the Nexus account is not found
 */
export declare const fromBundlerClientToPublicClient: (bundlerClient: BundlerClientTypes) => PublicClient<Transport, Chain, Account>;
/**
 * Extracts the NexusAccount from a bundler client
 * @param {BundlerClientTypes} bundlerClient - The bundler client to extract from
 * @returns {NexusAccount} The Nexus account instance
 * @throws {Error} If the account is not a valid Nexus smart account
 */
export declare const fromBundlerClientToNexusAccount: (bundlerClient: BundlerClientTypes) => StartaleSmartAccount;
/**
 * Extracts the Chain information from a bundler client
 * @param {BundlerClientTypes} bundlerClient - The bundler client to extract from
 * @returns {Chain} The chain information
 * @throws {Error} If the chain information is not found
 */
export declare const fromBundlerClientToChain: (bundlerClient: BundlerClientTypes) => Chain;
/**
 * Extracts the chain ID from a bundler client
 * @param {BundlerClientTypes} bundlerClient - The bundler client to extract from
 * @returns {number} The chain ID
 * @throws {Error} If the chain information is not found
 */
export declare const fromBundlerClientToChainId: (bundlerClient: BundlerClientTypes) => number;
/**
 * Extracts the Signer from a bundler client
 * @param {BundlerClientTypes} bundlerClient - The bundler client to extract from
 * @returns {Signer} The signer instance
 * @throws {Error} If the Nexus account is not found
 */
export declare const fromBundlerClientToSigner: (bundlerClient: BundlerClientTypes) => Signer;
//# sourceMappingURL=fromBundlerClient.d.ts.map