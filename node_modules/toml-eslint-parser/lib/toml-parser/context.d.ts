import type { ErrorCode } from "../errors";
import type { Comment, Token, TOMLArray, TOMLContentNode, TOMLKeyValue, TOMLNode, TOMLTable, TOMLTopLevelTable } from "../ast";
import type { ParserOptions } from "../parser-options";
export type ValueContainer = {
    parent: TOMLKeyValue | TOMLArray;
    set(valueNode: TOMLContentNode): ParserState[];
};
export type ParserState = "TABLE" | "VALUE";
export declare class Context {
    private readonly tokenizer;
    readonly tokens: Token[];
    readonly comments: Comment[];
    private back;
    stateStack: ParserState[];
    needNewLine: boolean;
    needSameLine: false | ErrorCode;
    private currToken;
    private prevToken;
    topLevelTable: TOMLTopLevelTable;
    table: TOMLTopLevelTable | TOMLTable;
    private readonly keysResolver;
    private readonly valueContainerStack;
    constructor(data: {
        text: string;
        parserOptions?: ParserOptions;
        topLevelTable: TOMLTopLevelTable;
    });
    get startPos(): {
        offset: number;
        line: number;
        column: number;
    };
    get endPos(): {
        offset: number;
        line: number;
        column: number;
    };
    /**
     * Get the next token.
     */
    nextToken(option?: {
        needSameLine?: ErrorCode;
        valuesEnabled?: boolean;
    }): Token | null;
    private _nextTokenFromTokenizer;
    backToken(): void;
    addValueContainer(valueContainer: ValueContainer): void;
    consumeValueContainer(): ValueContainer;
    applyResolveKeyForTable(node: TOMLTable): void;
    verifyDuplicateKeys(): void;
    /**
     * Report an invalid token error.
     */
    reportParseError(code: ErrorCode, token: Token | TOMLNode | null): any;
}
