import { type BundlerRpcSchema, type Chain, type Client, type OneOf, type Prettify, type RpcSchema, type Transport } from "viem";
import { type BundlerActions, type BundlerClientConfig } from "viem/account-abstraction";
import type { AnyData, ModularSmartAccount } from "../modules/utils/Types";
import { type BicoActions } from "./decorators/bundler";
import { type Erc7579Actions } from "./decorators/erc7579";
import { type SmartAccountActions } from "./decorators/smartAccount";
/**
 * Nexus Client type
 */
export type NexusClient<transport extends Transport = Transport, chain extends Chain | undefined = Chain | undefined, account extends ModularSmartAccount | undefined = ModularSmartAccount | undefined, client extends Client | undefined = Client | undefined, rpcSchema extends RpcSchema | undefined = undefined> = Prettify<Client<transport, chain extends Chain ? chain : client extends Client<AnyData, infer chain> ? chain : undefined, account, rpcSchema extends RpcSchema ? [...BundlerRpcSchema, ...rpcSchema] : BundlerRpcSchema, BundlerActions<account>>> & BundlerActions<ModularSmartAccount> & BicoActions & Erc7579Actions<ModularSmartAccount> & SmartAccountActions<chain, ModularSmartAccount> & {
    /**
     * Whether to use the test bundler. Conditionally used by the `getGasFeeValues` decorator.
     */
    mock: boolean;
    /**
     * The Nexus account associated with this client
     */
    account: ModularSmartAccount;
    /**
     * Optional client for additional functionality
     */
    client?: client | Client | undefined;
    /**
     * Optional paymaster configuration
     */
    paymaster?: BundlerClientConfig["paymaster"] | undefined;
    /**
     * Optional paymaster context
     */
    paymasterContext?: unknown;
    /**
     * Optional user operation configuration
     */
    userOperation?: BundlerClientConfig["userOperation"] | undefined;
};
type BicoBundlerClientConfig = Omit<BundlerClientConfig, "transport"> & {
    /**
     * Whether to use the test bundler. Conditionally used by the `getGasFeeValues` decorator.
     */
    mock?: boolean;
} & OneOf<{
    transport: Transport;
} | {
    bundlerUrl: string;
} | {
    apiKey?: string;
}>;
/**
 * Creates a Bico Bundler Client with a given Transport configured for a Chain.
 *
 * @param parameters - Configuration for the Bico Bundler Client
 * @returns A Bico Bundler Client
 *
 * @example
 * import { createBicoBundlerClient, http } from '@biconomy/abstractjs'
 * import { mainnet } from 'viem/chains'
 *
 * const bundlerClient = createBicoBundlerClient({ chain: mainnet });
 */
export declare const createBicoBundlerClient: (parameters: BicoBundlerClientConfig) => NexusClient<Transport, Chain | undefined, ModularSmartAccount | undefined, Client | undefined, undefined>;
export declare const createSmartAccountClient: (parameters: BicoBundlerClientConfig) => NexusClient<Transport, Chain | undefined, ModularSmartAccount | undefined, Client | undefined, undefined>;
export declare const createNexusClient: (parameters: BicoBundlerClientConfig) => NexusClient<Transport, Chain | undefined, ModularSmartAccount | undefined, Client | undefined, undefined>;
export declare const createNexusSessionClient: (parameters: BicoBundlerClientConfig) => NexusClient<Transport, Chain | undefined, ModularSmartAccount | undefined, Client | undefined, undefined>;
export type BicoBundlerClient = NexusClient;
export {};
//# sourceMappingURL=createBicoBundlerClient.d.ts.map