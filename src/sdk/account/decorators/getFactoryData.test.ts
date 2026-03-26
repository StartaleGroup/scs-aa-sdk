import { describe, expect, test } from "vitest"
import { BOOTSTRAP_ADDRESS } from "../../constants"
import {
  getFactoryData,
  getInitDataRhinestoneCompatible,
  type GetInitDataRhinestoneCompatibleParams
} from "./getFactoryData"

describe("getFactoryData / getInitDataRhinestoneCompatible", () => {
  const ownerAddress =
    "0xf6c02c78ded62973b43bfa523b247da099486936" as const

  test("getInitDataRhinestoneCompatible returns hex with default params", () => {
    const initData = getInitDataRhinestoneCompatible({
      ownerAddress
    })
    expect(initData).toMatch(/^0x[a-fA-F0-9]+$/)
    expect(initData.length).toBeGreaterThan(100)
  })

  test("getInitDataRhinestoneCompatible is deterministic for same params", () => {
    const params: GetInitDataRhinestoneCompatibleParams = {
      ownerAddress,
      sessionsEnabled: false
    }
    expect(getInitDataRhinestoneCompatible(params)).toBe(
      getInitDataRhinestoneCompatible(params)
    )
  })

  test("getInitDataRhinestoneCompatible with sessionsEnabled adds more data", () => {
    const without = getInitDataRhinestoneCompatible({
      ownerAddress,
      sessionsEnabled: false
    })
    const withSessions = getInitDataRhinestoneCompatible({
      ownerAddress,
      sessionsEnabled: true
    })
    expect(withSessions.length).toBeGreaterThan(without.length)
  })

  test("getInitDataRhinestoneCompatible uses BOOTSTRAP_ADDRESS when not provided", () => {
    const initData = getInitDataRhinestoneCompatible({
      ownerAddress
    })
    expect(initData).toContain(BOOTSTRAP_ADDRESS.toLowerCase().slice(2))
  })

  test("getFactoryData with rhinestone-compatible initData and index 0 produces valid factoryData", () => {
    const initData = getInitDataRhinestoneCompatible({
      ownerAddress
    })
    const factoryData = getFactoryData({ initData, index: 0n })
    expect(factoryData).toMatch(/^0x[a-fA-F0-9]+$/)
    expect(factoryData.length).toBeGreaterThan(50)
  })

  test("getFactoryData with same initData and index produces same factoryData", () => {
    const initData = getInitDataRhinestoneCompatible({ ownerAddress })
    expect(getFactoryData({ initData, index: 0n })).toBe(
      getFactoryData({ initData, index: 0n })
    )
  })

  test("getFactoryData with different index produces different factoryData", () => {
    const initData = getInitDataRhinestoneCompatible({ ownerAddress })
    expect(getFactoryData({ initData, index: 0n })).not.toBe(
      getFactoryData({ initData, index: 1n })
    )
  })
})
