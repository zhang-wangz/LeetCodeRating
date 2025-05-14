"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseError = void 0;
const MESSAGES = {
    "unterminated-string": "Unterminated string constant",
    "unterminated-table-key": "Unterminated table-key",
    "unterminated-array": "Unterminated array",
    "unterminated-inline-table": "Unterminated inline table",
    "missing-key": "Empty bare keys are not allowed",
    "missing-newline": "Must be a newline",
    "missing-equals-sign": "Expected equal (=) token",
    "missing-value": "Unspecified values are invalid",
    "missing-comma": "Expected comma (,) token",
    "dupe-keys": "Defining a key multiple times is invalid",
    "unexpected-char": "Unexpected character",
    "unexpected-token": "Unexpected token",
    "invalid-control-character": "Control characters (codes < 0x1f and 0x7f) are not allowed",
    "invalid-comment-character": "Invalid code point {{cp}} within comments",
    "invalid-key-value-newline": "The key, equals sign, and value must be on the same line",
    "invalid-inline-table-newline": "No newlines are allowed between the curly braces unless they are valid within a value",
    "invalid-underscore": "Underscores are allowed between digits",
    "invalid-space": "Unexpected spaces",
    "invalid-three-quotes": "Three or more quotes are not permitted",
    "invalid-date": "Unexpected invalid date",
    "invalid-time": "Unexpected invalid time",
    "invalid-leading-zero": "Leading zeros are not allowed",
    "invalid-trailing-comma-in-inline-table": "Trailing comma is not permitted in an inline table",
    "invalid-char-in-escape-sequence": "Invalid character in escape sequence",
    "invalid-code-point": "Invalid code point {{cp}}",
};
/**
 * Get message from error code
 */
function getMessage(code, data) {
    if (data) {
        return MESSAGES[code].replace(/\{\{(.*?)\}\}/gu, (_, name) => {
            if (name in data) {
                return data[name];
            }
            return `{{${name}}}`;
        });
    }
    return MESSAGES[code];
}
/**
 * TOML parse errors.
 */
class ParseError extends SyntaxError {
    /**
     * Initialize this ParseError instance.
     *
     */
    constructor(code, offset, line, column, data) {
        super(getMessage(code, data));
        this.index = offset;
        this.lineNumber = line;
        this.column = column;
    }
}
exports.ParseError = ParseError;
