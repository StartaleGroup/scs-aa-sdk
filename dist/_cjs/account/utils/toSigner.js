"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toSigner = toSigner;
const viem_1 = require("viem");
const accounts_1 = require("viem/accounts");
const actions_1 = require("viem/actions");
const utils_1 = require("viem/utils");
async function toSigner({ signer, address }) {
    if (!signer) {
        throw new Error("Signer is required");
    }
    if ("provider" in signer) {
        const wallet = signer;
        const address = await wallet.getAddress();
        return (0, accounts_1.toAccount)({
            address: (0, viem_1.getAddress)(address),
            async signMessage({ message }) {
                if (typeof message === "string") {
                    return await wallet.signMessage(message);
                }
                if (typeof message?.raw === "string") {
                    return await wallet.signMessage((0, viem_1.hexToBytes)(message.raw));
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
            throw new Error("address is required");
        }
        walletClient = (0, viem_1.createWalletClient)({
            account: address,
            transport: (0, viem_1.custom)(signer)
        });
    }
    if (!walletClient) {
        walletClient = signer;
    }
    const addressFromWalletClient = walletClient?.account?.address ?? (await walletClient?.getAddresses())?.[0];
    if (!addressFromWalletClient) {
        throw new Error("address not found in wallet client");
    }
    return (0, accounts_1.toAccount)({
        address: addressFromWalletClient,
        async signMessage({ message }) {
            return walletClient.signMessage({ message });
        },
        async signTypedData(typedData) {
            return (0, utils_1.getAction)(walletClient, actions_1.signTypedData, "signTypedData")(typedData);
        },
        async signTransaction(_) {
            throw new Error("Smart account signer doesn't need to sign transactions");
        }
    });
}
//# sourceMappingURL=toSigner.js.map