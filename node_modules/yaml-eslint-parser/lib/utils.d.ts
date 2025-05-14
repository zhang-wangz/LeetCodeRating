import { type DocumentOptions } from "yaml";
import type { YAMLProgram, YAMLContent, YAMLDocument, YAMLMapping, YAMLSequence, YAMLScalar, YAMLAlias, YAMLPair, YAMLWithMeta } from "./ast";
export type YAMLVersion = NonNullable<DocumentOptions["version"]>;
export type YAMLContentValue = string | number | boolean | null | YAMLContentValue[] | YAMLMappingValue;
export type YAMLMappingValue = {
    [key: string]: YAMLContentValue;
    [key: number]: YAMLContentValue;
};
export declare function getStaticYAMLValue(node: YAMLMapping | YAMLPair): YAMLMappingValue;
export declare function getStaticYAMLValue(node: YAMLSequence): YAMLContentValue[];
export declare function getStaticYAMLValue(node: YAMLScalar): string | number | boolean | null;
export declare function getStaticYAMLValue(node: YAMLAlias | YAMLProgram | YAMLDocument | YAMLContent | YAMLPair | YAMLWithMeta): YAMLContentValue;
/**
 * Find the insertion position (index) of an item in an array with items sorted
 * in ascending order; so that `splice(sortedIndex, 0, item)` would result in
 * maintaining the array's sort-ness. The array can contain duplicates.
 * If the item already exists in the array the index would be of the *last*
 * occurrence of the item.
 *
 * Runs in O(logN) time.
 *
 * MIT License | Copyright (c) 2018 remeda | https://remedajs.com/
 *
 * The implementation is copied from remeda package:
 * https://github.com/remeda/remeda/blob/878206eb3e8ec1c7f1300b1909b7aa629810c8bb/src/sortedLastIndex.ts
 * https://github.com/remeda/remeda/blob/878206eb3e8ec1c7f1300b1909b7aa629810c8bb/src/internal/binarySearchCutoffIndex.ts#L1
 *
 * @param data - The (ascending) sorted array.
 * @param item - The item to insert.
 * @returns Insertion index (In the range 0..data.length).
 * @signature
 *    sortedLastIndex(data, item)
 * @example
 *    sortedLastIndex(['a','a','b','c','c'], 'c') // => 5
 */
export declare function sortedLastIndex<T>(array: readonly T[], item: T): number;
