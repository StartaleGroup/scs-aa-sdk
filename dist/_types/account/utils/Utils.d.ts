import { type Address, type Client, type Hash, type Hex, type PublicClient, type TypedData, type TypedDataDomain, type TypedDataParameter } from "viem";
import { type AnyData, type ModuleType } from "../../modules/utils/Types";
import type { AccountMetadata } from "./Types";
/**
 * Type guard to check if a value is null or undefined.
 *
 * @param value - The value to check
 * @returns True if the value is null or undefined
 */
export declare const isNullOrUndefined: (value: AnyData) => value is undefined;
/**
 * Validates if a string is a valid RPC URL.
 *
 * @param url - The URL to validate
 * @returns True if the URL is a valid RPC endpoint
 */
export declare const isValidRpcUrl: (url: string) => boolean;
/**
 * Compares two addresses for equality, case-insensitive.
 *
 * @param a - First address
 * @param b - Second address
 * @returns True if addresses are equal
 */
export declare const addressEquals: (a?: string, b?: string) => boolean;
/**
 * Parameters for wrapping a signature according to EIP-6492.
 */
export type SignWith6492Params = {
    /** The factory contract address */
    factoryAddress: Address;
    /** The factory initialization calldata */
    factoryCalldata: Hex;
    /** The original signature to wrap */
    signature: Hash;
};
/**
 * Wraps a signature according to EIP-6492 specification.
 *
 * @param params - Parameters including factory address, calldata, and signature
 * @returns The wrapped signature
 */
export declare const wrapSignatureWith6492: ({ factoryAddress, factoryCalldata, signature }: SignWith6492Params) => Hash;
/**
 * Calculates the percentage of a partial value relative to a total value.
 *
 * @param partialValue - The partial value
 * @param totalValue - The total value
 * @returns The percentage as a number
 */
export declare function percentage(partialValue: number, totalValue: number): number;
/**
 * Converts a percentage to a factor (e.g., 50% -> 1.5).
 *
 * @param percentage - The percentage value (1-100)
 * @returns The converted factor
 * @throws If percentage is outside valid range
 */
export declare function convertToFactor(percentage: number | undefined): number;
/**
 * Generates installation data and hash for module installation.
 *
 * @param accountOwner - The account owner address
 * @param modules - Array of modules with their types and configurations
 * @param domainName - Optional domain name
 * @param domainVersion - Optional domain version
 * @returns Tuple of [installData, hash]
 */
export declare function makeInstallDataAndHash(accountOwner: Address, modules: {
    type: ModuleType;
    config: Hex;
}[], domainName?: string, domainVersion?: string): [string, string];
export declare function _hashTypedData(structHash: Hex, name: string, version: string, verifyingContract: Address): string;
export declare function getTypesForEIP712Domain({ domain }: {
    domain?: TypedDataDomain | undefined;
}): TypedDataParameter[];
/**
 * Retrieves account metadata including name, version, and chain ID.
 *
 * @param client - The viem Client instance
 * @param accountAddress - The account address to query
 * @returns Promise resolving to account metadata
 */
export declare const getAccountMeta: (client: Client, accountAddress: Address) => Promise<AccountMetadata>;
/**
 * Wraps a typed data hash with EIP-712 domain separator.
 *
 * @param typedHash - The hash to wrap
 * @param appDomainSeparator - The domain separator
 * @returns The wrapped hash
 */
export declare const eip712WrapHash: (typedHash: Hex, appDomainSeparator: Hex) => Hex;
export type TypedDataWith712 = {
    EIP712Domain: TypedDataParameter[];
} & TypedData;
export declare function typeToString(typeDef: TypedDataWith712): string[];
/** @ignore */
export declare function bigIntReplacer(_key: string, value: AnyData): any;
export declare function numberTo3Bytes(key: bigint): Uint8Array;
export declare function toHexString(byteArray: Uint8Array): string;
export declare const getAccountDomainStructFields: (publicClient: PublicClient, accountAddress: Address) => Promise<`0x${string}`>;
export declare const inProduction: () => boolean;
export declare const playgroundTrue: () => boolean;
type TenderlyDetails = {
    accountSlug: string;
    projectSlug: string;
    apiKey: string;
};
export declare const getTenderlyDetails: () => TenderlyDetails | null;
/**
 * Safely multiplies a bigint by a number, rounding appropriately.
 *
 * @param bI - The bigint to multiply
 * @param multiplier - The multiplication factor
 * @returns The multiplied bigint
 */
export declare const safeMultiplier: (bI: bigint, multiplier: number) => bigint;
export type EthersWallet = {
    signTransaction: (...args: AnyData[]) => Promise<AnyData>;
    signMessage: (...args: AnyData[]) => Promise<AnyData>;
    signTypedData: (...args: AnyData[]) => Promise<AnyData>;
    getAddress: () => Promise<AnyData>;
    address: Address;
    provider: AnyData;
};
export declare const getAllowance: (client: PublicClient, owner: Address, tokenAddress: Address, grantee?: `0x${string}`) => Promise<bigint>;
export declare function parseRequestArguments(input: string[]): Record<string, string | number>;
export {};
//# sourceMappingURL=Utils.d.ts.map