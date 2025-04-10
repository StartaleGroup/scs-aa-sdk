import type { AnyData } from "../../modules/utils/Types";
export declare const isDebugging: () => boolean;
export declare const isStaging: () => boolean;
export declare const bigIntReplacer: (_: string, value: AnyData) => AnyData;
/**
 * @internal
 * Returns a random integer between min and max
 * @param min - The minimum value (inclusive)
 * @param max - The maximum value (inclusive)
 * @returns A random integer between min and max
 */
export declare const getRandomInt: (min?: number, max?: number) => number;
/**
 * @internal
 * Returns a random bigint between min and max
 * @param min - The minimum value (inclusive)
 * @param max - The maximum value (inclusive)
 * @returns A random bigint between min and max
 */
export declare const getRandomBigInt: (min?: bigint, max?: bigint) => bigint;
//# sourceMappingURL=Helpers.d.ts.map