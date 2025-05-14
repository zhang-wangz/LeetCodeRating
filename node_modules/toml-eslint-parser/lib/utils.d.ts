import type { TOMLArray, TOMLBare, TOMLContentNode, TOMLInlineTable, TOMLKey, TOMLKeyValue, TOMLNode, TOMLProgram, TOMLQuoted, TOMLStringValue, TOMLTable, TOMLTopLevelTable, TOMLValue } from "./ast";
type TOMLContentValue<V> = V | TOMLContentValue<V>[] | TOMLTableValue<V>;
type TOMLTableValue<V> = {
    [key: string]: TOMLContentValue<V>;
};
export type ConvertTOMLValue<V> = {
    (node: TOMLValue): V;
    (node: TOMLArray): TOMLContentValue<V>[];
    (node: TOMLContentNode): TOMLContentValue<V>;
    (node: TOMLProgram | TOMLTopLevelTable | TOMLTable | TOMLKeyValue | TOMLInlineTable): TOMLTableValue<V>;
    (node: TOMLStringValue | TOMLBare | TOMLQuoted): string;
    (node: TOMLKey): string[];
    (node: TOMLNode): TOMLContentValue<V> | string | string[];
};
export type GetStaticTOMLValue = ConvertTOMLValue<TOMLValue["value"]>;
/**
 * Gets the static value for the given node.
 */
export declare const getStaticTOMLValue: GetStaticTOMLValue;
/** Generates a converter to convert from a node. */
export declare function generateConvertTOMLValue<V>(convertValue: (node: TOMLValue) => V): ConvertTOMLValue<V>;
export {};
