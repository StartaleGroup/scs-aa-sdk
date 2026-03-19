import { custom } from "viem"
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts"
import { base } from "viem/chains"
import { describe, expect, test } from "vitest"
import { ACCOUNT_FACTORY_ADDRESS } from "../constants"
import { toStartaleSmartAccount } from "./toStartaleSmartAccount"

// Mock transport: avoid real RPC (getAddress uses eth_call, isDeployed uses getCode)
const mockTransport = custom({
  async request({ method }: { method: string }) {
    if (method === "eth_call") {
      // ABI-encoded address (32-byte word): 0x0000...0001
      return "0x0000000000000000000000000000000000000000000000000000000000000001"
    }
    if (method === "eth_getCode") return "0x"
    throw new Error(`Unsupported mock method: ${method}`)
  }
})

describe("rhinestoneCompatible and getRhinestoneInitData", () => {
  const chain = base
  const signer = privateKeyToAccount(generatePrivateKey())
  const transport = mockTransport

  test("account without rhinestoneCompatible has getRhinestoneInitData returning { factory, factoryData }", async () => {
    const account = await toStartaleSmartAccount({
      chain,
      signer,
      transport,
      index: 0n
    })
    const initData = account.getRhinestoneInitData()
    expect(initData).toBeDefined()
    expect(initData?.factory).toBe(ACCOUNT_FACTORY_ADDRESS)
    expect(initData?.factoryData).toMatch(/^0x[a-fA-F0-9]+$/)
  })

  test("account with rhinestoneCompatible: true has getRhinestoneInitData with same factory", async () => {
    const account = await toStartaleSmartAccount({
      chain,
      signer,
      transport,
      index: 0n,
      rhinestoneCompatible: true
    })
    const initData = account.getRhinestoneInitData()
    expect(initData).toBeDefined()
    expect(initData?.factory).toBe(ACCOUNT_FACTORY_ADDRESS)
    expect(initData?.factoryData).toMatch(/^0x[a-fA-F0-9]+$/)
  })

  test("same signer + rhinestoneCompatible: true + index 0n yields deterministic factoryData", async () => {
    const account1 = await toStartaleSmartAccount({
      chain,
      signer,
      transport,
      index: 0n,
      rhinestoneCompatible: true
    })
    const account2 = await toStartaleSmartAccount({
      chain,
      signer,
      transport,
      index: 0n,
      rhinestoneCompatible: true
    })
    const data1 = account1.getRhinestoneInitData()
    const data2 = account2.getRhinestoneInitData()
    expect(data1?.factoryData).toBe(data2?.factoryData)
  })

  test("rhinestoneCompatible: true vs false with same signer and index 0n yield different factoryData", async () => {
    const defaultAccount = await toStartaleSmartAccount({
      chain,
      signer,
      transport,
      index: 0n
    })
    const rhinestoneAccount = await toStartaleSmartAccount({
      chain,
      signer,
      transport,
      index: 0n,
      rhinestoneCompatible: true
    })
    const defaultData = defaultAccount.getRhinestoneInitData()
    const rhinestoneData = rhinestoneAccount.getRhinestoneInitData()
    expect(defaultData?.factoryData).not.toBe(rhinestoneData?.factoryData)
  })

  test("rhinestoneCompatible: { sessionsEnabled: true } produces different factoryData than sessionsEnabled false", async () => {
    const withoutSessions = await toStartaleSmartAccount({
      chain,
      signer,
      transport,
      index: 0n,
      rhinestoneCompatible: true
    })
    const withSessions = await toStartaleSmartAccount({
      chain,
      signer,
      transport,
      index: 0n,
      rhinestoneCompatible: { sessionsEnabled: true }
    })
    const dataWithout = withoutSessions.getRhinestoneInitData()
    const dataWith = withSessions.getRhinestoneInitData()
    expect(dataWithout?.factoryData).not.toBe(dataWith?.factoryData)
  })
})
