import {
  type Address,
  type Hex,
  decodeFunctionData,
  encodeAbiParameters,
  parseAbi
} from "viem"
import { describe, expect, test, vi } from "vitest"
// Through the index: uninstallModule.ts imports its helpers from it.
import { uninstallModule } from "."
import { uninstallFallback } from "./uninstallFallback"

// Offline: getAction() picks up `sendUserOperation` from the client and
// `readContract` from the account's public client, so no RPC or bundler is
// involved.
const ACCOUNT: Address = "0x1111111111111111111111111111111111111111"
const SENTINEL: Address = "0x0000000000000000000000000000000000000001"
const VALIDATOR_A: Address = "0x2222222222222222222222222222222222222222"
const VALIDATOR_B: Address = "0x3333333333333333333333333333333333333333"
const FALLBACK: Address = "0x4444444444444444444444444444444444444444"
const INIT_DATA: Hex = "0x1111"
const DE_INIT_DATA: Hex = "0x2222"

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

const makeClient = () => {
  const readContract = vi.fn(async () => [[VALIDATOR_A, VALIDATOR_B], SENTINEL])
  const sendUserOperation = vi.fn(
    async (_args: SentUserOperation) => "0x01" as Hex
  )
  const client = {
    account: { address: ACCOUNT, type: "smart", client: { readContract } },
    sendUserOperation
  } as unknown as Parameters<typeof uninstallModule>[0]
  return { client, sendUserOperation }
}

const sentArgs = (
  sendUserOperation: ReturnType<typeof makeClient>["sendUserOperation"]
) =>
  sendUserOperation.mock.calls[0][0].calls.map(
    (call) => decodeFunctionData({ abi: accountAbi, data: call.data }).args
  )

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
    expect(sentArgs(sendUserOperation)).toEqual([
      [1n, VALIDATOR_B, prevAndData(VALIDATOR_A, DE_INIT_DATA)]
    ])
  })

  test("sends empty disableModuleData when no deInitData is given", async () => {
    const { client, sendUserOperation } = makeClient()
    await uninstallModule(client, {
      module: { type: "validator", address: VALIDATOR_A, initData: INIT_DATA }
    })
    expect(sentArgs(sendUserOperation)).toEqual([
      [1n, VALIDATOR_A, prevAndData(SENTINEL, "0x")]
    ])
  })
})

describe("uninstallFallback", () => {
  test("sends the module's deInitData, not its initData", async () => {
    const { client, sendUserOperation } = makeClient()
    await uninstallFallback(client, {
      module: {
        type: "fallback",
        address: FALLBACK,
        initData: INIT_DATA,
        deInitData: DE_INIT_DATA
      }
    })
    expect(sentArgs(sendUserOperation)).toEqual([[3n, FALLBACK, DE_INIT_DATA]])
  })
})
