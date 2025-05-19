import {
  http,
  type Address,
  type Chain,
  type Hex,
  type PrivateKeyAccount,
  type PublicClient,
  type WalletClient,
  createPublicClient,
  createWalletClient,
  parseEther
} from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { base, optimism, polygon } from "viem/chains"
import { beforeAll, describe, expect, test } from "vitest"
import { toStartaleSmartAccount } from "../sdk/account/toStartaleSmartAccount"
import { playgroundTrue } from "../sdk/account/utils/Utils"
import {
  type StartaleAccountClient,
  createSmartAccountClient
} from "../sdk/clients/createSCSBundlerClient"
import {
  type SCSPaymasterClient,
  type SCSPaymasterContext,
  scsSponsoredPaymasterContext,
  createSCSPaymasterClient
} from "../sdk/clients/createSCSPaymasterClient"
import { toNetwork } from "./testSetup"
import type { NetworkConfig } from "./testUtils"

const index = 0n

describe.skipIf(!playgroundTrue())("playground", () => {
  let network: NetworkConfig
  // Startale Account Config
  let chain: Chain
  let bundlerUrl: string
  let walletClient: WalletClient
  let paymasterUrl: string | undefined

  // Test utils
  let publicClient: PublicClient // testClient not available on public testnets
  let eoaAccount: PrivateKeyAccount
  let recipientAddress: Address
  let startaleClient: StartaleAccountClient
  let startaleAccountAddress: Address

  let paymasterParams:
    | undefined
    | {
        paymaster: SCSPaymasterClient
        paymasterContext: SCSPaymasterContext
      }

  beforeAll(async () => {
    network = await toNetwork("TESTNET_FROM_ENV_VARS")

    chain = network.chain
    bundlerUrl = network.bundlerUrl
    paymasterUrl = network.paymasterUrl
    eoaAccount = network.account as PrivateKeyAccount

    recipientAddress = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"

    walletClient = createWalletClient({
      account: eoaAccount,
      chain,
      transport: http()
    })

    publicClient = createPublicClient({
      chain,
      transport: http()
    })

    paymasterParams = paymasterUrl
      ? {
          paymaster: createSCSPaymasterClient({
            transport: http(paymasterUrl)
          }),
          paymasterContext: scsSponsoredPaymasterContext
        }
      : undefined
  })

  test("should init the smart account", async () => {
    startaleClient = createSmartAccountClient({
      account: await toStartaleSmartAccount({
        chain,
        signer: eoaAccount,
        transport: http(),
        index
      }),
      transport: http(bundlerUrl),
      ...(paymasterParams ? paymasterParams : {})
    })
  })

  test("should log relevant addresses", async () => {
    startaleAccountAddress = await startaleClient.account.getAddress()
    console.log({ startaleAccountAddress })
  })

  test("should check balances and top up relevant addresses", async () => {
    const [ownerBalance, smartAccountBalance] = await Promise.all([
      publicClient.getBalance({
        address: eoaAccount.address
      }),
      publicClient.getBalance({
        address: startaleAccountAddress
      })
    ])

    const balancesAreOfCorrectType = [ownerBalance, smartAccountBalance].every(
      (balance) => typeof balance === "bigint"
    )
    if (smartAccountBalance === 0n) {
      const hash = await walletClient.sendTransaction({
        chain,
        account: eoaAccount,
        to: startaleAccountAddress,
        value: parseEther("0.01")
      })
      const receipt = await publicClient.waitForTransactionReceipt({ hash })
      expect(receipt.status).toBe("success")
      const [ownerBalanceTwo, smartAccountBalanceTwo] = await Promise.all([
        publicClient.getBalance({ address: eoaAccount.address }),
        publicClient.getBalance({ address: startaleAccountAddress })
      ])
      console.log({ ownerBalanceTwo, smartAccountBalanceTwo })
    }
    expect(balancesAreOfCorrectType).toBeTruthy()
  })

  test("should send some native token", async () => {
    const balanceBefore = await publicClient.getBalance({
      address: recipientAddress
    })
    const hash = await startaleClient.sendUserOperation({
      calls: [{ to: recipientAddress, value: 1n }]
    })
    const { success } = await startaleClient.waitForUserOperationReceipt({ hash })
    const balanceAfter = await publicClient.getBalance({
      address: recipientAddress
    })
    expect(success).toBe("true")
    expect(balanceAfter - balanceBefore).toBe(1n)
  })

  test.skip("should send a user operation using startaleClient.sendUserOperation", async () => {
    const balanceBefore = await publicClient.getBalance({
      address: recipientAddress
    })
    const userOpHash = await startaleClient.sendUserOperation({
      calls: [{ to: recipientAddress, value: 1n }]
    })
    const { success } = await startaleClient.waitForUserOperationReceipt({
      hash: userOpHash
    })
    const balanceAfter = await publicClient.getBalance({
      address: recipientAddress
    })
    expect(success).toBe("true")
    expect(balanceAfter - balanceBefore).toBe(1n)
  })
})
