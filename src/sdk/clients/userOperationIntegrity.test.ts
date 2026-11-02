import {
  type Address,
  type Hex,
  createPublicClient,
  custom,
  encodeFunctionData,
  erc20Abi,
  getAddress,
  numberToHex,
  pad
} from "viem"
import {
  createBundlerClient,
  createPaymasterClient
} from "viem/account-abstraction"
import { privateKeyToAccount } from "viem/accounts"
import { baseSepolia } from "viem/chains"
import { describe, expect, test } from "vitest"
import { toStartaleSmartAccount } from "../account/toStartaleSmartAccount"
import type { AnyData } from "../modules/utils/Types"
import { createSmartAccountClient } from "./createSCSBundlerClient"
import { createSCSPaymasterClient } from "./createSCSPaymasterClient"
import {
  UserOperationTamperedError,
  guardPaymaster
} from "./userOperationIntegrity"

// Offline: the public RPC, bundler and paymaster are all mocked, so nothing is
// sent to a network.

const OWNER = privateKeyToAccount(
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
)
const ACCOUNT_ADDRESS: Address = "0x1111111111111111111111111111111111111111"
const PAYMASTER: Address = "0x2222222222222222222222222222222222222222"
const ATTACKER: Address = "0x000000000000000000000000000000000000dEaD"
const USDC: Address = "0x036CbD53842c5426634e7929541eC2318f3dCF7e"
const NONCE_FROM_CHAIN = 5n

const CALLS = [{ to: OWNER.address, value: 0n, data: "0x" as Hex }]
const FEES = { maxFeePerGas: 1_000_000n, maxPriorityFeePerGas: 1_000n }

const makePublicClient = ({ deployed = true } = {}) =>
  createPublicClient({
    chain: baseSepolia,
    transport: custom({
      async request({ method }) {
        if (method === "eth_chainId") return numberToHex(baseSepolia.id)
        if (method === "eth_getCode") return deployed ? "0x6001" : "0x"
        // EntryPoint.getNonce
        if (method === "eth_call") return pad(numberToHex(NONCE_FROM_CHAIN))
        throw new Error(`unexpected public rpc ${method}`)
      }
    })
  })

const makeBundlerTransport = (
  sent: AnyData[],
  paymasterRpc?: (method: string, params: AnyData) => AnyData
) =>
  custom({
    async request({ method, params }) {
      if (method === "eth_chainId") return numberToHex(baseSepolia.id)
      if (method === "eth_estimateUserOperationGas")
        return {
          preVerificationGas: "0xc350",
          verificationGasLimit: "0x186a0",
          callGasLimit: "0x186a0",
          paymasterVerificationGasLimit: "0x186a0",
          paymasterPostOpGasLimit: "0x0"
        }
      if (method === "eth_sendUserOperation") {
        sent.push(params[0])
        return `0x${"11".repeat(32)}`
      }
      if (paymasterRpc && method.startsWith("pm_"))
        return paymasterRpc(method, params)
      throw new Error(`unexpected bundler rpc ${method}`)
    }
  })

const makeAccount = async ({ deployed = true } = {}) => {
  const publicClient = makePublicClient({ deployed })
  const account = await toStartaleSmartAccount({
    signer: OWNER,
    chain: baseSepolia,
    transport: custom(publicClient),
    index: 0n,
    ...(deployed && { accountAddress: ACCOUNT_ADDRESS })
  })
  return { account, publicClient }
}

const STUB = {
  paymaster: PAYMASTER,
  paymasterData: "0x" as Hex,
  paymasterVerificationGasLimit: 100_000n,
  paymasterPostOpGasLimit: 0n
}
const DATA = { paymaster: PAYMASTER, paymasterData: "0xabcd" as Hex }

type PaymasterResponse = (request: AnyData) => AnyData

const makePaymaster = (
  stub: PaymasterResponse = () => STUB,
  data: PaymasterResponse = () => DATA
) => ({
  getPaymasterStubData: async (request: AnyData) => stub(request),
  getPaymasterData: async (request: AnyData) => data(request)
})

/**
 * Sends the same UserOperation through the SDK client and through plain viem
 * (no checks), and returns what each one sent to the bundler.
 */
const sendWithSdkAndViem = async ({
  paymaster,
  args = {},
  deployed = true,
  userOperation
}: {
  paymaster?: AnyData
  args?: AnyData
  deployed?: boolean
  userOperation?: AnyData
}) => {
  const sdkSent: AnyData[] = []
  const viemSent: AnyData[] = []
  const { account, publicClient } = await makeAccount({ deployed })

  const sdkClient = createSmartAccountClient({
    account,
    client: publicClient,
    transport: makeBundlerTransport(sdkSent),
    paymaster,
    userOperation
  })
  const viemClient = createBundlerClient({
    account,
    client: publicClient,
    transport: makeBundlerTransport(viemSent),
    paymaster,
    userOperation
  })

  const params = { calls: CALLS, ...FEES, ...args }
  await sdkClient.sendUserOperation(params)
  await viemClient.sendUserOperation(params)
  return { sdk: sdkSent[0], viem: viemSent[0] }
}

// Which check caught it: each layer must work on its own, so tests assert the
// layer and not only that something threw.
const PAYMASTER_CHECK = "Paymaster response"
const FEE_HOOK_CHECK = "Fee estimation hook"
const SIGNING_CHECK = "The signUserOperation request"

const expectTampered = async (
  promise: Promise<unknown>,
  field: string,
  source: string
) => {
  const error = await promise.then(
    () => undefined,
    (e) => e
  )
  expect(error).toBeInstanceOf(UserOperationTamperedError)
  expect(error.field).toBe(field)
  expect(error.shortMessage).toMatch(new RegExp(`^${source} changed`))
}

describe("userOperationIntegrity: honest paymasters behave exactly as before", () => {
  test("two-phase paymaster (stub + data)", async () => {
    const { sdk, viem } = await sendWithSdkAndViem({
      paymaster: makePaymaster()
    })
    expect(sdk).toEqual(viem)
    expect(sdk.paymasterData).toBe("0xabcd")
  })

  test("single-phase response with gas fields covered by the paymaster signature", async () => {
    const withGas = () => ({
      ...DATA,
      isFinal: true,
      callGasLimit: 123_456n,
      verificationGasLimit: 234_567n,
      preVerificationGas: 34_567n,
      paymasterVerificationGasLimit: 45_678n,
      paymasterPostOpGasLimit: 5_678n
    })
    const { sdk, viem } = await sendWithSdkAndViem({
      paymaster: makePaymaster(withGas, withGas)
    })
    expect(sdk).toEqual(viem)
    expect(BigInt(sdk.callGasLimit)).toBe(123_456n)
  })

  test("paymaster that echoes the whole request back, in RPC encoding", async () => {
    const echo =
      (base: AnyData): PaymasterResponse =>
      (request) => ({
        ...base,
        sender: getAddress(request.sender).toLowerCase(),
        nonce: numberToHex(request.nonce),
        callData: request.callData.toUpperCase().replace("0X", "0x"),
        chainId: numberToHex(request.chainId),
        factory: request.factory ?? null,
        factoryData: request.factoryData ?? null
      })
    const { sdk, viem } = await sendWithSdkAndViem({
      paymaster: makePaymaster(echo(STUB), echo(DATA))
    })
    expect(sdk).toEqual(viem)
  })

  test("paymaster with only getPaymasterData", async () => {
    const { sdk, viem } = await sendWithSdkAndViem({
      paymaster: { getPaymasterData: async () => ({ ...STUB, ...DATA }) }
    })
    expect(sdk).toEqual(viem)
  })

  test("no paymaster, nonce read from chain", async () => {
    const { sdk, viem } = await sendWithSdkAndViem({})
    expect(sdk).toEqual(viem)
    expect(BigInt(sdk.nonce)).toBe(NONCE_FROM_CHAIN)
  })

  test("undeployed account sends factory args", async () => {
    const { sdk, viem } = await sendWithSdkAndViem({
      paymaster: makePaymaster(),
      deployed: false
    })
    expect(sdk).toEqual(viem)
    expect(sdk.factory).toBeDefined()
  })

  test("factory passed without factoryData (viem falls back to the account)", async () => {
    const { account } = await makeAccount({ deployed: false })
    const { factory } = await account.getFactoryArgs()
    const { sdk, viem } = await sendWithSdkAndViem({
      paymaster: makePaymaster(),
      deployed: false,
      args: { factory }
    })
    expect(sdk).toEqual(viem)
  })

  test("fee hook with the caller's own stale callData: same result as viem", async () => {
    // viem re-spreads the caller's parameters after a fee hook, so the caller's
    // `callData` wins over the encoded `calls`. That value comes from the
    // caller, not a third party, so it must not be rejected.
    const { account } = await makeAccount()
    const staleCallData = await account.encodeCalls([
      { to: USDC, value: 0n, data: "0x" }
    ])
    const { sdk, viem } = await sendWithSdkAndViem({
      paymaster: makePaymaster(),
      args: {
        callData: staleCallData,
        maxFeePerGas: undefined,
        maxPriorityFeePerGas: undefined
      },
      userOperation: { estimateFeesPerGas: async () => FEES }
    })
    expect(sdk).toEqual(viem)
  })

  test("fee hook (Startale App pattern) with calls only", async () => {
    const { sdk, viem } = await sendWithSdkAndViem({
      paymaster: makePaymaster(),
      args: { maxFeePerGas: undefined, maxPriorityFeePerGas: undefined },
      userOperation: { estimateFeesPerGas: async () => FEES }
    })
    expect(sdk).toEqual(viem)
  })

  test("fee hook that echoes the request back", async () => {
    const { sdk, viem } = await sendWithSdkAndViem({
      paymaster: makePaymaster(),
      args: { maxFeePerGas: undefined, maxPriorityFeePerGas: undefined },
      userOperation: {
        estimateFeesPerGas: async ({ userOperation }: AnyData) => ({
          ...userOperation,
          ...FEES
        })
      }
    })
    expect(sdk).toEqual(viem)
  })

  test("a userOperation config without a fee hook is left as-is", async () => {
    // Wrapping it would change which fee estimation viem falls back to.
    const { account, publicClient } = await makeAccount()
    const client = createSmartAccountClient({
      account,
      client: publicClient,
      transport: makeBundlerTransport([]),
      userOperation: {}
    })
    expect(client.userOperation).toEqual({})
  })

  test("prepareUserOperation output matches viem, and can be spread into sendUserOperation", async () => {
    const { account, publicClient } = await makeAccount()
    const paymaster = makePaymaster()
    const sdkClient = createSmartAccountClient({
      account,
      client: publicClient,
      transport: makeBundlerTransport([]),
      paymaster
    })
    const viemClient = createBundlerClient({
      account,
      client: publicClient,
      transport: makeBundlerTransport([]),
      paymaster
    })
    const params = { calls: CALLS, ...FEES }
    const sdkPrepared = await sdkClient.prepareUserOperation(params)
    const viemPrepared = await viemClient.prepareUserOperation(params)
    const { signature: _sdkSignature, ...sdkRest } = sdkPrepared as AnyData
    const { signature: _viemSignature, ...viemRest } = viemPrepared as AnyData
    expect(sdkRest).toEqual(viemRest)
    expect("account" in sdkPrepared).toBe("account" in viemPrepared)

    // Startale App pattern: prepare first, then send the prepared fields.
    const { signature: _stub, ...prepared } = sdkPrepared as AnyData
    await expect(
      sdkClient.sendUserOperation({ ...params, ...prepared })
    ).resolves.toBeDefined()
  })

  test("createSCSPaymasterClient still returns an honest upstream response", async () => {
    const sent: AnyData[] = []
    const { account, publicClient } = await makeAccount()
    const paymaster = createSCSPaymasterClient({
      transport: makeBundlerTransport([], (method) =>
        method === "pm_getPaymasterStubData"
          ? {
              paymaster: PAYMASTER,
              paymasterData: "0x",
              paymasterVerificationGasLimit: "0x186a0",
              paymasterPostOpGasLimit: "0x0"
            }
          : { paymaster: PAYMASTER, paymasterData: "0xabcd" }
      )
    })
    const client = createBundlerClient({
      account,
      client: publicClient,
      transport: makeBundlerTransport(sent),
      paymaster
    })
    await client.sendUserOperation({ calls: CALLS, ...FEES })
    expect(sent[0].paymasterData).toBe("0xabcd")
  })
})

describe("userOperationIntegrity: tampering throws before anything is signed or sent", () => {
  const evilCallData = async () => {
    const { account } = await makeAccount()
    return account.encodeCalls([
      {
        to: USDC,
        value: 0n,
        data: encodeFunctionData({
          abi: erc20Abi,
          functionName: "transfer",
          args: [ATTACKER, 10n ** 12n]
        })
      }
    ])
  }

  const sendThroughSdk = async ({
    paymaster,
    args = {},
    deployed = true,
    userOperation
  }: {
    paymaster?: AnyData
    args?: AnyData
    deployed?: boolean
    userOperation?: AnyData
  }) => {
    const sent: AnyData[] = []
    const { account, publicClient } = await makeAccount({ deployed })
    const client = createSmartAccountClient({
      account,
      client: publicClient,
      transport: makeBundlerTransport(sent),
      paymaster,
      userOperation
    })
    const result = client.sendUserOperation({
      calls: CALLS,
      ...FEES,
      ...args
    })
    return { result, sent }
  }

  const injections: [string, () => Promise<AnyData>][] = [
    ["callData", async () => ({ callData: await evilCallData() })],
    ["sender", async () => ({ sender: ATTACKER })],
    ["nonce", async () => ({ nonce: "0x99" })],
    ["chainId", async () => ({ chainId: 1 })],
    ["factory", async () => ({ factory: ATTACKER })],
    ["factoryData", async () => ({ factoryData: "0xdeadbeef" })],
    ["initCode", async () => ({ initCode: "0xdeadbeef" })],
    [
      "authorization",
      async () => ({
        authorization: {
          address: ATTACKER,
          chainId: baseSepolia.id,
          nonce: 0
        }
      })
    ]
  ]

  for (const [field, inject] of injections) {
    test(`stub response injecting ${field}`, async () => {
      const extra = await inject()
      const { result, sent } = await sendThroughSdk({
        paymaster: makePaymaster(() => ({ ...STUB, ...extra }))
      })
      await expectTampered(result, field, PAYMASTER_CHECK)
      expect(sent).toHaveLength(0)
    })

    test(`final paymaster data injecting ${field}`, async () => {
      const extra = await inject()
      const { result, sent } = await sendThroughSdk({
        paymaster: makePaymaster(undefined, () => ({ ...DATA, ...extra }))
      })
      await expectTampered(result, field, PAYMASTER_CHECK)
      expect(sent).toHaveLength(0)
    })

    // `authorization` and `initCode` are only covered by the paymaster check,
    // so the `paymaster: true` branch is tested for every field.
    test(`paymaster: true (bundler serves pm_* methods) injecting ${field}`, async () => {
      const extra = await inject()
      const sent: AnyData[] = []
      const { account, publicClient } = await makeAccount()
      const client = createSmartAccountClient({
        account,
        client: publicClient,
        transport: makeBundlerTransport(sent, (method) =>
          method === "pm_getPaymasterStubData"
            ? { ...STUB, paymasterVerificationGasLimit: "0x186a0" }
            : { ...DATA, ...extra }
        ),
        paymaster: true
      })
      await expectTampered(
        client.sendUserOperation({ calls: CALLS, ...FEES }),
        field,
        PAYMASTER_CHECK
      )
      expect(sent).toHaveLength(0)
    })

    // No paymaster: only the fee hook check can catch this.
    test(`fee hook injecting ${field}`, async () => {
      const extra = await inject()
      const { result, sent } = await sendThroughSdk({
        args: { maxFeePerGas: undefined, maxPriorityFeePerGas: undefined },
        userOperation: {
          estimateFeesPerGas: async () => ({ ...FEES, ...extra })
        }
      })
      await expectTampered(result, field, FEE_HOOK_CHECK)
      expect(sent).toHaveLength(0)
    })
  }

  test("paymaster passed per call is checked too", async () => {
    const evil = await evilCallData()
    const { result, sent } = await sendThroughSdk({
      args: {
        paymaster: makePaymaster(undefined, () => ({ ...DATA, callData: evil }))
      }
    })
    await expectTampered(result, "callData", PAYMASTER_CHECK)
    expect(sent).toHaveLength(0)
  })

  test("createSCSPaymasterClient rejects a tampered upstream response with plain viem", async () => {
    const evil = await evilCallData()
    const sent: AnyData[] = []
    const { account, publicClient } = await makeAccount()
    const paymaster = createSCSPaymasterClient({
      transport: makeBundlerTransport([], (method) =>
        method === "pm_getPaymasterStubData"
          ? {
              paymaster: PAYMASTER,
              paymasterData: "0x",
              paymasterVerificationGasLimit: "0x186a0",
              paymasterPostOpGasLimit: "0x0"
            }
          : { paymaster: PAYMASTER, paymasterData: "0xabcd", callData: evil }
      )
    })
    const client = createBundlerClient({
      account,
      client: publicClient,
      transport: makeBundlerTransport(sent),
      paymaster
    })
    await expectTampered(
      client.sendUserOperation({ calls: CALLS, ...FEES }),
      "callData",
      PAYMASTER_CHECK
    )
    expect(sent).toHaveLength(0)
  })

  test("guardPaymaster around viem's createPaymasterClient, with plain viem", async () => {
    // The fix for apps that use viem's createBundlerClient directly.
    const evil = await evilCallData()
    const sent: AnyData[] = []
    const { account, publicClient } = await makeAccount()
    const paymaster = createPaymasterClient({
      transport: makeBundlerTransport([], (method) =>
        method === "pm_getPaymasterStubData"
          ? { ...STUB, paymasterVerificationGasLimit: "0x186a0" }
          : { ...DATA, callData: evil }
      )
    })
    const client = createBundlerClient({
      account,
      client: publicClient,
      transport: makeBundlerTransport(sent),
      paymaster: guardPaymaster(paymaster, publicClient)
    })
    await expectTampered(
      client.sendUserOperation({ calls: CALLS, ...FEES }),
      "callData",
      PAYMASTER_CHECK
    )
    expect(sent).toHaveLength(0)
  })

  test("without guardPaymaster, plain viem signs and sends the tampered callData", async () => {
    // Documents the gap: the SDK's checks don't run on plain viem clients, so
    // apps must wrap their paymaster (see the test above).
    const evil = await evilCallData()
    const sent: AnyData[] = []
    const { account, publicClient } = await makeAccount()
    const client = createBundlerClient({
      account,
      client: publicClient,
      transport: makeBundlerTransport(sent),
      paymaster: createPaymasterClient({
        transport: makeBundlerTransport([], (method) =>
          method === "pm_getPaymasterStubData"
            ? { ...STUB, paymasterVerificationGasLimit: "0x186a0" }
            : { ...DATA, callData: evil }
        )
      })
    })
    await client.sendUserOperation({ calls: CALLS, ...FEES })
    expect(sent[0].callData).toBe(evil)
  })
})

describe("signUserOperation pins the account's chain", () => {
  const userOperation = {
    callData: "0x" as Hex,
    callGasLimit: 1n,
    maxFeePerGas: 1n,
    maxPriorityFeePerGas: 1n,
    nonce: 0n,
    preVerificationGas: 1n,
    signature: "0x" as Hex,
    verificationGasLimit: 1n
  }

  test("same signature with or without a matching chainId", async () => {
    const { account } = await makeAccount()
    const withoutChainId = await account.signUserOperation(userOperation)
    expect(
      await account.signUserOperation({
        ...userOperation,
        chainId: baseSepolia.id
      })
    ).toBe(withoutChainId)
    expect(
      await account.signUserOperation({
        ...userOperation,
        chainId: numberToHex(baseSepolia.id) as AnyData
      })
    ).toBe(withoutChainId)
  })

  test("throws UserOperationTamperedError for a different chainId", async () => {
    const { account } = await makeAccount()
    const result = account.signUserOperation({ ...userOperation, chainId: 1 })
    await expectTampered(result, "chainId", SIGNING_CHECK)
    // The original message is kept for anyone matching on it.
    await expect(
      account.signUserOperation({ ...userOperation, chainId: 1 })
    ).rejects.toThrow(/does not match the account's chain/)
  })
})
