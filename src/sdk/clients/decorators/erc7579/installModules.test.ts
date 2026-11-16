import {
  type Address,
  type Hex,
  decodeFunctionData,
  encodeAbiParameters,
  parseAbi
} from "viem"
import { describe, expect, test, vi } from "vitest"
import { installModules } from "./installModules"

// Offline: the client only needs `sendUserOperation`, which getAction() picks
// up from the client object, so no RPC or bundler is involved.
const ACCOUNT: Address = "0x1111111111111111111111111111111111111111"
const VALIDATOR: Address = "0x2222222222222222222222222222222222222222"
const EXECUTOR: Address = "0x3333333333333333333333333333333333333333"
const VALIDATOR_INIT_DATA: Hex = encodeAbiParameters(
  [{ type: "uint256" }, { type: "address[]" }],
  [1n, ["0x9999999999999999999999999999999999999999"]]
)

const accountAbi = parseAbi([
  "function installModule(uint256 moduleTypeId, address module, bytes initData)"
])

type SentUserOperation = { calls: { to: Address; data: Hex }[] }

const makeClient = () => {
  const sendUserOperation = vi.fn(
    async (_args: SentUserOperation) => "0x01" as Hex
  )
  const client = {
    account: { address: ACCOUNT, type: "smart" },
    sendUserOperation
  } as unknown as Parameters<typeof installModules>[0]
  return { client, sendUserOperation }
}

describe("installModules", () => {
  test("passes each module's data as its initData", async () => {
    const { client, sendUserOperation } = makeClient()

    await installModules(client, {
      modules: [
        { type: "validator", address: VALIDATOR, data: VALIDATOR_INIT_DATA },
        { type: "executor", address: EXECUTOR, data: "0x" }
      ]
    })

    const { calls } = sendUserOperation.mock.calls[0][0]
    expect(calls).toHaveLength(2)

    const first = decodeFunctionData({ abi: accountAbi, data: calls[0].data })
    expect(calls[0].to).toBe(ACCOUNT)
    expect(first.args).toEqual([1n, VALIDATOR, VALIDATOR_INIT_DATA])

    const second = decodeFunctionData({ abi: accountAbi, data: calls[1].data })
    expect(second.args).toEqual([2n, EXECUTOR, "0x"])
  })
})
