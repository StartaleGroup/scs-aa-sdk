import type { Chain, Client, Hex, Transport } from "viem";
import { type FormatUserOperationRequestErrorType, type PrepareUserOperationErrorType, type SendUserOperationParameters, type SmartAccount } from "viem/account-abstraction";
import type { RequestErrorType } from "viem/utils";
export type DebugUserOperationParameters = SendUserOperationParameters;
export type DebugUserOperationReturnType = Hex;
export type DebugUserOperationErrorType = FormatUserOperationRequestErrorType | PrepareUserOperationErrorType | RequestErrorType;
/**
 * Broadcasts a User Operation to the Bundler.
 *
 * - Docs: https://viem.sh/actions/bundler/debugUserOperation
 *
 * @param client - Client to use
 * @param parameters - {@link DebugUserOperationParameters}
 * @returns The User Operation hash. {@link DebugUserOperationReturnType}
 *
 * @example
 * import { createBundlerClient, http, parseEther } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { toSmartAccount } from 'viem/accounts'
 * import { debugUserOperation } from 'viem/actions'
 *
 * const account = await toSmartAccount({ ... })
 *
 * const bundlerClient = createBundlerClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 *
 * const values = await debugUserOperation(bundlerClient, {
 *   account,
 *   calls: [{ to: '0x...', value: parseEther('1') }],
 * })
 */
export declare function debugUserOperation<account extends SmartAccount | undefined>(client: Client<Transport, Chain | undefined, account>, parameters: DebugUserOperationParameters): Promise<`0x${string}`>;
//# sourceMappingURL=debugUserOperation.d.ts.map