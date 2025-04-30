import { isHex, pad, toHex } from "viem";
import { ERROR_MESSAGES } from "../../account/index.js";
/**
 * Parses a reference value into a 32-byte hex string.
 * Handles various input types including Ethereum addresses, numbers, booleans, and raw hex values.
 *
 * @param referenceValue - The value to convert to hex
 * @returns A 32-byte hex string (66 characters including '0x' prefix)
 *
 * @throws {Error} If the resulting hex string is invalid or not 32 bytes
 */
export function parseReferenceValue(referenceValue) {
    let result;
    // Handle 20-byte Ethereum address
    if (isHex(referenceValue) && referenceValue.length === 42) {
        // Remove '0x' prefix, pad to 32 bytes (64 characters) on the left, then add '0x' prefix back
        result = `0x${"0".repeat(24)}${referenceValue.slice(2)}`;
    }
    else if (referenceValue?.raw) {
        result = referenceValue?.raw;
    }
    else if (typeof referenceValue === "bigint") {
        result = pad(toHex(referenceValue), { size: 32 });
    }
    else if (typeof referenceValue === "number") {
        result = pad(toHex(BigInt(referenceValue)), { size: 32 });
    }
    else if (typeof referenceValue === "boolean") {
        result = pad(toHex(referenceValue), { size: 32 });
    }
    else if (isHex(referenceValue)) {
        // review
        result = referenceValue;
    }
    else if (typeof referenceValue === "string") {
        result = pad(referenceValue, { size: 32 });
    }
    else {
        // (typeof referenceValue === "object")
        result = pad(toHex(referenceValue), { size: 32 });
    }
    if (!isHex(result) || result.length !== 66) {
        throw new Error(ERROR_MESSAGES.INVALID_HEX);
    }
    return result;
}
/**
 * Extracts and validates the active module from a client's account.
 *
 * @param client - The viem Client instance with an optional modular smart account
 * @returns The active module from the account
 *
 * @throws {Error} If no module is currently activated
 */
export const parseModule = (client) => {
    const activeModule = client?.account?.getModule();
    if (!activeModule) {
        throw new Error(ERROR_MESSAGES.MODULE_NOT_ACTIVATED);
    }
    return activeModule;
};
/**
 * Sanitizes an ECDSA signature by ensuring the 'v' value is either 27 or 28.
 * Also ensures the signature has a '0x' prefix.
 *
 * @param signature - The hex signature to sanitize
 * @returns A properly formatted signature with correct 'v' value
 */
export function sanitizeSignature(signature) {
    let signature_ = signature;
    const potentiallyIncorrectV = Number.parseInt(signature_.slice(-2), 16);
    if (![27, 28].includes(potentiallyIncorrectV)) {
        const correctV = potentiallyIncorrectV + 27;
        signature_ = signature_.slice(0, -2) + correctV.toString(16);
    }
    if (signature.slice(0, 2) !== "0x") {
        signature_ = `0x${signature_}`;
    }
    return signature_;
}
//# sourceMappingURL=Helpers.js.map