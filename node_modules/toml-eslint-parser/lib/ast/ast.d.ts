import type { HasLocs } from "./loc";
import type { Comment, Token } from "./token";
interface BaseTOMLNode extends HasLocs {
    type: string;
}
export type TOMLNode = TOMLProgram | TOMLTopLevelTable | TOMLTable | TOMLKeyValue | TOMLKey | TOMLBare | TOMLQuoted | TOMLContentNode;
export type TOMLContentNode = TOMLValue | TOMLArray | TOMLInlineTable;
export interface TOMLProgram extends BaseTOMLNode {
    type: "Program";
    body: [TOMLTopLevelTable];
    sourceType: "module";
    comments: Comment[];
    tokens: Token[];
    parent: null;
}
export interface TOMLTopLevelTable extends BaseTOMLNode {
    type: "TOMLTopLevelTable";
    body: (TOMLKeyValue | TOMLTable)[];
    parent: TOMLProgram;
}
export interface TOMLTable extends BaseTOMLNode {
    type: "TOMLTable";
    kind: "standard" | "array";
    key: TOMLKey;
    resolvedKey: (string | number)[];
    body: TOMLKeyValue[];
    parent: TOMLTopLevelTable;
}
export interface TOMLKeyValue extends BaseTOMLNode {
    type: "TOMLKeyValue";
    key: TOMLKey;
    value: TOMLContentNode;
    parent: TOMLTopLevelTable | TOMLTable | TOMLInlineTable;
}
export interface TOMLKey extends BaseTOMLNode {
    type: "TOMLKey";
    keys: (TOMLBare | TOMLQuoted)[];
    parent: TOMLKeyValue | TOMLTable;
}
export interface TOMLArray extends BaseTOMLNode {
    type: "TOMLArray";
    elements: TOMLContentNode[];
    parent: TOMLKeyValue | TOMLArray;
}
export interface TOMLInlineTable extends BaseTOMLNode {
    type: "TOMLInlineTable";
    body: TOMLKeyValue[];
    parent: TOMLKeyValue | TOMLArray;
}
export interface TOMLBare extends BaseTOMLNode {
    type: "TOMLBare";
    name: string;
    parent: TOMLKey;
}
export interface TOMLQuoted extends BaseTOMLNode {
    type: "TOMLQuoted";
    value: string;
    style: "basic" | "literal";
    parent: TOMLKey;
    kind: "string";
    multiline: false;
}
export type TOMLValue = TOMLStringValue | TOMLNumberValue | TOMLBooleanValue | TOMLDateTimeValue;
export interface TOMLStringValue extends BaseTOMLNode {
    type: "TOMLValue";
    kind: "string";
    value: string;
    style: "basic" | "literal";
    multiline: boolean;
    parent: TOMLKeyValue | TOMLArray;
}
export interface TOMLIntegerValue extends BaseTOMLNode {
    type: "TOMLValue";
    kind: "integer";
    value: number;
    bigint: bigint;
    number: string;
    parent: TOMLKeyValue | TOMLArray;
}
export interface TOMLFloatValue extends BaseTOMLNode {
    type: "TOMLValue";
    kind: "float";
    value: number;
    number: string;
    parent: TOMLKeyValue | TOMLArray;
}
export type TOMLNumberValue = TOMLIntegerValue | TOMLFloatValue;
export interface TOMLBooleanValue extends BaseTOMLNode {
    type: "TOMLValue";
    kind: "boolean";
    value: boolean;
    parent: TOMLKeyValue | TOMLArray;
}
export interface TOMLDateTimeValue extends BaseTOMLNode {
    type: "TOMLValue";
    kind: "offset-date-time" | "local-date-time" | "local-date" | "local-time";
    value: Date;
    datetime: string;
    parent: TOMLKeyValue | TOMLArray;
}
export {};
