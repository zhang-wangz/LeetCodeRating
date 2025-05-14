import type { TOMLProgram } from "../ast";
import { type ParserOptions } from "../parser-options";
export declare class TOMLParser {
    private readonly text;
    private readonly parserOptions;
    private readonly tomlVersion;
    /**
     * Initialize this parser.
     */
    constructor(text: string, parserOptions?: ParserOptions);
    /**
     * Parse TOML
     */
    parse(): TOMLProgram;
    private TABLE;
    private VALUE;
    private processTable;
    private processKeyValue;
    private processKeyNode;
    private processBareKey;
    private processStringKey;
    private processStringValue;
    private processNumberValue;
    private processBooleanValue;
    private processDateTimeValue;
    private processArray;
    private processArrayValue;
    private processInlineTable;
    private processInlineTableKeyValue;
}
