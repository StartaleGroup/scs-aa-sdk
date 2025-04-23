import {
  http,
  type Address,
  type Chain,
  type LocalAccount,
  type WalletClient,
  createWalletClient
} from "viem"
import { base, baseSepolia } from "viem/chains"
import { afterAll, beforeAll, describe, expect, test } from "vitest"
import { toNetwork } from "../../test/testSetup"
import { getTestAccount, killNetwork, toTestClient } from "../../test/testUtils"
import type { MasterClient, NetworkConfig } from "../../test/testUtils"
import {
  type NexusClient,
  createSmartAccountClient
} from "../clients/createBicoBundlerClient"
import { type StartaleSmartAccount, toStartaleSmartAccount } from "./toStartaleSmartAccount"

describe("nexus.account.addresses", async () => {
  let network: NetworkConfig
  let chain: Chain
  let bundlerUrl: string

  // Test utils
  let testClient: MasterClient
  let eoaAccount: LocalAccount
  let userTwo: LocalAccount
  let startaleAccountAddress: Address
  let startaleClient: NexusClient
  let startaleAccount: StartaleSmartAccount
  let walletClient: WalletClient

  beforeAll(async () => {
    network = await toNetwork("BESPOKE_ANVIL_NETWORK_FORKING_BASE_SEPOLIA")

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
      mock: true
    })

    startaleAccountAddress = await startaleAccount.getAddress()
  })
  afterAll(async () => {
    await killNetwork([network?.rpcPort, network?.bundlerPort])
  })

  test("should override account address", async () => {
    const someoneElsesNexusAddress =
      "0xf0479e036343bC66dc49dd374aFAF98402D0Ae5f"

    const newStartaleAccount = await toStartaleSmartAccount({
      accountAddress: someoneElsesNexusAddress,
      chain,
      signer: eoaAccount,
      transport: http()
    })

    const newStartaleClient = createSmartAccountClient({
      account: newStartaleAccount,
      transport: http(bundlerUrl),
      mock: true
    })

    const accountAddress = await newStartaleClient.account.getAddress()
    const someoneElseCounterfactualAddress =
      await newStartaleClient.account.getAddress()
    expect(newStartaleClient.account.address).toBe(
      someoneElseCounterfactualAddress
    )
    expect(accountAddress).toBe(someoneElsesNexusAddress)
  })

  test("should check that mainnet and testnet addresses are different", async () => {
    const mainnetClient = createSmartAccountClient({
      account: await toStartaleSmartAccount({
        chain: base,
        signer: eoaAccount,
        transport: http()
      }),
      mock: true,
      transport: http(bundlerUrl)
    })

    const testnetClient = createSmartAccountClient({
      account: await toStartaleSmartAccount({
        chain: baseSepolia,
        signer: eoaAccount,
        transport: http()
      }),
      mock: true,
      transport: http(bundlerUrl)
    })

    const testnetAddress = await testnetClient.account.getAddress()
    const mainnetAddress = await mainnetClient.account.getAddress()

    expect(testnetAddress).toBe(mainnetAddress)
  })
})
