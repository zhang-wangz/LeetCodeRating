declare const MESSAGES: {
    "unterminated-string": string;
    "unterminated-table-key": string;
    "unterminated-array": string;
    "unterminated-inline-table": string;
    "missing-key": string;
    "missing-newline": string;
    "missing-equals-sign": string;
    "missing-value": string;
    "missing-comma": string;
    "dupe-keys": string;
    "unexpected-char": string;
    "unexpected-token": string;
    "invalid-control-character": string;
    "invalid-comment-character": string;
    "invalid-key-value-newline": string;
    "invalid-inline-table-newline": string;
    "invalid-underscore": string;
    "invalid-space": string;
    "invalid-three-quotes": string;
    "invalid-date": string;
    "invalid-time": string;
    "invalid-leading-zero": string;
    "invalid-trailing-comma-in-inline-table": string;
    "invalid-char-in-escape-sequence": string;
    "invalid-code-point": string;
};
/**
 * TOML parse errors.
 */
export declare class ParseError extends SyntaxError {
    index: number;
    lineNumber: number;
    column: number;
    /**
     * Initialize this ParseError instance.
     *
     */
    constructor(code: ErrorCode, offset: number, line: number, column: number, data?: {
        [key: string]: any;
    });
}
export type ErrorCode = keyof typeof MESSAGES;
export {};
