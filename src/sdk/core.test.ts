import {
  http,
  type Address,
  type Chain,
  type LocalAccount,
  type WalletClient,
  createWalletClient,
  parseEther,
  Hex
} from "viem"
import { afterAll, beforeAll, describe, expect, test } from "vitest"
import { toNetwork } from "../test/testSetup"
import { getTestAccount, killNetwork, toTestClient } from "../test/testUtils"
import type { MasterClient, NetworkConfig } from "../test/testUtils"
import { type StartaleSmartAccount, toStartaleSmartAccount } from "./account/toStartaleSmartAccount"
import {
  type StartaleAccountClient,
  createSmartAccountClient
} from "./clients/createSCSBundlerClient"
import { toSmartSessionsValidator } from "./modules/validators/smartSessionsValidator/toSmartSessionsValidator"
import { getSmartSessionsValidator } from "@rhinestone/module-sdk"

describe("core", async () => {
  let network: NetworkConfig
  let chain: Chain
  let bundlerUrl: string

  // Test utils
  let testClient: MasterClient
  let eoaAccount: LocalAccount
  let userTwo: LocalAccount
  let startaleAccountAddress: Address
  let startaleClient: StartaleAccountClient
  let startaleAccount: StartaleSmartAccount
  let walletClient: WalletClient

  beforeAll(async () => {
    network = await toNetwork('TESTNET_FROM_ENV_VARS')

    chain = network.chain
    bundlerUrl = network.bundlerUrl
    eoaAccount = getTestAccount(0)
    userTwo = getTestAccount(1)

    testClient = toTestClient(chain, getTestAccount(5))

    walletClient = createWalletClient({
      account: eoaAccount,
      chain,
      transport: http()
    })

    startaleAccount = await toStartaleSmartAccount({
      chain,
      signer: eoaAccount,
      transport: http()
    })

    startaleClient = createSmartAccountClient({
      account: startaleAccount,
      transport: http(bundlerUrl),
      client: testClient
    })

    startaleAccountAddress = await startaleClient.account.getAddress()
  })
  afterAll(async () => {
    await killNetwork([network?.rpcPort, network?.bundlerPort])
  })

  // test("should not be deployed", async () => {
  //   expect(await startaleAccount.isDeployed()).toBe(false)
  // })

  test("should now deploy if not deployed", async () => {
    // send 0.01 eth from eoa to counterfactual address
    const smartAccountBalance = await testClient.getBalance({
      address: startaleAccountAddress
    })
    if(smartAccountBalance == 0n) {
    const hash = await walletClient.sendTransaction({
      chain,
      account: eoaAccount,
      to: startaleAccountAddress,
      value: parseEther("0.01")
    })
    const receipt = await testClient.waitForTransactionReceipt({ hash })
    expect(receipt.status).toBe("success")
    }
    const hash = await startaleClient.sendUserOperation({
      calls: [
        {
          to: startaleAccountAddress,
          value: 0n
        }
      ]
    })
    const receipt = await startaleClient.waitForUserOperationReceipt({ hash })
    expect(receipt.success).toBe(true)
    expect(await startaleAccount.isDeployed()).toBe(true)
  })

  // TODO: Review and fix
  test.skip("should install smart sessions validator", async () => {
    const smartSessions = getSmartSessionsValidator({});
    console.log(smartSessions)
    const hash = await startaleClient.installModule({
      module: smartSessions
    })
    const receipt = await startaleClient.waitForUserOperationReceipt({ hash })
    expect(receipt.success).toBe(true)
  })
})
