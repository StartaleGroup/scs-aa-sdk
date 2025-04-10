import type { Chain, Client, SignMessageParameters, SignMessageReturnType, Transport } from "viem";
import type { SmartAccount } from "viem/account-abstraction";
/**
 * Signs a message using the smart account.
 *
 * This function calculates an Ethereum-specific signature in [EIP-191 format](https://eips.ethereum.org/EIPS/eip-191):
 * `keccak256("\x19Ethereum Signed Message:\n" + len(message) + message))`.
 *
 * @param client - The client instance.
 * @param parameters - Parameters for signing the message.
 * @returns The signature as a hexadecimal string.
 * @throws {AccountNotFoundError} If the account is not found.
 *
 * @example
 * import { signMessage } from '@biconomy/abstractjs'
 *
 * const signature = await signMessage(nexusClient, {
 *   message: 'Hello, Biconomy!'
 * })
 * console.log(signature) // '0x...'
 */
export declare function signMessage<TAccount extends SmartAccount | undefined>(client: Client<Transport, Chain | undefined, TAccount>, { account: account_, message }: SignMessageParameters<TAccount>): Promise<SignMessageReturnType>;
//# sourceMappingURL=signMessage.d.ts.map