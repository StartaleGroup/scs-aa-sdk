import { type Account, type Address, type Chain, type ClientConfig, type Hex, type LocalAccount, type OneOf, type Prettify, type PublicClient, type RpcSchema, type Transport, type WalletClient } from "viem";
import { type SmartAccount, type SmartAccountImplementation, type UserOperation } from "viem/account-abstraction";
import { EntrypointAbi } from "../constants/abi";
import type { ComposableCall } from "../modules";
import type { Validator } from "../modules/validators/toValidator";
import type { Module } from "../modules/utils/Types";
import type { Call } from "./utils/Types";
import { type EthersWallet } from "./utils/Utils";
import { type EthereumProvider, type Signer } from "./utils/toSigner";
/**
 * Base module configuration type
 */
export type MinimalModuleConfig = {
    module: Address;
    data: Hex;
};
/**
 * Generic module configuration type that can be extended with additional properties
 */
export type GenericModuleConfig<T extends MinimalModuleConfig = MinimalModuleConfig> = T;
export type PrevalidationHookModuleConfig = GenericModuleConfig & {
    hookType: bigint;
};
/**
 * Parameters for creating a Startale Smart Account
 */
export type ToStartaleSmartAccountParameters = {
    /** The blockchain network */
    chain: Chain;
    /** The transport configuration */
    transport: ClientConfig["transport"];
    /** The signer account or address */
    signer: OneOf<EthereumProvider | WalletClient<Transport, Chain | undefined, Account> | LocalAccount | EthersWallet>;
    /** Optional index for the account */
    index?: bigint | undefined;
    /** Optional account address override */
    accountAddress?: Address;
    /** Optional validator modules configuration */
    validators?: Array<Validator>;
    /** Optional executor modules configuration */
    executors?: Array<GenericModuleConfig>;
    /** Optional prevalidation hook modules configuration */
    prevalidationHooks?: Array<PrevalidationHookModuleConfig>;
    /** Optional hook module configuration */
    hook?: GenericModuleConfig;
    /** Optional fallback modules configuration */
    fallbacks?: Array<GenericModuleConfig>;
    /** Optional registry address */
    registryAddress?: Address;
    /** Optional factory address */
    factoryAddress?: Address;
    /** Optional bootstrap address */
    bootStrapAddress?: Address;
} & Prettify<Pick<ClientConfig<Transport, Chain, Account, RpcSchema>, "account" | "cacheTime" | "chain" | "key" | "name" | "pollingInterval" | "rpcSchema">>;
/**
 * Startale Smart Account type
 */
export type StartaleSmartAccount = Prettify<SmartAccount<StartaleSmartAccountImplementation>>;
/**
 * Startale Smart Account Implementation
 */
export type StartaleSmartAccountImplementation = SmartAccountImplementation<typeof EntrypointAbi, "0.7", {
    /** Gets the counterfactual address of the account */
    getAddress: () => Promise<Address>;
    /** Gets the init code for the account */
    getInitCode: () => Hex;
    /** Encodes a single call for execution */
    encodeExecute: (call: Call) => Promise<Hex>;
    /** Encodes a batch of calls for execution */
    encodeExecuteBatch: (calls: readonly Call[]) => Promise<Hex>;
    /** Encodes a composable call for execution */
    encodeExecuteComposable: (calls: ComposableCall[]) => Promise<Hex>;
    /** Calculates the hash of a user operation */
    getUserOpHash: (userOp: UserOperation) => Hex;
    /** Factory data used for account creation */
    factoryData: Hex;
    /** Factory address used for account creation */
    factoryAddress: Address;
    /** The signer instance */
    signer: Signer;
    /** The public client instance */
    publicClient: PublicClient;
    /** The wallet client instance */
    walletClient: WalletClient;
    /** The blockchain network */
    chain: Chain;
    /** Get the active module */
    getModule: () => Validator;
    /** Set the active module */
    setModule: (validationModule: Module) => void;
}>;
/**
 * @description Create a Startale Smart Account.
 *
 * @param parameters - {@link ToStartaleSmartAccountParameters}
 * @returns Startale Smart Account. {@link StartaleSmartAccount}
 *
 * @example
 * import { toStartaleAccount } from 'startale-aa-sdk'
 * import { createWalletClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 *
 * const account = await toStartaleAccount({
 *   chain: mainnet,
 *   transport: http(),
 *   signer: '0x...',
 * })
 */
export declare const toStartaleSmartAccount: (parameters: ToStartaleSmartAccountParameters) => Promise<StartaleSmartAccount>;
//# sourceMappingURL=toStartaleSmartAccount.d.ts.map