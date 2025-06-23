import {
  http,
  type Address,
  type Chain,
  type LocalAccount,
  type WalletClient,
  createWalletClient
} from "viem"
import { base, baseSepolia, soneium, soneiumMinato } from "viem/chains"
import { afterAll, beforeAll, describe, expect, test } from "vitest"
import { toNetwork } from "../../test/testSetup"
import { getTestAccount, killNetwork, toTestClient } from "../../test/testUtils"
import type { MasterClient, NetworkConfig } from "../../test/testUtils"
import {
  type StartaleAccountClient,
  createSmartAccountClient
} from "../clients/createSCSBundlerClient"
import {
  type StartaleSmartAccount,
  toStartaleSmartAccount
} from "./toStartaleSmartAccount"

describe("startale.account.addresses", async () => {
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
    network = await toNetwork("TESTNET_FROM_ENV_VARS")

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
      mock: true,
      client: testClient
    })

    startaleAccountAddress = await startaleAccount.getAddress()
  })
  afterAll(async () => {
    await killNetwork([network?.rpcPort, network?.bundlerPort])
  })

  test("should override account address", async () => {
    const someoneElsesAccountAddress =
      "0xf0479e036343bC66dc49dd374aFAF98402D0Ae5f"

    const newStartaleAccount = await toStartaleSmartAccount({
      accountAddress: someoneElsesAccountAddress,
      chain,
      signer: eoaAccount,
      transport: http()
    })

    const newStartaleClient = createSmartAccountClient({
      account: newStartaleAccount,
      transport: http(bundlerUrl),
      mock: true,
      client: testClient
    })

    const accountAddress = await newStartaleClient.account.getAddress()
    const someoneElseCounterfactualAddress =
      await newStartaleClient.account.getAddress()
    expect(newStartaleClient.account.address).toBe(
      someoneElseCounterfactualAddress
    )
    expect(accountAddress).toBe(someoneElsesAccountAddress)
  })

  test("should check that mainnet and testnet addresses are different", async () => {
    const mainnetClient = createSmartAccountClient({
      account: await toStartaleSmartAccount({
        chain: soneium,
        signer: eoaAccount,
        transport: http()
      }),
      mock: true,
      transport: http(bundlerUrl)
    })

    const testnetClient = createSmartAccountClient({
      account: await toStartaleSmartAccount({
        chain: soneiumMinato,
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
