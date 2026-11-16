import {
  type Address,
  type Hex,
  concat,
  decodeFunctionData,
  encodeAbiParameters,
  parseAbi
} from "viem"
import { describe, expect, test, vi } from "vitest"
import { uninstallFallback } from "./uninstallFallback"
import { uninstallModule } from "./uninstallModule"
import { uninstallModules } from "./uninstallModules"

// Offline: getAction() picks up `sendUserOperation` from the client and
// `readContract` from the account's public client, so no RPC or bundler is
// involved.
const ACCOUNT: Address = "0x1111111111111111111111111111111111111111"
const SENTINEL: Address = "0x0000000000000000000000000000000000000001"
const VALIDATOR_A: Address = "0x2222222222222222222222222222222222222222"
const VALIDATOR_B: Address = "0x3333333333333333333333333333333333333333"
const EXECUTOR_A: Address = "0x4444444444444444444444444444444444444444"
const EXECUTOR_B: Address = "0x5555555555555555555555555555555555555555"
const FALLBACK: Address = "0x6666666666666666666666666666666666666666"
const HOOK: Address = "0x7777777777777777777777777777777777777777"
const INIT_DATA: Hex = "0x1111"
const DE_INIT_DATA: Hex = "0x2222"
const SELECTOR: Hex = "0x12345678"
const FALLBACK_DE_INIT_DATA: Hex = concat([SELECTOR, DE_INIT_DATA])

const accountAbi = parseAbi([
  "function uninstallModule(uint256 moduleTypeId, address module, bytes deInitData)",
  "function uninstallFallback(uint256 moduleTypeId, address module, bytes deInitData)"
])

const prevAndData = (prev: Address, data: Hex) =>
  encodeAbiParameters(
    [
      { name: "prev", type: "address" },
      { name: "disableModuleData", type: "bytes" }
    ],
    [prev, data]
  )

type SentUserOperation = { calls: { to: Address; data: Hex }[] }
type Read = { address: Address; functionName: string }

const makeClient = () => {
  const readContract = vi.fn(async ({ functionName }: Read) =>
    functionName === "getValidatorsPaginated"
      ? [[VALIDATOR_A, VALIDATOR_B], SENTINEL]
      : [[EXECUTOR_A, EXECUTOR_B], SENTINEL]
  )
  const sendUserOperation = vi.fn(
    async (_args: SentUserOperation) => "0x01" as Hex
  )
  const client = {
    account: { address: ACCOUNT, type: "smart", client: { readContract } },
    sendUserOperation
  } as unknown as Parameters<typeof uninstallModule>[0]
  return { client, readContract, sendUserOperation }
}

const sentCalls = (
  sendUserOperation: ReturnType<typeof makeClient>["sendUserOperation"]
) =>
  sendUserOperation.mock.calls[0][0].calls.map((call) => {
    const { functionName, args } = decodeFunctionData({
      abi: accountAbi,
      data: call.data
    })
    return [functionName, ...args]
  })

describe("uninstallModule", () => {
  test("sends the module's deInitData as disableModuleData, not its initData", async () => {
    const { client, sendUserOperation } = makeClient()
    await uninstallModule(client, {
      module: {
        type: "validator",
        address: VALIDATOR_B,
        initData: INIT_DATA,
        deInitData: DE_INIT_DATA
      }
    })
    expect(sentCalls(sendUserOperation)).toEqual([
      [
        "uninstallModule",
        1n,
        VALIDATOR_B,
        prevAndData(VALIDATOR_A, DE_INIT_DATA)
      ]
    ])
  })

  test("sends empty disableModuleData when no deInitData is given", async () => {
    const { client, sendUserOperation } = makeClient()
    await uninstallModule(client, {
      module: { type: "validator", address: VALIDATOR_A, initData: INIT_DATA }
    })
    expect(sentCalls(sendUserOperation)).toEqual([
      ["uninstallModule", 1n, VALIDATOR_A, prevAndData(SENTINEL, "0x")]
    ])
  })

  test("executor: prev comes from the installed executors", async () => {
    const { client, readContract, sendUserOperation } = makeClient()
    await uninstallModule(client, {
      module: {
        type: "executor",
        address: EXECUTOR_B,
        deInitData: DE_INIT_DATA
      }
    })
    expect(readContract).toHaveBeenCalledOnce()
    expect(readContract.mock.calls[0][0]).toMatchObject({
      address: ACCOUNT,
      functionName: "getExecutorsPaginated"
    })
    expect(sentCalls(sendUserOperation)).toEqual([
      ["uninstallModule", 2n, EXECUTOR_B, prevAndData(EXECUTOR_A, DE_INIT_DATA)]
    ])
  })

  test("reads the installed modules of the account it uninstalls from", async () => {
    const { client, sendUserOperation } = makeClient()
    const OTHER: Address = "0x8888888888888888888888888888888888888888"
    const readContract = vi.fn(async (_read: Read) => [
      [VALIDATOR_B, VALIDATOR_A],
      SENTINEL
    ])
    const account = { address: OTHER, type: "smart", client: { readContract } }
    await uninstallModule(client, {
      account: account as unknown as typeof client.account,
      module: { type: "validator", address: VALIDATOR_A }
    })
    expect(readContract.mock.calls[0][0].address).toBe(OTHER)
    expect(sentCalls(sendUserOperation)).toEqual([
      ["uninstallModule", 1n, VALIDATOR_A, prevAndData(VALIDATOR_B, "0x")]
    ])
  })

  test("fallback: deInitData starts with the selector and is sent as is", async () => {
    const { client, readContract, sendUserOperation } = makeClient()
    await uninstallModule(client, {
      module: {
        type: "fallback",
        address: FALLBACK,
        deInitData: FALLBACK_DE_INIT_DATA
      }
    })
    expect(readContract).not.toHaveBeenCalled()
    expect(sentCalls(sendUserOperation)).toEqual([
      ["uninstallModule", 3n, FALLBACK, FALLBACK_DE_INIT_DATA]
    ])
  })

  test("fallback: deInitData without a selector is rejected", async () => {
    const { client, sendUserOperation } = makeClient()
    await expect(
      uninstallModule(client, {
        module: { type: "fallback", address: FALLBACK }
      })
    ).rejects.toThrow("4-byte selector")
    expect(sendUserOperation).not.toHaveBeenCalled()
  })

  test("hook: deInitData is sent as is", async () => {
    const { client, readContract, sendUserOperation } = makeClient()
    await uninstallModule(client, {
      module: { type: "hook", address: HOOK, deInitData: DE_INIT_DATA }
    })
    expect(readContract).not.toHaveBeenCalled()
    expect(sentCalls(sendUserOperation)).toEqual([
      ["uninstallModule", 4n, HOOK, DE_INIT_DATA]
    ])
  })
})

describe("uninstallModules", () => {
  test("encodes each module's deInitData for its type", async () => {
    const { client, sendUserOperation } = makeClient()
    await uninstallModules(client, {
      modules: [
        { type: "validator", address: VALIDATOR_B, deInitData: DE_INIT_DATA },
        { type: "executor", address: EXECUTOR_A },
        {
          type: "fallback",
          address: FALLBACK,
          deInitData: FALLBACK_DE_INIT_DATA
        },
        { type: "hook", address: HOOK, deInitData: DE_INIT_DATA }
      ]
    })
    expect(sentCalls(sendUserOperation)).toEqual([
      [
        "uninstallModule",
        1n,
        VALIDATOR_B,
        prevAndData(VALIDATOR_A, DE_INIT_DATA)
      ],
      ["uninstallModule", 2n, EXECUTOR_A, prevAndData(SENTINEL, "0x")],
      ["uninstallModule", 3n, FALLBACK, FALLBACK_DE_INIT_DATA],
      ["uninstallModule", 4n, HOOK, DE_INIT_DATA]
    ])
  })

  test("prev accounts for modules removed earlier in the batch", async () => {
    const { client, readContract, sendUserOperation } = makeClient()
    await uninstallModules(client, {
      modules: [
        { type: "executor", address: EXECUTOR_A },
        { type: "executor", address: EXECUTOR_B }
      ]
    })
    expect(readContract).toHaveBeenCalledOnce()
    // Once EXECUTOR_A is removed, EXECUTOR_B follows the sentinel.
    expect(sentCalls(sendUserOperation)).toEqual([
      ["uninstallModule", 2n, EXECUTOR_A, prevAndData(SENTINEL, "0x")],
      ["uninstallModule", 2n, EXECUTOR_B, prevAndData(SENTINEL, "0x")]
    ])
  })

  test("a fallback without a selector is rejected", async () => {
    const { client, sendUserOperation } = makeClient()
    await expect(
      uninstallModules(client, {
        modules: [{ type: "fallback", address: FALLBACK, deInitData: "0x" }]
      })
    ).rejects.toThrow("4-byte selector")
    expect(sendUserOperation).not.toHaveBeenCalled()
  })
})

describe("uninstallFallback", () => {
  test("calls uninstallModule(3, ...) with the module's deInitData, not its initData", async () => {
    const { client, sendUserOperation } = makeClient()
    await uninstallFallback(client, {
      module: {
        type: "fallback",
        address: FALLBACK,
        initData: INIT_DATA,
        deInitData: FALLBACK_DE_INIT_DATA
      }
    })
    expect(sentCalls(sendUserOperation)).toEqual([
      ["uninstallModule", 3n, FALLBACK, FALLBACK_DE_INIT_DATA]
    ])
  })

  test("deInitData without a selector is rejected", async () => {
    const { client, sendUserOperation } = makeClient()
    await expect(
      uninstallFallback(client, {
        module: { type: "fallback", address: FALLBACK }
      })
    ).rejects.toThrow("4-byte selector")
    expect(sendUserOperation).not.toHaveBeenCalled()
  })
})
