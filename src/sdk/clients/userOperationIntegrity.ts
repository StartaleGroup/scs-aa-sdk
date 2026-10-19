import { BaseError, type Client, type Hex } from "viem"
import {
  type PrepareUserOperationParameters,
  type SmartAccount,
  getPaymasterData,
  getPaymasterStubData,
  prepareUserOperation
} from "viem/account-abstraction"
import { getAction } from "viem/utils"
import type { AnyData } from "../modules/utils/Types"

/**
 * UserOperation fields that decide what runs, from which account and on which
 * chain. A paymaster only supplies paymaster and gas fields, so it may echo
 * these back unchanged but must never change them.
 */
const PROTECTED_FIELDS = [
  "sender",
  "nonce",
  "callData",
  "factory",
  "factoryData",
  "initCode",
  "chainId",
  "authorization"
] as const

type ProtectedField = (typeof PROTECTED_FIELDS)[number]

/**
 * Thrown when a prepared UserOperation no longer matches what the account
 * built, e.g. a paymaster response tried to change `callData` before signing.
 */
export class UserOperationTamperedError extends BaseError {
  readonly field: string

  constructor({ field, source }: { field: string; source: string }) {
    super(
      [
        `${source} changed the UserOperation \`${field}\`.`,
        "The UserOperation was not signed. Check the paymaster or hook that returned it."
      ].join("\n"),
      { name: "UserOperationTamperedError" }
    )
    this.field = field
  }
}

const isEmpty = (value: unknown) =>
  value === undefined || value === null || value === "0x"

const toBigIntOrNull = (value: unknown): bigint | null => {
  try {
    if (typeof value === "bigint") return value
    if (typeof value === "number" || typeof value === "string")
      return BigInt(value)
  } catch {}
  return null
}

// Paymaster responses come straight from JSON-RPC, so numbers may be hex
// strings and addresses may differ in checksum casing.
const normalize = (field: ProtectedField, value: unknown): unknown => {
  if (isEmpty(value)) return undefined
  if (field === "nonce" || field === "chainId") return toBigIntOrNull(value)
  if (field === "authorization") {
    const auth = value as AnyData
    if (typeof auth !== "object") return value
    return JSON.stringify([
      String(auth.address ?? auth.contractAddress ?? "").toLowerCase(),
      String(toBigIntOrNull(auth.chainId)),
      String(toBigIntOrNull(auth.nonce))
    ])
  }
  return typeof value === "string" ? value.toLowerCase() : value
}

const isSame = (field: ProtectedField, a: unknown, b: unknown) => {
  const left = normalize(field, a)
  const right = normalize(field, b)
  return left === right && (left !== null || b === a)
}

/**
 * Throws if `response` sets a protected field to a value different from the one
 * in `request`. Never modifies the response.
 */
export const assertPaymasterResponseUnchanged = (
  request: Record<string, unknown>,
  response: unknown
) => {
  if (!response || typeof response !== "object") return
  for (const field of PROTECTED_FIELDS) {
    if (!(field in response)) continue
    if (!isSame(field, request[field], (response as AnyData)[field])) {
      throw new UserOperationTamperedError({
        field,
        source: "Paymaster response"
      })
    }
  }
}

type PaymasterFunctions = {
  getPaymasterStubData?: (parameters: AnyData) => Promise<AnyData>
  getPaymasterData?: (parameters: AnyData) => Promise<AnyData>
}

const guardFunction =
  (fn: (parameters: AnyData) => Promise<AnyData>) =>
  async (parameters: AnyData) => {
    const response = await fn(parameters)
    assertPaymasterResponseUnchanged(parameters, response)
    return response
  }

/**
 * Wraps a paymaster so that each response is checked by
 * {@link assertPaymasterResponseUnchanged}. Accepts the same values as viem's
 * `paymaster` option: an address and `undefined` are returned as-is, `true`
 * is resolved to the client's own paymaster actions, and a missing function
 * stays missing so viem's fallback between the two functions is unchanged.
 */
export const guardPaymaster = (paymaster: unknown, client: Client): unknown => {
  if (paymaster === true) {
    return {
      getPaymasterStubData: guardFunction((parameters) =>
        getAction(
          client as AnyData,
          getPaymasterStubData,
          "getPaymasterStubData"
        )(parameters)
      ),
      getPaymasterData: guardFunction((parameters) =>
        getAction(
          client as AnyData,
          getPaymasterData,
          "getPaymasterData"
        )(parameters)
      )
    }
  }
  if (!paymaster || typeof paymaster !== "object") return paymaster

  const { getPaymasterStubData: stub, getPaymasterData: data } =
    paymaster as PaymasterFunctions
  return {
    getPaymasterStubData: stub ? guardFunction(stub) : undefined,
    getPaymasterData: data ? guardFunction(data) : undefined
  }
}

/**
 * Records what the account itself encodes during `prepareUserOperation`, so the
 * prepared UserOperation can be compared against it afterwards. Uses a Proxy so
 * every other property of the account is read exactly as before.
 */
export const recordAccountOutputs = (account: SmartAccount) => {
  const recorded: {
    callData?: Hex
    nonce?: bigint
    factoryArgs?: { factory?: unknown; factoryData?: unknown }
  } = {}

  const recordAs = (
    key: keyof typeof recorded,
    fn: (...args: AnyData[]) => Promise<AnyData>
  ) =>
    // A regular function keeps `this` as the caller's receiver: viem's
    // `getFactoryArgs` calls `this.isDeployed()`.
    async function (this: unknown, ...args: AnyData[]) {
      const result = await fn.apply(this, args)
      recorded[key] = result
      return result
    }

  const proxy = new Proxy(account, {
    get(target, property, receiver) {
      const value = Reflect.get(target, property, receiver)
      if (typeof value !== "function") return value
      if (property === "encodeCalls") return recordAs("callData", value)
      if (property === "getNonce") return recordAs("nonce", value)
      if (property === "getFactoryArgs") return recordAs("factoryArgs", value)
      return value
    }
  })

  return { account: proxy, recorded }
}

/**
 * Throws if the prepared UserOperation does not match what the caller asked for
 * and what the account encoded. Covers changes from any source (paymaster,
 * fee or gas hooks), not only paymaster responses.
 */
export const assertPreparedUserOperation = ({
  prepared,
  args,
  account,
  recorded,
  chainId
}: {
  prepared: Record<string, unknown>
  args: Record<string, unknown>
  account: SmartAccount
  recorded: ReturnType<typeof recordAccountOutputs>["recorded"]
  chainId: number | undefined
}) => {
  const fail = (field: string) => {
    throw new UserOperationTamperedError({
      field,
      source: "UserOperation preparation"
    })
  }

  // Each value must come from the caller or from the account itself. Both are
  // accepted because viem's merge order decides which one wins in some cases
  // (e.g. a fee hook re-spreads the caller's parameters).
  const fromCallerOrAccount = (
    field: ProtectedField,
    value: unknown,
    candidates: unknown[]
  ) => {
    const known = candidates.filter((candidate) => candidate !== undefined)
    if (known.length === 0) return true
    return known.some((candidate) => isSame(field, value, candidate))
  }

  if (
    !fromCallerOrAccount("callData", prepared.callData, [
      args.calls ? recorded.callData : undefined,
      args.callData
    ])
  )
    fail("callData")

  if (
    "sender" in prepared &&
    !isSame("sender", prepared.sender, account.address)
  )
    fail("sender")

  if (
    "nonce" in prepared &&
    !fromCallerOrAccount("nonce", prepared.nonce, [args.nonce, recorded.nonce])
  )
    fail("nonce")

  const factoryCandidates = [
    args.factory !== undefined || args.factoryData !== undefined
      ? { factory: args.factory, factoryData: args.factoryData }
      : undefined,
    recorded.factoryArgs
  ].filter((candidate) => candidate !== undefined)
  if (
    factoryCandidates.length > 0 &&
    !factoryCandidates.some(
      (candidate) =>
        isSame("factory", prepared.factory, candidate.factory) &&
        isSame("factoryData", prepared.factoryData, candidate.factoryData)
    )
  )
    fail(
      factoryCandidates.some((candidate) =>
        isSame("factory", prepared.factory, candidate.factory)
      )
        ? "factoryData"
        : "factory"
    )

  if (
    "chainId" in prepared &&
    chainId !== undefined &&
    !isSame("chainId", prepared.chainId, chainId)
  )
    fail("chainId")
}

/**
 * viem's `prepareUserOperation` with integrity checks: paymaster responses may
 * not change protected fields, and the result must match what the account
 * encoded. Honest paymasters and hooks see no change in behavior; a tampered
 * UserOperation throws {@link UserOperationTamperedError} before it is signed.
 */
export const prepareCheckedUserOperation = async (
  client: Client & { paymaster?: unknown },
  args: PrepareUserOperationParameters
) => {
  const account = (args.account ?? client.account) as SmartAccount | undefined
  if (!account || typeof account !== "object") {
    return await prepareUserOperation(client as AnyData, args)
  }

  const { account: recordingAccount, recorded } = recordAccountOutputs(account)
  const paymaster = guardPaymaster(args.paymaster ?? client.paymaster, client)

  const { account: _recordingAccount, ...userOperation } =
    (await prepareUserOperation(
      client as AnyData,
      {
        ...args,
        account: recordingAccount,
        ...(paymaster !== undefined && { paymaster })
      } as AnyData
    )) as AnyData

  // viem echoes `account` back when it is passed explicitly; return what the
  // caller passed, not the recording proxy.
  const prepared =
    "account" in args
      ? { ...userOperation, account: args.account }
      : userOperation

  assertPreparedUserOperation({
    prepared,
    args: args as AnyData,
    account,
    recorded,
    chainId: client.chain?.id
  })
  return prepared
}
