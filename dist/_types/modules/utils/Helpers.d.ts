import { type ByteArray, type Chain, type Client, type Hex, type Transport } from "viem";
import type { AnyData, ModularSmartAccount } from "./Types.js";
/**
 * Represents a hardcoded hex value reference.
 * Used when you want to bypass automatic hex conversion.
 */
export type HardcodedReference = {
    /** The raw hex value */
    raw: Hex;
};
/**
 * Base types that can be converted to hex references.
 */
type BaseReferenceValue = string | number | bigint | boolean | ByteArray;
/**
 * Union type of all possible reference values that can be converted to hex.
 * Includes both basic types and hardcoded references.
 */
export type AnyReferenceValue = BaseReferenceValue | HardcodedReference;
/**
 * Parses a reference value into a 32-byte hex string.
 * Handles various input types including Ethereum addresses, numbers, booleans, and raw hex values.
 *
 * @param referenceValue - The value to convert to hex
 * @returns A 32-byte hex string (66 characters including '0x' prefix)
 *
 * @throws {Error} If the resulting hex string is invalid or not 32 bytes
 */
export declare function parseReferenceValue(referenceValue: AnyReferenceValue): Hex;
/**
 * Extracts and validates the active module from a client's account.
 *
 * @param client - The viem Client instance with an optional modular smart account
 * @returns The active module from the account
 *
 * @throws {Error} If no module is currently activated
 */
export declare const parseModule: <TModularSmartAccount extends ModularSmartAccount | undefined, chain extends Chain | undefined>(client: Client<Transport, chain, TModularSmartAccount>) => AnyData;
/**
 * Sanitizes an ECDSA signature by ensuring the 'v' value is either 27 or 28.
 * Also ensures the signature has a '0x' prefix.
 *
 * @param signature - The hex signature to sanitize
 * @returns A properly formatted signature with correct 'v' value
 */
export declare function sanitizeSignature(signature: Hex): Hex;
export {};
//# sourceMappingURL=Helpers.d.ts.map