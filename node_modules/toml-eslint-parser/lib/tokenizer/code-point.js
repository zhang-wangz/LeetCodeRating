"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUnicodeScalarValue = exports.isLowSurrogate = exports.isHighSurrogate = exports.isOctalDig = exports.isHexDig = exports.isDigit = exports.isLetter = exports.isEOL = exports.isWhitespace = exports.isControl = void 0;
/**
 * Check whether the code point is a control character.
 */
function isControl(cp) {
    return cp >= 0 /* CodePoint.NULL */ && cp <= 31 /* CodePoint.US */;
}
exports.isControl = isControl;
/**
 * Check whether the code point is a whitespace.
 */
function isWhitespace(cp) {
    return cp === 9 /* CodePoint.TABULATION */ || cp === 32 /* CodePoint.SPACE */;
}
exports.isWhitespace = isWhitespace;
/**
 * Check whether the code point is a end of line.
 */
function isEOL(cp) {
    return cp === 10 /* CodePoint.LINE_FEED */ || cp === 13 /* CodePoint.CARRIAGE_RETURN */;
}
exports.isEOL = isEOL;
/**
 * Check whether the code point is an uppercase letter character.
 */
function isUpperLetter(cp) {
    return cp >= 65 /* CodePoint.LATIN_CAPITAL_A */ && cp <= 90 /* CodePoint.LATIN_CAPITAL_Z */;
}
/**
 * Check whether the code point is a lowercase letter character.
 */
function isLowerLetter(cp) {
    return cp >= 97 /* CodePoint.LATIN_SMALL_A */ && cp <= 122 /* CodePoint.LATIN_SMALL_Z */;
}
/**
 * Check whether the code point is a letter character.
 */
function isLetter(cp) {
    return isLowerLetter(cp) || isUpperLetter(cp);
}
exports.isLetter = isLetter;
/**
 * Check whether the code point is a digit character.
 */
function isDigit(cp) {
    return cp >= 48 /* CodePoint.DIGIT_0 */ && cp <= 57 /* CodePoint.DIGIT_9 */;
}
exports.isDigit = isDigit;
/**
 * Check whether the code point is a hex digit character.
 */
function isHexDig(cp) {
    return (isDigit(cp) ||
        (cp >= 97 /* CodePoint.LATIN_SMALL_A */ && cp <= 102 /* CodePoint.LATIN_SMALL_F */) ||
        (cp >= 65 /* CodePoint.LATIN_CAPITAL_A */ && cp <= 70 /* CodePoint.LATIN_CAPITAL_F */));
}
exports.isHexDig = isHexDig;
/**
 * Check whether the code point is a octal digit character.
 */
function isOctalDig(cp) {
    return cp >= 48 /* CodePoint.DIGIT_0 */ && cp <= 55 /* CodePoint.DIGIT_7 */;
}
exports.isOctalDig = isOctalDig;
/**
 * Check whether the code point is a high-surrogate code point.
 */
function isHighSurrogate(cp) {
    return cp >= 0xd800 && cp <= 0xdfff;
}
exports.isHighSurrogate = isHighSurrogate;
/**
 * Check whether the code point is a low-surrogate code point.
 */
function isLowSurrogate(cp) {
    return cp >= 0xdc00 && cp <= 0xdfff;
}
exports.isLowSurrogate = isLowSurrogate;
/**
 * Check whether the code point is valid code point.
 *
 * see
 * - https://unicode.org/glossary/#unicode_scalar_value
 * - https://toml.io/en/v1.0.0#string
 */
function isUnicodeScalarValue(cp) {
    return (cp >= 0 && cp <= 0xd7ff) || (cp >= 0xe000 && cp <= 0x10ffff);
}
exports.isUnicodeScalarValue = isUnicodeScalarValue;
