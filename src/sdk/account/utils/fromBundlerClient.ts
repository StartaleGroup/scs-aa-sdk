import type { PublicClient } from "viem"
import type { Client } from "viem"
import type { Transport } from "viem"
import type { Chain } from "viem"
import type { Account } from "viem"
import type { BundlerClient, SmartAccount } from "viem/account-abstraction"
import type { StartaleAccountClient } from "../../clients/createSCSBundlerClient"
import type { StartaleSmartAccount } from "../toStartaleSmartAccount"
import type { Signer } from "./toSigner"

/**
 * Union type representing all supported bundler client types
 * @typedef {BundlerClient | StartaleAccountClient | Client<Transport, Chain | undefined, Account>} BundlerClientTypes
 */
export type BundlerClientTypes =
  | BundlerClient
  | StartaleAccountClient
  | Client<Transport, Chain | undefined, SmartAccount | undefined>

/**
 * Extracts the PublicClient from a bundler client
 * @param {BundlerClientTypes} bundlerClient - The bundler client to extract from
 * @returns {PublicClient<Transport, Chain, Account>} The public client instance
 * @throws {Error} If the Smart account is not found
 */
export const fromBundlerClientToPublicClient = (
  bundlerClient: BundlerClientTypes
): PublicClient<Transport, Chain, Account> => {
  const startaleAccount = fromBundlerClientToStartaleAccount(bundlerClient)
  if (!startaleAccount.client) {
    throw new Error("Public client not found")
  }
  return startaleAccount.client as PublicClient<Transport, Chain, Account>
}

/**
 * Extracts the StartaleSmartAccount from a bundler client
 * @param {BundlerClientTypes} bundlerClient - The bundler client to extract from
 * @returns {StartaleSmartAccount} The Startale smart account instance
 * @throws {Error} If the account is not a valid Startale smart account
 */
export const fromBundlerClientToStartaleAccount = (
  bundlerClient: BundlerClientTypes
): StartaleSmartAccount => {
  const startaleAccount = bundlerClient.account as StartaleSmartAccount
  if (!startaleAccount.type || startaleAccount.type !== "smart") {
    throw new Error("Startale account not found")
  }
  return bundlerClient.account as StartaleSmartAccount
}

/**
 * Extracts the Chain information from a bundler client
 * @param {BundlerClientTypes} bundlerClient - The bundler client to extract from
 * @returns {Chain} The chain information
 * @throws {Error} If the chain information is not found
 */
export const fromBundlerClientToChain = (
  bundlerClient: BundlerClientTypes
): Chain => {
  const startaleAccount = fromBundlerClientToStartaleAccount(bundlerClient)
  const chain = startaleAccount.chain
  if (!chain.id) {
    throw new Error("Chain not found")
  }
  return chain
}

/**
 * Extracts the chain ID from a bundler client
 * @param {BundlerClientTypes} bundlerClient - The bundler client to extract from
 * @returns {number} The chain ID
 * @throws {Error} If the chain information is not found
 */
export const fromBundlerClientToChainId = (
  bundlerClient: BundlerClientTypes
): number => {
  const chain = fromBundlerClientToChain(bundlerClient)
  if (!chain.id) {
    throw new Error("Chain ID not found")
  }
  return chain.id
}

/**
 * Extracts the Signer from a bundler client
 * @param {BundlerClientTypes} bundlerClient - The bundler client to extract from
 * @returns {Signer} The signer instance
 * @throws {Error} If the Startale smart account is not found
 */
export const fromBundlerClientToSigner = (
  bundlerClient: BundlerClientTypes
): Signer => {
  const startaleAccount = fromBundlerClientToStartaleAccount(bundlerClient)
  if (!startaleAccount.signer || !startaleAccount.signer.address) {
    throw new Error("Signer not found")
  }
  return startaleAccount.signer
}
