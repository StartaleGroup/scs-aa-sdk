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
  custom,
  parseUnits,
  toHex
} from "viem"
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  vi
} from "vitest"
import { paymasterTruthy, toNetwork } from "../../test/testSetup"
import {
  getBalance,
  getTestAccount,
  killNetwork,
  toTestClient
} from "../../test/testUtils"
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
      paymasterContext: toSCSSponsoredPaymasterContext({
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

    // SCS Paymaster exposes getPaymasterStubData to support the two-phase flow (calculateGasLimits: false)
    expect(paymaster).toHaveProperty("getPaymasterStubData")
    expect(paymaster.getPaymasterStubData).toBeInstanceOf(Function)
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

    const receipt =
      await smartAccountClient.waitForConfirmedUserOperationReceipt({
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
    const receipt = await smartAccountClient.waitForUserOperationReceipt({
      hash
    })

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

    const tokenPaymasterUserOp =
      await smartAccountClient.prepareTokenPaymasterUserOp({
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
    const quote = await paymaster.getTokenPaymasterQuotes({
      userOp,
      chainId: toHex(chain.id)
    })
    expect(quote.paymasterAddress.toLocaleLowerCase()).toBe(
      STARTALE_TOKEN_PAYMASTER.toLocaleLowerCase()
    )
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
    const quote = await paymaster.getTokenPaymasterQuotes({
      userOp,
      chainId: toHex(chain.id)
    })
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

    const receipt = await smartAccountClient.waitForUserOperationReceipt({
      hash
    })

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

    const supportedTokens =
      await paymaster.getSupportedTokens(smartAccountClient)
    const supportedTokenAddresses = supportedTokens.map(
      (token) => token.tokenAddress
    )
    expect(supportedTokenAddresses).toContain(soneiumMinatoASTRAddress)
  })
})

// ─── Unit tests (no network required) ────────────────────────────────────────

const MOCK_PAYMASTER_ADDRESS =
  "0x0000007d3cd3002cb096568ba3cc1319c03f2a55" as Address
const MOCK_STUB_RESPONSE = {
  paymaster: MOCK_PAYMASTER_ADDRESS,
  paymasterData: "0xdeadbeef" as Hex,
  paymasterVerificationGasLimit: "0x30d40", // 200000
  paymasterPostOpGasLimit: "0x186a0" // 100000
}
const MOCK_DATA_RESPONSE = {
  paymaster: MOCK_PAYMASTER_ADDRESS,
  paymasterData: "0xfinaldata" as Hex
}
const MINIMAL_STUB_PARAMS = {
  chainId: 1946,
  entryPointAddress: "0x0000000071727De22E5E9d8BAf0edAc6f37da032" as Address,
  sender: "0x0000000000000000000000000000000000000001" as Address,
  callData: "0x" as Hex,
  nonce: 0n,
  maxFeePerGas: 1n,
  maxPriorityFeePerGas: 1n,
  callGasLimit: 0n,
  verificationGasLimit: 0n,
  preVerificationGas: 0n
}

describe("toSCSSponsoredPaymasterContext", () => {
  test("defaults calculateGasLimits to false", () => {
    const ctx = toSCSSponsoredPaymasterContext()
    expect(ctx.calculateGasLimits).toBe(false)
  })

  test("allows overriding calculateGasLimits to true", () => {
    const ctx = toSCSSponsoredPaymasterContext({ calculateGasLimits: true })
    expect(ctx.calculateGasLimits).toBe(true)
  })

  test("preserves paymasterId alongside default calculateGasLimits", () => {
    const ctx = toSCSSponsoredPaymasterContext({ paymasterId: "pm_test" })
    expect(ctx.calculateGasLimits).toBe(false)
    expect(ctx.paymasterId).toBe("pm_test")
  })
})

describe("toSCSTokenPaymasterContext", () => {
  const tokenAddress = "0x26e6f7c7047252DdE3dcBF26AA492e6a264Db655" as Address

  test("defaults calculateGasLimits to false", () => {
    const ctx = toSCSTokenPaymasterContext({ token: tokenAddress })
    expect(ctx.calculateGasLimits).toBe(false)
  })

  test("allows overriding calculateGasLimits to true", () => {
    const ctx = toSCSTokenPaymasterContext({
      token: tokenAddress,
      calculateGasLimits: true
    })
    expect(ctx.calculateGasLimits).toBe(true)
  })

  test("sets token address", () => {
    const ctx = toSCSTokenPaymasterContext({ token: tokenAddress })
    expect(ctx.token).toBe(tokenAddress)
  })
})

describe("createSCSPaymasterClient - getPaymasterStubData routing", () => {
  let mockRequest: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockRequest = vi.fn(async ({ method }: { method: string }) => {
      if (method === "pm_getPaymasterStubData") return MOCK_STUB_RESPONSE
      if (method === "pm_getPaymasterData") return MOCK_DATA_RESPONSE
      return null
    })
  })

  test("calls pm_getPaymasterStubData when calculateGasLimits is false", async () => {
    const client = createSCSPaymasterClient({
      transport: custom({ request: mockRequest })
    })

    await client.getPaymasterStubData({
      ...MINIMAL_STUB_PARAMS,
      context: { calculateGasLimits: false, paymasterId: "pm_test" }
    })

    const methods = mockRequest.mock.calls.map(
      (call: [{ method: string }]) => call[0].method
    )
    expect(methods).toContain("pm_getPaymasterStubData")
    expect(methods).not.toContain("pm_getPaymasterData")
  })

  test("calls pm_getPaymasterData when calculateGasLimits is true (single-phase)", async () => {
    const client = createSCSPaymasterClient({
      transport: custom({ request: mockRequest })
    })

    await client.getPaymasterStubData({
      ...MINIMAL_STUB_PARAMS,
      context: { calculateGasLimits: true, paymasterId: "pm_test" }
    })

    const methods = mockRequest.mock.calls.map(
      (call: [{ method: string }]) => call[0].method
    )
    expect(methods).toContain("pm_getPaymasterData")
    expect(methods).not.toContain("pm_getPaymasterStubData")
  })

  test("calls pm_getPaymasterStubData when context is undefined (default is false)", async () => {
    const client = createSCSPaymasterClient({
      transport: custom({ request: mockRequest })
    })

    await client.getPaymasterStubData({
      ...MINIMAL_STUB_PARAMS,
      context: undefined
    })

    const methods = mockRequest.mock.calls.map(
      (call: [{ method: string }]) => call[0].method
    )
    expect(methods).toContain("pm_getPaymasterStubData")
    expect(methods).not.toContain("pm_getPaymasterData")
  })

  test("stub response includes paymasterVerificationGasLimit and paymasterPostOpGasLimit", async () => {
    const client = createSCSPaymasterClient({
      transport: custom({ request: mockRequest })
    })

    const result = await client.getPaymasterStubData({
      ...MINIMAL_STUB_PARAMS,
      context: { calculateGasLimits: false, paymasterId: "pm_test" }
    })

    expect(result.paymasterVerificationGasLimit).toBeDefined()
    expect(result.paymasterPostOpGasLimit).toBeDefined()
  })
})
