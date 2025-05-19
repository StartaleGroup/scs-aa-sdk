import {
  COUNTER_ADDRESS,
  type Ecosystem,
  type Infra,
  toClients,
  toEcosystem
} from "@biconomy/ecosystem"
import {
  http,
  type Address,
  type Chain,
  Hex,
  type LocalAccount,
  parseEther
} from "viem"
import { afterAll, beforeAll, describe, expect, test } from "vitest"
import { getTestAccount, killNetwork } from "../../../../test/testUtils"
import { type StartaleSmartAccount, toStartaleSmartAccount } from "../../../account"
import {
  type StartaleAccountClient,
  createSmartAccountClient
} from "../../../clients/createSCSBundlerClient"
import { ownableActions } from "./decorators"
import { toOwnableModule } from "./toOwnableModule"

describe("modules.toOwnableModule", () => {
  let ecosystem: Ecosystem
  let infra: Infra
  let chain: Chain
  let bundlerUrl: string

  let eoaAccount: LocalAccount
  let redeemerAccount: LocalAccount
  let startaleClient: StartaleAccountClient
  let startaleAccountAddress: Address
  let startaleAccount: StartaleSmartAccount
  let sessionDetails: string

  beforeAll(async () => {
    ecosystem = await toEcosystem()
    infra = ecosystem.infras[0]
    chain = infra.network.chain
    bundlerUrl = infra.bundler.url
    eoaAccount = getTestAccount(0)
    redeemerAccount = getTestAccount(1)

    const { testClient } = await toClients(infra.network)

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
      mock: true
    })
    startaleAccountAddress = await startaleAccount.getAddress()
    await testClient.setBalance({
      address: startaleAccountAddress,
      value: parseEther("100")
    })
  })

  afterAll(async () => {
    await killNetwork([infra.network.rpcPort, infra.bundler.port])
  })

  test("demo an ownable account", async () => {
    const ownablesClient = startaleClient.extend(ownableActions())
    const { userOpHash, userOp } = await ownablesClient.prepareForMultiSign({
      calls: [
        {
          to: COUNTER_ADDRESS,
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
