import {
  http,
  type Account,
  type Address,
  type Chain,
  encodePacked,
  isHex
} from "viem"
import { afterAll, beforeAll, describe, expect, test } from "vitest"
import { toNetwork } from "../../../../test/testSetup"
import {
  type MasterClient,
  type NetworkConfig,
  fundAndDeployClients,
  getTestAccount,
  killNetwork,
  toTestClient
} from "../../../../test/testUtils"
import {
  type StartaleSmartAccount,
  toStartaleSmartAccount
} from "../../../account/toStartaleSmartAccount"
import {
  type StartaleAccountClient,
  createSmartAccountClient
} from "../../createSCSBundlerClient"

describe("erc7579.decorators", async () => {
  let network: NetworkConfig
  let chain: Chain
  let bundlerUrl: string

  // Test utils
  let testClient: MasterClient
  let eoaAccount: Account
  let startaleAccount: StartaleSmartAccount
  let startaleClient: StartaleAccountClient
  let startaleAccountAddress: Address
  let recipient: Account
  let recipientAddress: Address

  beforeAll(async () => {
    network = await toNetwork()

    chain = network.chain
    bundlerUrl = network.bundlerUrl
    eoaAccount = getTestAccount(0)
    recipient = getTestAccount(1)
    recipientAddress = recipient.address
    testClient = toTestClient(chain, getTestAccount(5))

    startaleAccount = await toStartaleSmartAccount({
      chain,
      signer: eoaAccount,
      transport: http(network.rpcUrl)
    })

    startaleClient = createSmartAccountClient({
      account: startaleAccount,
      transport: http(bundlerUrl),
      mock: true
    })

    startaleAccountAddress = await startaleClient.account.getAddress()
    await fundAndDeployClients(testClient, [startaleClient])
  })

  afterAll(async () => {
    await killNetwork([network?.rpcPort, network?.bundlerPort])
  })

  test.skip("should test read methods", async () => {
    const [
      installedValidators,
      installedExecutors,
      activeHook,
      fallbackSelector,
      supportsValidator,
      supportsDelegateCall,
      isK1ValidatorInstalled
    ] = await Promise.all([
      startaleClient.getInstalledValidators(),
      startaleClient.getInstalledExecutors(),
      startaleClient.getActiveHook(),
      startaleClient.getFallbackBySelector({ selector: "0xcb5baf0f" }),
      startaleClient.supportsModule({ type: "validator" }),
      startaleClient.supportsExecutionMode({ type: "delegatecall" }),
      startaleClient.isModuleInstalled({
        module: {
          type: "validator",
          address: startaleClient.account.getModule().address,
          initData: "0x"
        }
      })
    ])

    expect(installedExecutors[0].length).toBeTypeOf("number")
    expect(installedValidators[0]).toEqual([
      startaleClient.account.getModule().address
    ])
    expect(isHex(activeHook)).toBe(true)
    expect(fallbackSelector.length).toBeTypeOf("number")
    expect(supportsValidator).toBe(true)
    expect(supportsDelegateCall).toBe(true)
    expect(isK1ValidatorInstalled).toBe(true)
    expect([
      installedValidators,
      installedExecutors,
      activeHook,
      fallbackSelector,
      supportsValidator,
      supportsDelegateCall,
      isK1ValidatorInstalled
    ]).toMatchInlineSnapshot(`
      [
        [
          [
            "0x00000000d12897DDAdC2044614A9677B191A2d95",
          ],
          "0x0000000000000000000000000000000000000001",
        ],
        [
          [
            "0x7454C587FCDe26C62deDCFa53548A827CFeB7F78",
          ],
          "0x0000000000000000000000000000000000000001",
        ],
        "0x0000000000000000000000000000000000000000",
        [
          "0x00",
          "0x0000000000000000000000000000000000000000",
        ],
        true,
        true,
        true,
      ]
    `)
  })
})
