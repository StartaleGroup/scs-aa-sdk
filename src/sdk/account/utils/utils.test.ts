import { ParamType, ethers } from "ethers"
import {
  type AbiParameter,
  concat,
  encodeAbiParameters,
  hashMessage,
  hashTypedData,
  keccak256,
  parseAbiParameters,
  toBytes,
  toPrefixedMessage
} from "viem"
import { generatePrivateKey } from "viem/accounts"
import { describe, expect, test } from "vitest"
import { ACCOUNT_DOMAIN_TYPEHASH } from "./Constants"
import type { AccountDomain } from "./Types"
import { type EthersWallet, toPersonalSignHash } from "./Utils"
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
})

describe("toPersonalSignHash", () => {
  const domain: AccountDomain = {
    name: "Startale",
    version: "1.0.1",
    chainId: 1868n,
    verifyingContract: "0x1111111111111111111111111111111111111111",
    salt: "0x0000000000000000000000000000000000000000000000000000000000000000"
  }
  const raw32 =
    "0x8f3c7e2a1b9d4c6e5f0a3b2c1d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e"

  test("matches the EIP-712 hash of PersonalSign(bytes prefixed)", () => {
    for (const message of ["hello", { raw: raw32 } as const]) {
      expect(toPersonalSignHash(message, domain)).toBe(
        hashTypedData({
          domain: {
            name: domain.name,
            version: domain.version,
            chainId: domain.chainId,
            verifyingContract: domain.verifyingContract
          },
          types: { PersonalSign: [{ name: "prefixed", type: "bytes" }] },
          primaryType: "PersonalSign",
          message: { prefixed: toPrefixedMessage(message) }
        })
      )
    }
  })

  test("matches the digest the ERC-7739 validator rebuilds", () => {
    const accountDomainSeparator = keccak256(
      encodeAbiParameters(
        parseAbiParameters("bytes32, bytes32, bytes32, uint256, address"),
        [
          keccak256(toBytes(ACCOUNT_DOMAIN_TYPEHASH)),
          keccak256(toBytes(domain.name)),
          keccak256(toBytes(domain.version)),
          domain.chainId,
          domain.verifyingContract
        ]
      )
    )
    const structHash = keccak256(
      encodeAbiParameters(parseAbiParameters("bytes32, bytes32"), [
        keccak256(toBytes("PersonalSign(bytes prefixed)")),
        hashMessage("hello")
      ])
    )

    expect(toPersonalSignHash("hello", domain)).toBe(
      keccak256(concat(["0x1901", accountDomainSeparator, structHash]))
    )
  })

  test("differs from the EIP-191 hash of the message", () => {
    expect(toPersonalSignHash({ raw: raw32 }, domain)).not.toBe(
      hashMessage({ raw: raw32 })
    )
  })

  test("is bound to the account domain", () => {
    const digest = toPersonalSignHash("hello", domain)
    for (const changed of [
      { verifyingContract: "0x2222222222222222222222222222222222222222" },
      { chainId: 1946n },
      { version: "1.0.0" },
      { name: "Other" }
    ] as const) {
      expect(toPersonalSignHash("hello", { ...domain, ...changed })).not.toBe(
        digest
      )
    }
  })

  test("ignores the salt, which the validator leaves out", () => {
    expect(
      toPersonalSignHash("hello", {
        ...domain,
        salt: "0x00000000000000000000000000000000000000000000000000000000000000ff"
      })
    ).toBe(toPersonalSignHash("hello", domain))
  })
})
