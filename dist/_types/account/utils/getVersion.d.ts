import type { Hex } from "viem";
/**
 * Retrieves the current version of the SDK from package.json
 *
 * This function provides access to the version number defined in the package.json file,
 * which can be useful for logging, debugging, or feature compatibility checks.
 *
 * @returns {string} The current version of the SDK
 *
 * @example
 * ```typescript
 * import { getVersion } from '@biconomy/abstractjs'
 *
 * console.log(`Using Biconomy SDK version: ${getVersion()}`)
 * ```
 */
export declare function getVersion(): string;
/**
 * Compares two semantic version strings
 *
 * This function compares two semantic version strings (e.g., "1.2.3" and "1.3.0")
 * and determines their relative order.
 *
 * @param {string} a - First version string to compare
 * @param {string} b - Second version string to compare
 * @returns {number} Returns:
 *   - Negative number if version a is lower than version b
 *   - Zero if versions are equal
 *   - Positive number if version a is higher than version b
 *
 * @example
 * ```typescript
 * import { semverCompare } from '@biconomy/abstractjs'
 *
 * // Returns negative number (a < b)
 * semverCompare("1.2.3", "1.3.0")
 *
 * // Returns positive number (a > b)
 * semverCompare("2.0.0", "1.9.9")
 *
 * // Returns 0 (a === b)
 * semverCompare("1.2.3", "1.2.3")
 * ```
 */
export declare const semverCompare: (a: string, b: string) => number;
/**
 * Checks if a version meets or exceeds a required version
 *
 * This function determines if a given version is equal to or higher than
 * a required minimum version, which is useful for feature compatibility checks.
 *
 * @param {string} currentVersion - The version to check
 * @param {string} requiredVersion - The minimum required version
 * @returns {boolean} Returns true if currentVersion >= requiredVersion, false otherwise
 *
 * @example
 * ```typescript
 * import { versionMeetsRequirement } from '@biconomy/abstractjs'
 *
 * // Returns true (current version exceeds required)
 * versionMeetsRequirement("1.3.0", "1.2.0")
 *
 * // Returns false (current version below required)
 * versionMeetsRequirement("1.2.3", "1.3.0")
 *
 * // Returns true (versions are equal)
 * versionMeetsRequirement("1.2.3", "1.2.3")
 * ```
 */
export declare const versionMeetsRequirement: (currentVersion: string, requiredVersion: string) => boolean;
/**
 * Checks if a version is older than a specified version
 *
 * This function determines if a given version is lower than (comes before)
 * a specified version, which is useful for backward compatibility checks.
 *
 * @param {string} currentVersion - The version to check
 * @param {string} referenceVersion - The version to compare against
 * @returns {boolean} Returns true if currentVersion < referenceVersion, false otherwise
 *
 * @example
 * ```typescript
 * import { isVersionOlder } from '@biconomy/abstractjs'
 *
 * // Returns true (current version is older than reference)
 * isVersionOlder("1.2.0", "1.3.0")
 *
 * // Returns false (current version is newer than reference)
 * isVersionOlder("1.3.0", "1.2.3")
 *
 * // Returns false (versions are equal)
 * isVersionOlder("1.2.3", "1.2.3")
 * ```
 */
export declare const isVersionOlder: (currentVersion: string, referenceVersion: string) => boolean;
/**
 * Checks if a version is newer than a specified version
 *
 * This function determines if a given version is higher than (comes after)
 * a specified version, which is useful for forward compatibility checks.
 *
 * @param {string} currentVersion - The version to check
 * @param {string} referenceVersion - The version to compare against
 * @returns {boolean} Returns true if currentVersion > referenceVersion, false otherwise
 *
 * @example
 * ```typescript
 * import { isVersionNewer } from '@biconomy/abstractjs'
 *
 * // Returns true (current version is newer than reference)
 * isVersionNewer("1.3.0", "1.2.3")
 *
 * // Returns false (current version is older than reference)
 * isVersionNewer("1.2.0", "1.3.0")
 *
 * // Returns false (versions are equal)
 * isVersionNewer("1.2.3", "1.2.3")
 * ```
 */
export declare const isVersionNewer: (currentVersion: string, referenceVersion: string) => boolean;
export type AddressConfig = {
    /** The factory address for the account */
    factoryAddress: Hex;
    /** The bootstrap address for the account */
    bootStrapAddress: Hex;
    /** The validator address for the account */
    validatorAddress: Hex;
    /** The accountId for the account. Of the format biconomy.nexus.${major}.${minor}.${patch} */
    accountId: `biconomy.nexus.${number}.${number}.${number}`;
    /** The implementation address for the account */
    implementationAddress: Hex;
    /** The execution module address for the account */
    executorAddress: Hex;
};
//# sourceMappingURL=getVersion.d.ts.map