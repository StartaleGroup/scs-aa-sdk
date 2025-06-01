import {
  http,
  type Address,
  type Chain,
  type PrivateKeyAccount,
  type PublicClient,
  type WalletClient,
  createPublicClient,
  createWalletClient,
  parseUnits,
  toHex
} from "viem"
import { afterAll, beforeAll, describe, expect, test } from "vitest"
import { paymasterTruthy, toNetwork } from "../../test/testSetup"
import { getBalance, getTestAccount, killNetwork, toTestClient } from "../../test/testUtils"
import type { MasterClient, NetworkConfig } from "../../test/testUtils"
import {
  type StartaleSmartAccount,
  toStartaleSmartAccount
} from "../account/toStartaleSmartAccount"
import { STARTALE_TOKEN_PAYMASTER } from "../account/utils/Constants"
import {
  type StartaleAccountClient,
  createSmartAccountClient
} from "./createSCSBundlerClient"
import {
  type SCSPaymasterClient,
  createSCSPaymasterClient,
  toSCSSponsoredPaymasterContext,
  toSCSTokenPaymasterContext
} from "./createSCSPaymasterClient"

// TODO: review, update and unskip the test

// NB These tests require ERC20 tokens to be available on testnet, so they are mostly skipped
describe.skipIf(!paymasterTruthy())("scs.paymaster", async () => {
  let network: NetworkConfig

  let chain: Chain
  let bundlerUrl: string
  let paymasterUrl: undefined | string
  let walletClient: WalletClient
  let testClient: MasterClient


  // Test utils
  let publicClient: PublicClient // testClient not available on public testnets
  let account: PrivateKeyAccount
  let recipientAddress: Address
  let smartAccountAddress: Address
  let paymaster: SCSPaymasterClient
  let smartAccount: StartaleSmartAccount
  let smartAccountClient: StartaleAccountClient

  const baseSepoliaUSDCAddress: Address =
    "0x036cbd53842c5426634e7929541ec2318f3dcf7e"
  const baseSepoliaDAIAddress: Address =
    "0x7683022d84f726a96c4a6611cd31dbf5409c0ac9"
  const soneiumMinatoASTRAddress: Address =
    "0x26e6f7c7047252DdE3dcBF26AA492e6a264Db655"

  beforeAll(async () => {
    network = await toNetwork("TESTNET_FROM_ENV_VARS")

    chain = network.chain
    bundlerUrl = network.bundlerUrl
    paymasterUrl = network.paymasterUrl
    account = network.account as PrivateKeyAccount

    testClient = toTestClient(chain, getTestAccount(5))

    recipientAddress = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" // vitalik.eth

    walletClient = createWalletClient({
      account,
      chain,
      transport: http()
    })

    publicClient = createPublicClient({
      chain,
      transport: http()
    })

    paymaster = createSCSPaymasterClient({
      transport: http(paymasterUrl)
    })

    smartAccount = await toStartaleSmartAccount({
      signer: account,
      chain,
      transport: http()
    })

    smartAccountAddress = await smartAccount.getAddress()

    smartAccountClient = createSmartAccountClient({
      account: smartAccount,
      transport: http(bundlerUrl),
      paymaster,
      paymasterContext: toSCSSponsoredPaymasterContext
      ({
        paymasterId: "sudo"
      }),
      client: publicClient
    })
  })
  afterAll(async () => {
    await killNetwork([network?.rpcPort, network?.bundlerPort])
  })

  test("should have paymaster actions", async () => {
    expect(paymaster).toHaveProperty("getPaymasterData")
    expect(paymaster.getPaymasterData).toBeInstanceOf(Function)

    // SCS Paymaster has no getPaymasterStubData method, to ensure latency is kept low.
    expect(paymaster).not.toHaveProperty("getPaymasterStubData")
  })

  test.skip("should send a sponsored transaction", async () => {
    // Get initial balance
    const initialBalance = await publicClient.getBalance({
      address: smartAccountAddress
    })

    // Send user operation
    const hash = await smartAccountClient.sendTransaction({
      calls: [
        {
          to: recipientAddress,
          value: 1n
        }
      ]
    })

    // Wait for the transaction to be mined
    const { status } = await publicClient.waitForTransactionReceipt({ hash })
    expect(status).toBe("success")
    // Get final balance
    const finalBalance = await publicClient.getBalance({
      address: smartAccountAddress
    })

    // Check that the balance hasn't changed
    // No gas fees were paid, so the balance should have decreased only by 1n
    expect(finalBalance).toBe(initialBalance - 1n)
  })

  test.skip("should wait for a confirmed user operation receipt", async () => {
    const hash = await smartAccountClient.sendUserOperation({
      calls: [
        {
          to: recipientAddress,
          value: 1n
        }
      ]
    })

    const receipt = await smartAccountClient.waitForConfirmedUserOperationReceipt({
      hash
    })

    expect(receipt.success).toBe("true")
  })

  test.skip("should use token paymaster to pay for gas fees, use maxApproval, use sendUserOperation", async () => {
    const paymasterContext = toSCSTokenPaymasterContext({
      token: baseSepoliaUSDCAddress
    })
    const smartAccountClient = createSmartAccountClient({
      account: smartAccount,
      paymaster: createSCSPaymasterClient({ transport: http(paymasterUrl) }),
      paymasterContext,
      transport: http(bundlerUrl)
    })

    const initialBalance = await publicClient.getBalance({
      address: smartAccountAddress
    })

    const hash = await smartAccountClient.sendTokenPaymasterUserOp({
      calls: [
        {
          to: recipientAddress,
          value: 1n,
          data: "0x"
        }
      ],
      feeTokenAddress: baseSepoliaUSDCAddress
    })
    const receipt = await smartAccountClient.waitForUserOperationReceipt({ hash })

    expect(receipt.success).toBe("true")

    // Get final balance
    const finalBalance = await publicClient.getBalance({
      address: smartAccountAddress
    })

    // Check that the balance hasn't changed
    // No gas fees were paid, so the balance should have decreased only by 1n
    expect(finalBalance).toBe(initialBalance - 1n)
  })

  test.skip("should use token paymaster to pay for gas fees, use maxApproval, use sendTransaction", async () => {
    const paymasterContext = toSCSTokenPaymasterContext({
      token: baseSepoliaUSDCAddress
    })

    const smartAccountClient = createSmartAccountClient({
      account: smartAccount,
      paymaster: createSCSPaymasterClient({
        transport: http(paymasterUrl)
      }),
      paymasterContext,
      transport: http(bundlerUrl)
    })

    const initialBalance = await publicClient.getBalance({
      address: smartAccountAddress
    })

    const tokenPaymasterUserOp = await smartAccountClient.prepareTokenPaymasterUserOp({
      calls: [
        {
          to: recipientAddress,
          value: 1n,
          data: "0x"
        }
      ],
      feeTokenAddress: baseSepoliaUSDCAddress
    })

    const hash = await smartAccountClient.sendTransaction(tokenPaymasterUserOp)

    const receipt = await publicClient.waitForTransactionReceipt({ hash })

    expect(receipt.status).toBe("success")

    // Get final balance
    const finalBalance = await publicClient.getBalance({
      address: smartAccountAddress
    })

    // Check that the balance hasn't changed
    // No gas fees were paid, so the balance should have decreased only by 1n
    expect(finalBalance).toBe(initialBalance - 1n)
  })

  test.skip("should retrieve quotes from token paymaster", async () => {
    const tokenList = [soneiumMinatoASTRAddress]
    // Note: We need to send some ASTR to the smart account to prepare userOp because it will make gas estimation call.
    const userOp = await smartAccountClient.prepareUserOperation({
      calls: [
        {
          to: recipientAddress,
          value: 1n,
          data: "0x"
        }
      ]
    })

    // Todo: Update test cases later.
    const quote = await paymaster.getTokenPaymasterQuotes({ userOp, chainId: toHex(chain.id) })
    expect(quote.paymasterAddress.toLocaleLowerCase()).toBe(STARTALE_TOKEN_PAYMASTER.toLocaleLowerCase())
    expect(quote.feeQuotes).toBeInstanceOf(Array)
    expect(quote.unsupportedTokens).toBeInstanceOf(Array)

    expect(quote.feeQuotes[0].symbol).toBe("ASTR")
    expect(quote.feeQuotes[0].decimal).toBe(18)
    expect(quote.feeQuotes[0].tokenAddress).toBe(soneiumMinatoASTRAddress)
    expect(quote.feeQuotes[0].maxGasFee).toBeGreaterThan(0)
    expect(quote.feeQuotes[0].maxGasFeeUSD).toBeGreaterThan(0)
    expect(quote.feeQuotes[0].exchangeRate).toBeGreaterThan(0)
  })

  test.skip("should use token paymaster to pay for gas fees, use custom approval with token paymaster quotes", async () => {
    const paymasterContext = toSCSTokenPaymasterContext({
      token: baseSepoliaUSDCAddress
    })

    const smartAccountClient = createSmartAccountClient({
      account: smartAccount,
      paymaster: createSCSPaymasterClient({
        transport: http(paymasterUrl)
      }),
      paymasterContext,
      transport: http(bundlerUrl)
    })

    const usdcBalance = await getBalance(
      publicClient,
      smartAccountClient.account.address,
      baseSepoliaUSDCAddress
    )

    expect(usdcBalance).toBeGreaterThan(0n)

    const initialBalance = await publicClient.getBalance({
      address: smartAccountClient.account.address
    })

    const tokenList = [baseSepoliaUSDCAddress]
    const userOp = await smartAccountClient.prepareUserOperation({
      calls: [
        {
          to: recipientAddress,
          value: 1n,
          data: "0x"
        }
      ]
    })
    const quote = await paymaster.getTokenPaymasterQuotes({ userOp, chainId: toHex(chain.id) })
    const usdcFeeAmount = parseUnits(
      quote.feeQuotes[0].maxGasFee.toString(),
      quote.feeQuotes[0].decimal
    )

    const hash = await smartAccountClient.sendTokenPaymasterUserOp({
      calls: [
        {
          to: recipientAddress,
          value: 1n,
          data: "0x"
        }
      ],
      feeTokenAddress: baseSepoliaUSDCAddress,
      customApprovalAmount: usdcFeeAmount
    })

    const receipt = await smartAccountClient.waitForUserOperationReceipt({ hash })

    expect(receipt.success).toBe("true")

    const finalBalance = await publicClient.getBalance({
      address: smartAccountClient.account.address
    })

    expect(finalBalance).toBe(initialBalance - 1n)
  })

  test.skip("should retrieve all supported token addresses from the token paymaster", async () => {
    const paymasterContext = toSCSTokenPaymasterContext({
      token: soneiumMinatoASTRAddress
    })

    const smartAccountClient = createSmartAccountClient({
      account: smartAccount,
      paymaster: createSCSPaymasterClient({ transport: http(paymasterUrl) }),
      paymasterContext,
      transport: http(bundlerUrl),
      client: publicClient
    })

    const supportedTokens = await paymaster.getSupportedTokens(smartAccountClient)
    const supportedTokenAddresses = supportedTokens.map(
      (token) => token.tokenAddress
    )
    expect(supportedTokenAddresses).toContain(soneiumMinatoASTRAddress)
  })
})
