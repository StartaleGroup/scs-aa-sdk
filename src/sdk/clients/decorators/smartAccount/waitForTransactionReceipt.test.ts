import type {
  Address,
  Chain,
  Client,
  Hash,
  PublicClient,
  TransactionReceipt,
  Transport,
  WaitForTransactionReceiptParameters
} from "viem"
import type { SmartAccount } from "viem/account-abstraction"
import { describe, expect, test, vi } from "vitest"
import { waitForTransactionReceipt } from "./waitForTransactionReceipt"

const hash: Hash = `0x${"11".repeat(32)}`
const address: Address = "0x2222222222222222222222222222222222222222"
const receipt: TransactionReceipt = {
  blockHash: `0x${"33".repeat(32)}`,
  blockNumber: 1n,
  contractAddress: null,
  cumulativeGasUsed: 21_000n,
  effectiveGasPrice: 1n,
  from: address,
  gasUsed: 21_000n,
  logs: [],
  logsBloom: `0x${"00".repeat(256)}`,
  status: "success",
  to: address,
  transactionHash: hash,
  transactionIndex: 0,
  type: "eip1559"
}

// Only the public-client boundary is mocked; no network or signer is needed.
const makeClient = () => {
  const wait = vi
    .fn<PublicClient["waitForTransactionReceipt"]>()
    .mockResolvedValue(receipt)
  const account = {
    address,
    client: { waitForTransactionReceipt: wait }
  } as unknown as SmartAccount
  const client = { account } as Client<
    Transport,
    Chain | undefined,
    SmartAccount
  >
  return { client, account, wait }
}

describe("waitForTransactionReceipt", () => {
  test("forwards receipt waiting options to the account's public client", async () => {
    const { client, wait } = makeClient()
    const parameters = {
      hash,
      confirmations: 12,
      timeout: 50,
      pollingInterval: 10,
      retryCount: 1,
      retryDelay: 5,
      onReplaced: vi.fn()
    } satisfies WaitForTransactionReceiptParameters

    await expect(waitForTransactionReceipt(client, parameters)).resolves.toBe(
      receipt
    )

    expect(wait).toHaveBeenCalledExactlyOnceWith(parameters)
  })

  test("uses an account override without forwarding it as a receipt option", async () => {
    const { client, wait } = makeClient()
    const override = makeClient()
    const parameters = { hash, confirmations: 2, timeout: 100 }

    await expect(
      waitForTransactionReceipt(client, {
        ...parameters,
        account: override.account
      })
    ).resolves.toBe(receipt)

    expect(override.wait).toHaveBeenCalledExactlyOnceWith(parameters)
    expect(wait).not.toHaveBeenCalled()
  })

  test("preserves hash-only receipt waits", async () => {
    const { client, wait } = makeClient()

    await expect(waitForTransactionReceipt(client, { hash })).resolves.toBe(
      receipt
    )

    expect(wait).toHaveBeenCalledExactlyOnceWith({ hash })
  })

  test("preserves a hash provided by a prototype getter", async () => {
    const { client, wait } = makeClient()
    class ReceiptWaitOptions {
      get hash(): Hash {
        return hash
      }

      timeout = 25
    }
    const parameters: WaitForTransactionReceiptParameters =
      new ReceiptWaitOptions()

    await expect(waitForTransactionReceipt(client, parameters)).resolves.toBe(
      receipt
    )

    expect(wait).toHaveBeenCalledExactlyOnceWith({ hash, timeout: 25 })
  })
})
