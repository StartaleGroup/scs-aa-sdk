import {
  http,
  type Address,
  type Chain,
  type LocalAccount,
  type PublicClient,
  createPublicClient
} from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { baseSepolia } from "viem/chains"
import { beforeAll, describe, expect, test } from "vitest"
import { toNetwork } from "../../../test/testSetup"
import type { MasterClient, NetworkConfig } from "../../../test/testUtils"
import { getTestAccount, toTestClient, topUp } from "../../../test/testUtils"
import {
  type NexusClient,
  createBicoBundlerClient
} from "../../clients/createBicoBundlerClient"
import { type StartaleSmartAccount, toStartaleSmartAccount } from "../toStartaleSmartAccount"

describe("account.decorators.getNexusAddress.local", () => {
  let network: NetworkConfig
  let chain: Chain
  let bundlerUrl: string

  // Test utils
  let testClient: MasterClient
  let eoaAccount: LocalAccount

  let startaleAccount: StartaleSmartAccount
  let startaleClient: NexusClient
  let startaleAccountAddress: Address

  beforeAll(async () => {
    network = await toNetwork("BESPOKE_ANVIL_NETWORK")
    chain = network.chain
    bundlerUrl = network.bundlerUrl
    eoaAccount = privateKeyToAccount(`0x${process.env.PRIVATE_KEY!}`)
    testClient = toTestClient(chain, getTestAccount(5))

    startaleAccount = await toStartaleSmartAccount({
      chain,
      transport: http(network.rpcUrl),
      signer: eoaAccount
    })

    startaleClient = createBicoBundlerClient({
      mock: true,
      account: startaleAccount,
      transport: http(bundlerUrl)
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

describe("account.decorators.getNexusAddress.testnet", () => {
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

    const startaleClient = createBicoBundlerClient({
      account,
      transport: http(
        `https://api.pimlico.io/v2/${baseSepolia.id}/rpc?apikey=${process.env.PIMLICO_API_KEY}`
      )
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
