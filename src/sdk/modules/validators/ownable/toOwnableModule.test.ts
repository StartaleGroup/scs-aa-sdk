import {
  http,
  type Address,
  type Chain,
  Hex,
  type LocalAccount,
  parseEther,
  createWalletClient
} from "viem"
import { afterAll, beforeAll, describe, expect, test } from "vitest"
import { getTestAccount, killNetwork, MasterClient, NetworkConfig, toTestClient } from "../../../../test/testUtils"
import { type StartaleSmartAccount, toStartaleSmartAccount } from "../../../account"
import {
  type StartaleAccountClient,
  createSmartAccountClient
} from "../../../clients/createSCSBundlerClient"
import { ownableActions } from "./decorators"
import { toOwnableModule } from "./toOwnableModule"
import { toNetwork } from "../../../../test/testSetup"

describe("modules.toOwnableModule", () => {
  let network: NetworkConfig
  let chain: Chain
  let bundlerUrl: string

  let eoaAccount: LocalAccount
  let redeemerAccount: LocalAccount
  let testClient: MasterClient
  let startaleClient: StartaleAccountClient
  let startaleAccountAddress: Address
  let startaleAccount: StartaleSmartAccount
  let sessionDetails: string

  beforeAll(async () => {
    network = await toNetwork("TESTNET_FROM_ENV_VARS")

    chain = network.chain
    bundlerUrl = network.bundlerUrl
    eoaAccount = getTestAccount(0)
    redeemerAccount = getTestAccount(1)
    testClient = toTestClient(chain, getTestAccount(5))

    const walletClient = createWalletClient({
      account: eoaAccount,
      chain,
      transport: http()
    })

    // const { testClient } = await toClients(infra.network)

    const ownablesModule = toOwnableModule({
      signer: eoaAccount,
      threshold: 1,
      owners: [redeemerAccount.address]
    })

    startaleAccount = await toStartaleSmartAccount({
      signer: eoaAccount,
      chain,
      transport: http(),
      validators: [ownablesModule]
    })

    startaleClient = createSmartAccountClient({
      bundlerUrl,
      account: startaleAccount,
      mock: true,
      client: testClient
    })
    startaleAccountAddress = await startaleAccount.getAddress()
    await walletClient.sendTransaction({
      chain,
      account: eoaAccount,
      to: startaleAccountAddress,
      value: parseEther("0.01")
    })
  })

  afterAll(async () => {
    await killNetwork([network?.rpcPort, network?.bundlerPort])
  })

  test.skip("demo an ownable account", async () => {
    const ownablesClient = startaleClient.extend(ownableActions())
    const { userOpHash, userOp } = await ownablesClient.prepareForMultiSign({
      calls: [
        {
          to: startaleAccountAddress,
          data: "0x273ea3e3"
        }
      ]
    })
    const sig = await redeemerAccount.signMessage({
      message: { raw: userOpHash }
    })
    const multiSigHash = await ownablesClient.multiSign({
      ...userOp,
      signatures: [sig]
    })

    const receipt = await startaleClient.waitForUserOperationReceipt({
      hash: multiSigHash
    })
    if (!receipt.success) {
      throw new Error("Multi sign failed")
    }

    expect(receipt.success).toBe(true)
  })
})
