import {
  type Account,
  type Address,
  type Chain,
  type Hex,
  type LocalAccount,
  type OneOf,
  type Transport,
  type WalletClient,
  createWalletClient,
  custom,
  getAddress,
  hexToBytes
} from "viem"
import { toAccount } from "viem/accounts"

import { signTypedData } from "viem/actions"
import { getAction } from "viem/utils"
import type { AnyData } from "../../modules/utils/Types"
import type { EthersWallet } from "./Utils"

export interface BaseProvider {
  request(...args: AnyData): Promise<AnyData>
}
// Generic type that extends the base provider
export type EthereumProvider<T extends BaseProvider = BaseProvider> = T &
  BaseProvider

/** Represents a local account that can sign transactions and messages */
export type Signer = LocalAccount

/**
 * Converts various signer types into a standardized LocalAccount format.
 * Handles conversion from different wallet implementations including ethers.js wallets,
 * EIP-1193 providers, and existing LocalAccounts.
 *
 * @param signer - The signer to convert, must implement required signing methods
 * @param address - Optional address to use for the account
 * @returns A Promise resolving to a LocalAccount
 *
 * @throws {Error} When signTransaction is called (not supported)
 * @throws {Error} When address is required but not provided
 */
export async function toSigner<
  provider extends EthereumProvider,
  wallet extends EthersWallet
>({
  signer,
  address
}: {
  signer: OneOf<
    | provider
    | wallet
    | WalletClient<Transport, Chain | undefined, Account>
    | LocalAccount
  >
  address?: Address
}): Promise<LocalAccount> {
  if (!signer) {
    throw new Error("Signer is required")
  }

  if ("provider" in signer) {
    const wallet = signer as EthersWallet
    const address = await wallet.getAddress()
    return toAccount({
      address: getAddress(address),
      async signMessage({ message }): Promise<Hex> {
        if (typeof message === "string") {
          return await wallet.signMessage(message)
        }
        if (typeof message?.raw === "string") {
          return await wallet.signMessage(hexToBytes(message.raw))
        }
        return await wallet.signMessage(message.raw)
      },
      async signTransaction(_) {
        throw new Error("Not supported")
      },
      async signTypedData(typedData) {
        return wallet.signTypedData(
          typedData.domain,
          typedData.types,
          typedData.message
        )
      }
    })
  }

  if ("type" in signer && signer.type === "local") {
    return signer as LocalAccount
  }

  let walletClient:
    | WalletClient<Transport, Chain | undefined, Account>
    | undefined = undefined

  if ("request" in signer) {
    if (!address) {
      // ── Step 1: try eth_accounts first ──────────────────────────────────────
      // This method is safe on every provider type (wallets, WalletConnect,
      // Alchemy, Infura …).  Infrastructure providers return [] without error,
      // and already-connected wallets return the active address immediately,
      // so this avoids an unnecessary round-trip in the happy path.
      try {
        ;[address] = await (signer as EthereumProvider).request({
          method: "eth_accounts"
        })
      } catch {
        // Provider doesn't support eth_accounts at all — keep address undefined
        // and fall through to the eth_requestAccounts path below.
      }

      // ── Step 2: escalate to eth_requestAccounts only for injected wallets ───
      // eth_requestAccounts triggers a user-approval popup and is NOT supported
      // by infrastructure providers (Alchemy, Infura, etc.).  Calling it on
      // those endpoints floods logs with 4xx errors.  We restrict it to the
      // browser-injected provider (window.ethereum, e.g. MetaMask) where it is
      // the correct mechanism to prompt a fresh connection.
      if (!address) {
        // globalThis.window is undefined in Node/non-DOM environments; AnyData
        // cast avoids TS errors when the tsconfig lib doesn't include "dom".
        const globalWindow = (globalThis as AnyData).window
        const isInjectedBrowserWallet =
          globalWindow !== undefined &&
          signer === globalWindow.ethereum
        if (isInjectedBrowserWallet) {
          try {
            ;[address] = await (signer as EthereumProvider).request({
              method: "eth_requestAccounts"
            })
          } catch {
            // User rejected the prompt or provider errored — address stays
            // undefined and will throw the clear error below.
          }
        }
      }
    }

    if (!address) {
      // For TS to be happy
      throw new Error("address is required")
    }
    walletClient = createWalletClient({
      account: address,
      transport: custom(signer as EthereumProvider)
    })
  }

  if (!walletClient) {
    walletClient = signer as WalletClient<Transport, Chain | undefined, Account>
  }

  const addressFromWalletClient: Hex =
    walletClient?.account?.address ?? (await walletClient?.getAddresses())?.[0]

  if (!addressFromWalletClient) {
    throw new Error("address not found in wallet client")
  }

  return toAccount({
    address: addressFromWalletClient,
    async signMessage({ message }) {
      return walletClient.signMessage({ message })
    },
    async signTypedData(typedData) {
      return getAction(
        walletClient,
        signTypedData,
        "signTypedData"
      )(typedData as AnyData)
    },
    async signTransaction(_) {
      throw new Error("Smart account signer doesn't need to sign transactions")
    }
  })
}
