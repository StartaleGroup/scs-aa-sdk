import { type Account, type Address, type Chain, type ClientConfig, type Hex, type LocalAccount, type OneOf, type Prettify, type PublicClient, type RpcSchema, type SignAuthorizationReturnType, type Transport, type WalletClient } from "viem";
import { type SmartAccount, type SmartAccountImplementation, type UserOperation } from "viem/account-abstraction";
import { type StartaleAccountVersion } from "../constants";
import { EntrypointAbi } from "../constants/abi";
import type { Module } from "../modules/utils/Types";
import type { Validator } from "../modules/validators/toValidator";
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
    /**
     * Optional account address override. `getAddress()` returns this as-is with
     * no cross-check against the factory. If the account is already deployed at
     * this address, `accountVersion`/`factoryAddress` are irrelevant (factory
     * args get dropped once the account has code). If it is NOT yet deployed
     * here (e.g. deployed on one chain but not another), `accountVersion` /
     * `factoryAddress` must still match whichever factory originally produced
     * this exact address, or the deploy-time UserOperation will revert
     * (CREATE2 address depends on the factory's own address, so a mismatched
     * factory can't reproduce it).
     */
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
    /**
     * Optional account/contract version to deploy against. Defaults to the latest
     * ("1.0.1"). Use "1.0.0" to (re)deploy an account that was counterfactually
     * computed against the legacy v1.0.0 factory and may still be undeployed on
     * some chains. Ignored if the account is already deployed, and overridden by
     * explicit `factoryAddress` / `accountImplementationAddress` if provided.
     *
     * Note: this is NOT inferred from `accountAddress`. If you override
     * `accountAddress` with a legacy address that is still undeployed on this
     * chain, you must also set `accountVersion: "1.0.0"` (or the matching
     * `factoryAddress`) here — otherwise the SDK will build init code from the
     * default factory, which cannot reproduce that address, and the deploy will
     * revert on-chain.
     */
    accountVersion?: StartaleAccountVersion;
    /** Optional factory address. Overrides the address derived from `accountVersion` */
    factoryAddress?: Address;
    /** Optional bootstrap address */
    bootStrapAddress?: Address;
    /**
     * Optional account implementation / EIP-7702 delegation address.
     * Overrides the address derived from `accountVersion`
     */
    accountImplementationAddress?: Address;
    /** Optional EIP-7702 Authorization */
    eip7702Auth?: SignAuthorizationReturnType | undefined;
    /** Optional EIP-7702 Account */
    eip7702Account?: Signer;
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
    accountImplementationAddress: Address;
    /** Get the active module */
    getModule: () => Validator;
    /** Set the active module */
    setModule: (validationModule: Module) => void;
    /** EIP-7702 Authorization */
    eip7702Authorization?: (() => Promise<SignAuthorizationReturnType | undefined>) | undefined;
    /** Execute the transaction to unauthorize the account */
    unDelegate: () => Promise<Hex>;
    /** Check if the account is delegated to the implementation address */
    isDelegated: () => Promise<boolean>;
}>;
/**
 * @description Create a Startale Smart Account.
 *
 * @param parameters - {@link ToStartaleSmartAccountParameters}
 * @returns Startale Smart Account. {@link StartaleSmartAccount}
 *
 * @example
 * import { toStartaleAccount } from '@startale-scs/aa-sdk'
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