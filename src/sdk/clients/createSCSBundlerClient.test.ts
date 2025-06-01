import {
  http,
  type Account,
  type Address,
  type Chain,
  LocalAccount
} from "viem"
import { afterAll, beforeAll, describe, expect, test } from "vitest"
import { testnetTest, toNetwork } from "../../test/testSetup"
import {
  getTestAccount,
  killNetwork,
  toTestClient,
  topUp
} from "../../test/testUtils"
import type { MasterClient, NetworkConfig } from "../../test/testUtils"
import { type StartaleSmartAccount, toStartaleSmartAccount } from "../account/toStartaleSmartAccount"
import {
  type SCSBundlerClient,
  createSCSBundlerClient,
  createSmartAccountClient
} from "./createSCSBundlerClient"

describe("scs.bundler", async () => {
  let network: NetworkConfig
  let chain: Chain
  let bundlerUrl: string

  // Test utils
  let testClient: MasterClient
  let eoaAccount: Account
  let startaleAccountAddress: Address
  let scsBundler: SCSBundlerClient
  let startaleAccount: StartaleSmartAccount

  beforeAll(async () => {
    network = await toNetwork('TESTNET_FROM_ENV_VARS')

    chain = network.chain
    bundlerUrl = network.bundlerUrl
    eoaAccount = getTestAccount(0)
    testClient = toTestClient(chain, getTestAccount(5))

    startaleAccount = await toStartaleSmartAccount({
      signer: eoaAccount,
      chain,
      transport: http()
    })

    scsBundler = createSCSBundlerClient({
      mock: true,
      bundlerUrl,
      account: startaleAccount,
      client: testClient
    })
    startaleAccountAddress = await startaleAccount.getAddress()
    await topUp(testClient, startaleAccountAddress)
  })

  afterAll(async () => {
    await killNetwork([network?.rpcPort, network?.bundlerPort])
  })

  testnetTest(
    "should demo adjusting gas estimates returned by the bundler",
    async ({ config: { account, chain, bundlerUrl } }) => {
      if (!account) {
        throw new Error("Account is required")
      }
      const startaleAccount = await toStartaleSmartAccount({
        chain,
        signer: account,
        transport: http()
      })

      const startaleClient = createSmartAccountClient({
        account: startaleAccount,
        transport: http(bundlerUrl),
        client: testClient
      })

      const [
        preparedUserOperationWithoutGasBuffer,
        preparedUserOperationWithGasBuffer
      ] = await Promise.all([
        startaleClient.prepareUserOperation({
          calls: [
            {
              to: account.address,
              value: 1n
            }
          ]
        }),
        startaleClient.prepareUserOperation({
          gasBuffer: {
            factor: 1.2,
            fields: ["preVerificationGas", "verificationGasLimit"]
          },
          calls: [
            {
              to: account.address,
              value: 1n
            }
          ]
        })
      ])

      expect(
        preparedUserOperationWithGasBuffer.preVerificationGas
      ).toBeGreaterThan(
        preparedUserOperationWithoutGasBuffer.preVerificationGas
      )
      expect(
        preparedUserOperationWithGasBuffer.verificationGasLimit
      ).toBeGreaterThan(
        preparedUserOperationWithoutGasBuffer.verificationGasLimit
      )
      expect(preparedUserOperationWithGasBuffer.callGasLimit).toEqual(
        preparedUserOperationWithoutGasBuffer.callGasLimit
      )
    }
  )

  test.concurrent(
    "should have been extended by SCSspecific actions",
    async () => {
      const gasFees = await scsBundler.getGasFeeValues()
      expect(gasFees).toHaveProperty("fast")
      expect(gasFees).toHaveProperty("standard")
      expect(gasFees).toHaveProperty("slow")
      expect(gasFees.fast.maxFeePerGas).toBeGreaterThan(0n)
    }
  )

  test("should send a user operation and get the receipt", async () => {
    const calls = [{ to: eoaAccount.address, value: 1n }]
    // Must find gas fees before sending the user operation
    const gas = await testClient.estimateFeesPerGas()
    const hash = await scsBundler.sendUserOperation({
      ...gas,
      calls,
      account: startaleAccount
    })
    const receipt = await scsBundler.waitForUserOperationReceipt({ hash })
    expect(receipt.success).toBeTruthy()
  })
})
