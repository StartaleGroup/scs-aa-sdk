import { http, createPublicClient, createWalletClient } from "viem"
import { createBundlerClient } from "viem/account-abstraction"
import { privateKeyToAccount } from "viem/accounts"
import { soneium } from "viem/chains"
import { describe, expect, it } from "vitest"
import { toStartaleSmartAccount } from "../toStartaleSmartAccount"
import {
  type BundlerClientTypes,
  fromBundlerClientToChain,
  fromBundlerClientToChainId,
  fromBundlerClientToStartaleAccount,
  fromBundlerClientToPublicClient,
  fromBundlerClientToSigner
} from "./fromBundlerClient"
import { toSigner } from "./toSigner"

describe("utils.fromBundlerClient", async () => {
  // Create real instances for testing
  const transport = http()
  const publicClient = createPublicClient({
    chain: soneium,
    transport
  })

  // Create a real wallet account
  const privateKey =
    "0x1234567890123456789012345678901234567890123456789012345678901234"
  const account = privateKeyToAccount(privateKey)

  // Create a real bundler client
  const bundlerClient = createBundlerClient({
    chain: soneium,
    transport
  })

  // Create a real signer
  const signer = await toSigner({ signer: account })

  // Create a real Startale Smart Account
  const smartAccount = await toStartaleSmartAccount({
    chain: soneium,
    signer,
    transport: http()
  })

  // Attach the Startale Smart Account to the bundler client
  const bundlerClientWithAccount = {
    ...bundlerClient,
    account: smartAccount
  }

  describe("fromBundlerClientToPublicClient", () => {
    it("should extract public client successfully", () => {
      const result = fromBundlerClientToPublicClient(bundlerClientWithAccount)
      expect(result).toBe(smartAccount.client)
      expect(result.chain.id).toBe(soneium.id)
    })

    it("should throw error if smart account is not found", () => {
      const invalidClient = {
        ...bundlerClient,
        account: { type: "invalid" }
      } as unknown as BundlerClientTypes

      expect(() => fromBundlerClientToPublicClient(invalidClient)).toThrow(
        "Startale account not found"
      )
    })
  })

  describe("fromBundlerClientToSmartAccount", () => {
    it("should extract smart account successfully", () => {
      const result = fromBundlerClientToStartaleAccount(bundlerClientWithAccount)
      expect(result).toBe(smartAccount)
      expect(result.type).toBe("smart")
    })

    it("should throw error if account type is not smart", () => {
      const invalidClient = {
        ...bundlerClient,
        account: { type: "eoa" }
      } as unknown as BundlerClientTypes

      expect(() => fromBundlerClientToStartaleAccount(invalidClient)).toThrow(
        "Startale account not found"
      )
    })
  })

  describe("fromBundlerClientToChain", () => {
    it("should extract chain successfully", () => {
      const result = fromBundlerClientToChain(bundlerClientWithAccount)
      expect(result.id).toBe(soneium.id)
      expect(result.name).toBe(soneium.name)
    })

    it("should throw error if chain is not found", () => {
      const invalidClient = {
        ...bundlerClientWithAccount,
        account: {
          ...smartAccount,
          chain: {}
        }
      }

      expect(() => fromBundlerClientToChain(invalidClient)).toThrow(
        "Chain not found"
      )
    })
  })

  describe("fromBundlerClientToChainId", () => {
    it("should extract chain ID successfully", () => {
      const result = fromBundlerClientToChainId(bundlerClientWithAccount)
      expect(result).toBe(soneium.id)
    })
  })

  describe("fromBundlerClientToSigner", () => {
    it("should extract signer successfully", () => {
      const result = fromBundlerClientToSigner(bundlerClientWithAccount)
      expect(result).toBe(smartAccount.signer)
      expect(result.address).toBe(account.address)
    })
  })
})
