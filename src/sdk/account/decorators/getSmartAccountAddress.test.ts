import {
  http,
  type Address,
  type Chain,
  type LocalAccount,
  type PublicClient,
  createPublicClient
} from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { baseSepolia, soneiumMinato } from "viem/chains"
import { beforeAll, describe, expect, test } from "vitest"
import { toNetwork } from "../../../test/testSetup"
import type { MasterClient, NetworkConfig } from "../../../test/testUtils"
import { getTestAccount, toTestClient, topUp } from "../../../test/testUtils"
import {
  type StartaleAccountClient,
  createSCSBundlerClient,
  createSmartAccountClient
} from "../../clients/createSCSBundlerClient"
import {
  type StartaleSmartAccount,
  toStartaleSmartAccount
} from "../toStartaleSmartAccount"

describe("account.decorators.getSmartAccountAddress.local", () => {
  let network: NetworkConfig
  let chain: Chain
  let bundlerUrl: string

  // Test utils
  let testClient: MasterClient
  let eoaAccount: LocalAccount

  let startaleAccountAddress: Address

  let startaleAccount: StartaleSmartAccount
  let startaleClient: StartaleAccountClient

  beforeAll(async () => {
    // Note: BESPOKE_ANVIL_NETWORK would not work until we deploy artifacts to the network.
    network = await toNetwork("TESTNET_FROM_ENV_VARS")
    chain = network.chain
    bundlerUrl = network.bundlerUrl
    eoaAccount = privateKeyToAccount(`0x${process.env.PRIVATE_KEY!}`)
    testClient = toTestClient(chain, getTestAccount(5))

    startaleAccount = await toStartaleSmartAccount({
      chain,
      transport: http(network.rpcUrl),
      signer: eoaAccount
    })

    startaleClient = createSmartAccountClient({
      mock: true,
      account: startaleAccount,
      transport: http(bundlerUrl),
      // Note: must be provided to be able to fetch rpcUrl in getGasFees (part of sendUserOperation)
      client: testClient
    })

    startaleAccountAddress = await startaleAccount.getAddress()
    await topUp(testClient, startaleAccountAddress)
  })

  test("init local anvil network", async () => {
    const hash = await startaleClient.sendUserOperation({
      calls: [
        {
          to: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", // vitalik.eth,
          value: 0n
        }
      ]
    })

    const tx = await startaleClient.waitForUserOperationReceipt({ hash })
    expect(tx.success).toBeTruthy()
  })
})

describe("account.decorators.getSmartAccountAddress.testnet", () => {
  let network: NetworkConfig
  let chain: Chain
  let bundlerUrl: string

  // Test utils
  let publicClient: PublicClient
  let eoaAccount: LocalAccount

  beforeAll(async () => {
    network = await toNetwork("TESTNET_FROM_ENV_VARS")

    chain = network.chain
    bundlerUrl = network.bundlerUrl
    eoaAccount = network.account!
    publicClient = createPublicClient({
      chain,
      transport: http(network.rpcUrl)
    })
  })

  test("init testnet network", async () => {
    const account = await toStartaleSmartAccount({
      chain,
      transport: http(network.rpcUrl),
      signer: eoaAccount
    })

    // updating url
    // https://soneium-minato.bundler.scs.startale.com?apikey=SCS_API_KEY
    const startaleClient = createSCSBundlerClient({
      account,
      transport: http(
        `https://soneium-minato.bundler.scs.startale.com?apikey=${process.env.SCS_MINATO_BUNDLER_API_KEY}`
      ),
      client: publicClient
    })

    const hash = await startaleClient.sendUserOperation({
      calls: [
        {
          to: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", // vitalik.eth,
          value: 0n
        }
      ]
    })

    const tx = await startaleClient.waitForUserOperationReceipt({ hash })
    expect(tx.success).toBeTruthy()
  })
})
