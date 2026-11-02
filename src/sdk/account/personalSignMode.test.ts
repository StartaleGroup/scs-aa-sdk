import {
  type Address,
  type Hex,
  type PublicClient,
  custom,
  decodeFunctionData,
  encodeFunctionResult,
  hashMessage,
  hashTypedData,
  isAddressEqual,
  parseErc6492Signature,
  recoverMessageAddress,
  sliceHex,
  toPrefixedMessage
} from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { soneium } from "viem/chains"
import { describe, expect, test, vi } from "vitest"
import {
  ACCOUNT_FACTORY_ADDRESS,
  ACCOUNT_FACTORY_ADDRESS_1_0_0,
  ACCOUNT_IMPLEMENTATION_ADDRESS,
  ACCOUNT_IMPLEMENTATION_ADDRESS_1_0_0
} from "../constants"
import { AccountFactoryAbi, EIP1271Abi } from "../constants/abi"
import { toStartaleSmartAccount } from "./toStartaleSmartAccount"
import { getAccountDomain } from "./utils/Utils"

const ACCOUNT: Address = "0x1111111111111111111111111111111111111111"
const ZERO_SALT: Hex =
  "0x0000000000000000000000000000000000000000000000000000000000000000"

// Mirrors Soneium mainnet: each factory deploys one implementation, and the
// implementations report different domain versions.
const FACTORY_IMPLEMENTATION: Record<Address, Address> = {
  [ACCOUNT_FACTORY_ADDRESS_1_0_0]: ACCOUNT_IMPLEMENTATION_ADDRESS_1_0_0,
  [ACCOUNT_FACTORY_ADDRESS]: ACCOUNT_IMPLEMENTATION_ADDRESS
}
const IMPLEMENTATION_VERSION: Record<Address, string> = {
  [ACCOUNT_IMPLEMENTATION_ADDRESS_1_0_0]: "1.0.0",
  [ACCOUNT_IMPLEMENTATION_ADDRESS]: "1.0.1"
}

const lookup = <T>(table: Record<Address, T>, address: Address) =>
  Object.entries(table).find(([key]) =>
    isAddressEqual(key as Address, address)
  )?.[1]

const encodeDomain = (version: string, verifyingContract: Address) =>
  encodeFunctionResult({
    abi: EIP1271Abi,
    functionName: "eip712Domain",
    result: [
      "0x0f",
      "Startale",
      version,
      BigInt(soneium.id),
      verifyingContract,
      ZERO_SALT,
      []
    ]
  })

// A chain on which ACCOUNT has no code yet, or runs `deployedVersion`.
const toChain = (deployedVersion?: string) =>
  custom(
    {
      async request({ method, params }) {
        if (method === "eth_chainId") return `0x${soneium.id.toString(16)}`
        if (method === "eth_getCode") {
          const [address] = params as [Address]
          return deployedVersion && isAddressEqual(address, ACCOUNT)
            ? "0x60806040"
            : "0x"
        }
        if (method === "eth_call") {
          const [{ to, data }] = params as [{ to: Address; data: Hex }]
          const implementation = lookup(FACTORY_IMPLEMENTATION, to)
          if (implementation) {
            decodeFunctionData({ abi: AccountFactoryAbi, data })
            return encodeFunctionResult({
              abi: AccountFactoryAbi,
              functionName: "ACCOUNT_IMPLEMENTATION",
              result: implementation
            })
          }
          decodeFunctionData({ abi: EIP1271Abi, data })
          if (isAddressEqual(to, ACCOUNT)) {
            if (!deployedVersion) throw new Error("execution reverted")
            return encodeDomain(deployedVersion, ACCOUNT)
          }
          const version = lookup(IMPLEMENTATION_VERSION, to)
          if (version) return encodeDomain(version, to)
        }
        throw new Error(`unexpected ${method} ${JSON.stringify(params)}`)
      }
    },
    // The undeployed account's revert is expected; retrying it only adds delay.
    { retryCount: 0 }
  )

// The digest ERC-7739 verifies, built with viem's EIP-712 encoder rather than
// the SDK's own helper.
const personalSignDigest = (message: string, version: string) =>
  hashTypedData({
    domain: {
      name: "Startale",
      version,
      chainId: soneium.id,
      verifyingContract: ACCOUNT
    },
    types: { PersonalSign: [{ name: "prefixed", type: "bytes" }] },
    primaryType: "PersonalSign",
    message: { prefixed: toPrefixedMessage(message) }
  })

const owner = privateKeyToAccount(
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
)

const signWith = async (
  parameters: Partial<Parameters<typeof toStartaleSmartAccount>[0]>,
  deployedVersion?: string
) => {
  const account = await toStartaleSmartAccount({
    chain: soneium,
    transport: toChain(deployedVersion),
    signer: owner,
    accountAddress: ACCOUNT,
    ...parameters
  })
  const { address: deployFactory, signature } = parseErc6492Signature(
    await account.signMessage({ message: "hello" })
  )
  // Drop the 20-byte validator address the account prepends.
  return { signature: sliceHex(signature, 20), deployFactory }
}

const signerOf = (digest: Hex, signature: Hex) =>
  recoverMessageAddress({ message: { raw: digest }, signature })

describe("signMessage personalSignMode", () => {
  test("eip191 signs the message itself", async () => {
    const { signature } = await signWith({})

    expect(await recoverMessageAddress({ message: "hello", signature })).toBe(
      owner.address
    )
  })

  test("erc7739 signs the PersonalSign digest of a deployed account", async () => {
    const { signature } = await signWith(
      { personalSignMode: "erc7739" },
      "1.0.1"
    )

    expect(
      await signerOf(personalSignDigest("hello", "1.0.1"), signature)
    ).toBe(owner.address)
    expect(
      await recoverMessageAddress({ message: "hello", signature })
    ).not.toBe(owner.address)
  })

  test("erc7739 uses the domain of the implementation the factory deploys", async () => {
    // The default implementation reports 1.0.1, but this factory deploys 1.0.0.
    const { signature, deployFactory } = await signWith({
      personalSignMode: "erc7739",
      factoryAddress: ACCOUNT_FACTORY_ADDRESS_1_0_0
    })

    expect(deployFactory).toBe(ACCOUNT_FACTORY_ADDRESS_1_0_0)
    expect(
      await signerOf(personalSignDigest("hello", "1.0.0"), signature)
    ).toBe(owner.address)
  })

  test("erc7739 uses the default implementation's domain before deployment", async () => {
    const { signature } = await signWith({ personalSignMode: "erc7739" })

    expect(
      await signerOf(personalSignDigest("hello", "1.0.1"), signature)
    ).toBe(owner.address)
  })

  test("erc7739 uses the delegate's domain for an undelegated EIP-7702 account", async () => {
    // The EOA delegates to the implementation, not to whatever the factory deploys.
    const { signature } = await signWith({
      personalSignMode: "erc7739",
      eip7702Account: owner,
      factoryAddress: ACCOUNT_FACTORY_ADDRESS_1_0_0
    })

    expect(
      await signerOf(personalSignDigest("hello", "1.0.1"), signature)
    ).toBe(owner.address)
  })
})

describe("getAccountDomain", () => {
  const domainOf = (version: string, verifyingContract: Address) =>
    [
      "0x0f",
      "Startale",
      version,
      BigInt(soneium.id),
      verifyingContract,
      ZERO_SALT,
      []
    ] as const

  const toClient = ({
    accountDomain,
    accountCode
  }: { accountDomain?: string; accountCode?: Hex }) =>
    ({
      readContract: vi.fn(async ({ address }: { address: Address }) => {
        if (isAddressEqual(address, ACCOUNT)) {
          if (!accountDomain) throw new Error("execution reverted")
          return domainOf(accountDomain, ACCOUNT)
        }
        return domainOf("1.0.0", address)
      }),
      getCode: vi.fn(async () => accountCode)
    }) as unknown as PublicClient

  test("reads a deployed account without resolving the fallback", async () => {
    const resolve = vi.fn(async () => ACCOUNT_IMPLEMENTATION_ADDRESS_1_0_0)
    const domain = await getAccountDomain(
      toClient({ accountDomain: "1.0.1", accountCode: "0x6080" }),
      ACCOUNT,
      resolve
    )

    expect(domain.version).toBe("1.0.1")
    expect(resolve).not.toHaveBeenCalled()
  })

  test("borrows the implementation's domain for an account without code", async () => {
    const domain = await getAccountDomain(
      toClient({}),
      ACCOUNT,
      async () => ACCOUNT_IMPLEMENTATION_ADDRESS_1_0_0
    )

    expect(domain).toMatchObject({
      version: "1.0.0",
      verifyingContract: ACCOUNT
    })
  })

  test("rethrows for an account with code that cannot answer", async () => {
    const resolve = vi.fn(async () => ACCOUNT_IMPLEMENTATION_ADDRESS_1_0_0)

    await expect(
      getAccountDomain(toClient({ accountCode: "0x6080" }), ACCOUNT, resolve)
    ).rejects.toThrow("execution reverted")
    expect(resolve).not.toHaveBeenCalled()
  })
})
