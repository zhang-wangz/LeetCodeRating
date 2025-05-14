import type { Comment, Token } from "../ast";
import { type ParserOptions } from "../parser-options";
type Position = {
    offset: number;
    line: number;
    column: number;
};
/**
 * Tokenizer for TOML.
 */
export declare class Tokenizer {
    readonly text: string;
    private readonly parserOptions;
    private readonly tomlVersion;
    private readonly ESCAPES;
    private readonly codePointIterator;
    private backCode;
    private lastCodePoint;
    private state;
    private token;
    private tokenStart;
    private data?;
    /**
     * The flag which enables values tokens.
     * If this is true, this tokenizer will generate Integer, Float, Boolean, Offset Date-Time, Local Date-Time ,Local Date, Local Time, Array and Inline Table tokens.
     */
    valuesEnabled: boolean;
    /**
     * Initialize this tokenizer.
     */
    constructor(text: string, parserOptions?: ParserOptions);
    get positions(): {
        start: Position;
        end: Position;
    };
    /**
     * Report an invalid character error.
     */
    private reportParseError;
    /**
     * Get the next token.
     */
    nextToken(): Token | Comment | null;
    /**
     * Get the next code point.
     */
    private nextCode;
    /**
     * Eat the next code point.
     */
    private eatCode;
    /**
     * Moves the character position to the given position.
     */
    private moveAt;
    /**
     * Back the current code point as the given state.
     */
    private back;
    private punctuatorToken;
    private startToken;
    private endToken;
    private DATA;
    private COMMENT;
    private BARE;
    private BASIC_STRING;
    private MULTI_LINE_BASIC_STRING;
    private LITERAL_STRING;
    private MULTI_LINE_LITERAL_STRING;
    private SIGN;
    private NAN_OR_INF;
    private NUMBER;
    private HEX;
    private OCTAL;
    private BINARY;
    private FRACTIONAL_RIGHT;
    private EXPONENT_RIGHT;
    private BOOLEAN;
    private DATE_MONTH;
    private DATE_DAY;
    private TIME_HOUR;
    private TIME_MINUTE;
    private TIME_SECOND;
    private TIME_SEC_FRAC;
    private processTimeEnd;
    private TIME_OFFSET;
    private parseDigits;
    private parseUnicode;
    private reportParseErrorControlChar;
}
export {};
