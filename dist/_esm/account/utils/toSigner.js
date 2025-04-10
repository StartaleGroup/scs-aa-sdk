import { createWalletClient, custom, getAddress, hexToBytes } from "viem";
import { toAccount } from "viem/accounts";
import { signTypedData } from "viem/actions";
import { getAction } from "viem/utils";
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
export async function toSigner({ signer, address }) {
    if (!signer) {
        throw new Error("Signer is required");
    }
    if ("provider" in signer) {
        const wallet = signer;
        const address = await wallet.getAddress();
        return toAccount({
            address: getAddress(address),
            async signMessage({ message }) {
                if (typeof message === "string") {
                    return await wallet.signMessage(message);
                }
                if (typeof message?.raw === "string") {
                    return await wallet.signMessage(hexToBytes(message.raw));
                }
                return await wallet.signMessage(message.raw);
            },
            async signTransaction(_) {
                throw new Error("Not supported");
            },
            async signTypedData(typedData) {
                return wallet.signTypedData(typedData.domain, typedData.types, typedData.message);
            }
        });
    }
    if ("type" in signer && signer.type === "local") {
        return signer;
    }
    let walletClient = undefined;
    if ("request" in signer) {
        if (!address) {
            try {
                ;
                [address] = await signer.request({
                    method: "eth_requestAccounts"
                });
            }
            catch {
                ;
                [address] = await signer.request({
                    method: "eth_accounts"
                });
            }
        }
        if (!address) {
            // For TS to be happy
            throw new Error("address is required");
        }
        walletClient = createWalletClient({
            account: address,
            transport: custom(signer)
        });
    }
    if (!walletClient) {
        walletClient = signer;
    }
    const addressFromWalletClient = walletClient?.account?.address ?? (await walletClient?.getAddresses())?.[0];
    if (!addressFromWalletClient) {
        throw new Error("address not found in wallet client");
    }
    return toAccount({
        address: addressFromWalletClient,
        async signMessage({ message }) {
            return walletClient.signMessage({ message });
        },
        async signTypedData(typedData) {
            return getAction(walletClient, signTypedData, "signTypedData")(typedData);
        },
        async signTransaction(_) {
            throw new Error("Smart account signer doesn't need to sign transactions");
        }
    });
}
//# sourceMappingURL=toSigner.js.map