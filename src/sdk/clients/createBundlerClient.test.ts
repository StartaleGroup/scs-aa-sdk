import {
  http,
  type Address,
  type Chain,
  type Hex,
  type LocalAccount,
  type Transport,
  createPublicClient
} from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { soneiumMinato, baseSepolia } from "viem/chains"
import { beforeAll, describe, expect, inject, test } from "vitest"
import { toNetwork } from "../../test/testSetup"
import type { NetworkConfig } from "../../test/testUtils"
import { type StartaleSmartAccount, toStartaleSmartAccount } from "../account/toStartaleSmartAccount"
import { safeMultiplier } from "../account/utils"
import type { StartaleAccountClient } from "./createSCSBundlerClient"
import { createSCSBundlerClient } from "./createSCSBundlerClient"
import { erc7579Actions } from "./decorators/erc7579"
import { smartAccountActions } from "./decorators/smartAccount"

// @ts-ignore
const { runPaidTests } = inject("settings")

const COMPETITORS = [
  {
    name: "Alto",
    chain: soneiumMinato,
    bundlerUrl: `https://api.pimlico.io/v2/${baseSepolia.id}/rpc?apikey=${process.env.PIMLICO_API_KEY}`,
    mock: true
  },
  {
    name: "Biconomy",
    bundlerUrl: `https://bundler.biconomy.io/api/v3/${baseSepolia.id}/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44`,
    chain: baseSepolia,
    mock: false
  }
]

const calls = [
  {
    to: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" as Address, // vitalik.eth
    value: 1n
  }
]

describe.runIf(runPaidTests).each(COMPETITORS)(
  "account.interoperability with $name bundler",
  async ({ bundlerUrl, chain, mock }) => {
    const account = privateKeyToAccount(`0x${process.env.PRIVATE_KEY as Hex}`)
    const publicClient = createPublicClient({ chain, transport: http() })
    let startaleSmartAccountAddress: Address
    let startaleSmartAccount: StartaleSmartAccount
    let bundlerClient: StartaleAccountClient

    beforeAll(async () => {
      startaleSmartAccount = await toStartaleSmartAccount({
        signer: account,
        chain,
        transport: http()
      })

      startaleSmartAccountAddress = await startaleSmartAccount.getAddress()

      const balance = await publicClient.getBalance({
        address: startaleSmartAccountAddress
      })

      if (balance === 0n) {
        throw new Error(
          `Insufficient balance at address: ${startaleSmartAccountAddress}`
        )
      }

      bundlerClient = createSCSBundlerClient({
        mock,
        chain,
        transport: http(bundlerUrl),
        account: startaleSmartAccount,
        // Different vendors have different fee estimation strategies
        userOperation: {
          estimateFeesPerGas: async (_) => {
            const feeData = await publicClient.estimateFeesPerGas()
            return {
              maxFeePerGas: safeMultiplier(feeData.maxFeePerGas, 1.6),
              maxPriorityFeePerGas: safeMultiplier(
                feeData.maxPriorityFeePerGas,
                1.6
              )
            }
          }
        }
      })
        .extend(erc7579Actions())
        .extend(smartAccountActions()) as unknown as StartaleAccountClient
    })

    test("should send a transaction through bundler", async () => {
      // Get initial balance
      const initialBalance = await publicClient.getBalance({
        address: startaleSmartAccountAddress
      })

      // Send user operation
      const userOp = await bundlerClient.prepareUserOperation({ calls })
      const userOpHash = await bundlerClient.sendUserOperation(userOp)
      const userOpReceipt = await bundlerClient.waitForUserOperationReceipt({
        hash: userOpHash
      })

      // Wait for the transaction to be mined
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: userOpReceipt.receipt.transactionHash
      })
      expect(receipt.status).toBe("success")

      // Get final balance
      const finalBalance = await publicClient.getBalance({
        address: startaleSmartAccountAddress
      })

      // Check that the balance has decreased
      expect(finalBalance).toBeLessThan(initialBalance)
    })
  }
)
