import { BaseError, type Client } from "viem"
import {
  type BundlerClientConfig,
  getPaymasterData,
  getPaymasterStubData
} from "viem/account-abstraction"
import { getAction } from "viem/utils"
import type { AnyData } from "../modules/utils/Types"

/**
 * UserOperation fields that decide what runs, from which account and on which
 * chain. viem merges the whole result of a paymaster call or a fee hook into
 * the UserOperation, so those results may echo these fields back unchanged
 * but must never change them.
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
 * Thrown when a paymaster response or fee hook tries to change a protected
 * UserOperation field (e.g. `callData`) before it is signed.
 */
export class UserOperationTamperedError extends BaseError {
  readonly field: string

  constructor({
    field,
    source,
    details
  }: { field: string; source: string; details?: string }) {
    super(
      [
        `${source} changed the UserOperation \`${field}\`.`,
        ...(details ? [details] : []),
        "The UserOperation was not signed. Check the paymaster or hook that returned it."
      ].join("\n"),
      { name: "UserOperationTamperedError" }
    )
    this.field = field
  }
}

const toBigInt = (value: unknown): bigint | null => {
  try {
    if (typeof value === "bigint") return value
    if (typeof value === "number" || typeof value === "string")
      return BigInt(value)
  } catch {}
  return null
}

// Results often come straight from JSON-RPC, so an honest echo may use hex
// numbers, different address casing or `null` for a missing value.
const normalize = (field: ProtectedField, value: unknown): unknown => {
  if (value === undefined || value === null || value === "0x") return undefined
  if (field === "nonce" || field === "chainId") return toBigInt(value)
  if (field === "authorization" && typeof value === "object") {
    const { address, contractAddress, chainId, nonce } = value as AnyData
    return JSON.stringify([
      String(address ?? contractAddress ?? "").toLowerCase(),
      String(toBigInt(chainId)),
      String(toBigInt(nonce))
    ])
  }
  return typeof value === "string" ? value.toLowerCase() : value
}

/**
 * Throws if `result` sets a protected field to a value different from the one
 * in `request`. Never modifies the result.
 */
const assertUnchanged = (
  request: Record<string, unknown> | undefined,
  result: unknown,
  source: string
) => {
  if (!result || typeof result !== "object") return
  for (const field of PROTECTED_FIELDS) {
    if (!(field in result)) continue
    const expected = normalize(field, request?.[field])
    const actual = normalize(field, (result as AnyData)[field])
    // `null` means the value isn't a number at all: only accept it unchanged.
    const unchanged =
      expected === actual &&
      (expected !== null || request?.[field] === (result as AnyData)[field])
    if (!unchanged) throw new UserOperationTamperedError({ field, source })
  }
}

type PaymasterActions = Exclude<
  NonNullable<BundlerClientConfig["paymaster"]>,
  true
>

/**
 * Wraps a paymaster so that its responses can't change a protected
 * UserOperation field. Accepts the same values as viem's `paymaster` option:
 * an address and `undefined` are returned as-is, `true` resolves to the
 * client's own paymaster actions, and a missing function stays missing so
 * viem's fallback between the two functions is unchanged.
 *
 * `createSmartAccountClient` and `createSCSPaymasterClient` already apply it.
 * Use it directly when sending with viem's own `createBundlerClient`:
 *
 * @example
 * createBundlerClient({ ..., paymaster: guardPaymaster(paymasterClient, client) })
 */
export function guardPaymaster(
  paymaster: Required<PaymasterActions>,
  client: Client
): Required<PaymasterActions>
export function guardPaymaster(
  paymaster: true | PaymasterActions,
  client: Client
): PaymasterActions
export function guardPaymaster<paymaster>(
  paymaster: paymaster,
  client: Client
): paymaster
export function guardPaymaster(paymaster: unknown, client: Client): unknown {
  if (paymaster !== true && (!paymaster || typeof paymaster !== "object"))
    return paymaster

  // Same resolution viem uses for `paymaster: true`.
  const { getPaymasterStubData: stub, getPaymasterData: data }: AnyData =
    paymaster === true
      ? {
          getPaymasterStubData: (parameters: AnyData) =>
            getAction(
              client as AnyData,
              getPaymasterStubData,
              "getPaymasterStubData"
            )(parameters),
          getPaymasterData: (parameters: AnyData) =>
            getAction(
              client as AnyData,
              getPaymasterData,
              "getPaymasterData"
            )(parameters)
        }
      : paymaster

  const checked =
    (fn: (parameters: AnyData) => Promise<AnyData>) =>
    async (parameters: AnyData) => {
      const response = await fn(parameters)
      assertUnchanged(parameters, response, "Paymaster response")
      return response
    }
  return {
    getPaymasterStubData: stub ? checked(stub) : undefined,
    getPaymasterData: data ? checked(data) : undefined
  }
}

/**
 * Wraps a client's `userOperation.estimateFeesPerGas` hook so that its result
 * can't change a protected UserOperation field. A config without the hook is
 * returned as-is.
 */
export const guardFeeHook = (
  userOperation: BundlerClientConfig["userOperation"]
): BundlerClientConfig["userOperation"] => {
  const estimateFeesPerGas = userOperation?.estimateFeesPerGas
  if (!estimateFeesPerGas) return userOperation
  return {
    ...userOperation,
    estimateFeesPerGas: async (parameters) => {
      const fees = await estimateFeesPerGas(parameters)
      assertUnchanged(
        parameters.userOperation as AnyData,
        fees,
        "Fee estimation hook"
      )
      return fees
    }
  }
}
