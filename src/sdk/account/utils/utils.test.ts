import { ParamType, ethers } from "ethers"
import { type AbiParameter, encodeAbiParameters } from "viem"
import { generatePrivateKey } from "viem/accounts"
import { describe, expect, test } from "vitest"
import { type EthersWallet, safeMultiplier } from "./Utils"
import { toSigner } from "./toSigner"

describe("utils", async () => {
  const privKey = generatePrivateKey()

  test.concurrent(
    "should have consistent behaviour between ethers.AbiCoder.defaultAbiCoder() and viem.encodeAbiParameters()",
    async () => {
      const expectedResult =
        "0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000090f79bf6eb2c4f870365e785982e1f101e93b90600000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000000000000000000000000000090f79bf6eb2c4f870365e785982e1f101e93b906000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000"

      const Executions = ParamType.from({
        type: "tuple(address,uint256,bytes)[]",
        baseType: "tuple",
        name: "executions",
        arrayLength: null,
        components: [
          { name: "target", type: "address" },
          { name: "value", type: "uint256" },
          { name: "callData", type: "bytes" }
        ]
      })

      const viemExecutions: AbiParameter = {
        type: "tuple[]",
        components: [
          { name: "target", type: "address" },
          { name: "value", type: "uint256" },
          { name: "callData", type: "bytes" }
        ]
      }

      const txs = [
        {
          target: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
          callData: "0x",
          value: 1n
        },
        {
          target: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
          callData: "0x",
          value: 1n
        }
      ]

      const executionCalldataPrepWithEthers =
        ethers.AbiCoder.defaultAbiCoder().encode([Executions], [txs])

      const executionCalldataPrepWithViem = encodeAbiParameters(
        [viemExecutions],
        [txs]
      )

      expect(executionCalldataPrepWithEthers).toBe(expectedResult)
      expect(executionCalldataPrepWithViem).toBe(expectedResult)
    }
  )

  test.concurrent("should support ethers Wallet", async () => {
    const wallet = new ethers.Wallet(privKey) as EthersWallet
    const signer = await toSigner({ signer: wallet })
    const sig = await signer.signMessage({ message: "test" })
    expect(sig).toBeDefined()
  })

  test.concurrent("should support ethers Wallet signTypedData", async () => {
    const wallet = new ethers.Wallet(privKey) as EthersWallet
    const signer = await toSigner({ signer: wallet })
    const appDomain = {
      chainId: 1,
      name: "TokenWithPermit",
      verifyingContract:
        "0x1111111111111111111111111111111111111111" as `0x${string}`,
      version: "1"
    }

    const primaryType = "Contents"
    const types = {
      Contents: [
        {
          name: "stuff",
          type: "bytes32"
        }
      ]
    }
    const sig = await signer.signTypedData({
      domain: appDomain,
      types,
      primaryType,
      message: {
        stuff:
          "0x1111111111111111111111111111111111111111111111111111111111111111"
      }
    })
    expect(sig).toBeDefined()
  })

  describe("safeMultiplier", () => {
    test("applies common gas buffers exactly", () => {
      expect(safeMultiplier(100n, 1)).toBe(100n)
      expect(safeMultiplier(100n, 1.3)).toBe(130n)
      expect(safeMultiplier(1_000_000n, 1.6)).toBe(1_600_000n)
      expect(safeMultiplier(0n, 1.5)).toBe(0n)
    })

    test("rounds half up", () => {
      expect(safeMultiplier(3n, 1.5)).toBe(5n)
      // 750 * 1.15 = 862.5 exactly; float math gives 862.4999999999999
      expect(safeMultiplier(750n, 1.15)).toBe(863n)
    })

    test("keeps full precision above Number.MAX_SAFE_INTEGER", () => {
      const big = 2n ** 60n + 1n
      expect(safeMultiplier(big, 1)).toBe(big)
      expect(safeMultiplier(big, 2)).toBe(big * 2n)
    })

    test("rejects invalid multipliers", () => {
      expect(() => safeMultiplier(1n, Number.NaN)).toThrow(RangeError)
      expect(() => safeMultiplier(1n, Number.POSITIVE_INFINITY)).toThrow(
        RangeError
      )
      expect(() => safeMultiplier(1n, -1)).toThrow(RangeError)
    })
  })
})
