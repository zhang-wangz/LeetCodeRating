import type { TOMLBare, TOMLQuoted } from "../ast";
/**
 * Get the last element from given array
 */
export declare function last<T>(arr: T[]): T | null;
/**
 * Node to key name
 */
export declare function toKeyName(node: TOMLBare | TOMLQuoted): string;
