export declare const enum CodePoint {
    EOF = -1,
    NULL = 0,
    SOH = 1,
    BACKSPACE = 8,
    TABULATION = 9,
    LINE_FEED = 10,
    FORM_FEED = 12,
    CARRIAGE_RETURN = 13,
    ESCAPE = 27,
    SO = 14,
    US = 31,
    SPACE = 32,
    QUOTATION_MARK = 34,
    HASH = 35,
    SINGLE_QUOTE = 39,
    PLUS_SIGN = 43,
    COMMA = 44,
    DASH = 45,
    DOT = 46,
    DIGIT_0 = 48,
    DIGIT_1 = 49,
    DIGIT_2 = 50,
    DIGIT_3 = 51,
    DIGIT_7 = 55,
    DIGIT_9 = 57,
    COLON = 58,
    EQUALS_SIGN = 61,
    LATIN_CAPITAL_A = 65,
    LATIN_CAPITAL_E = 69,
    LATIN_CAPITAL_F = 70,
    LATIN_CAPITAL_T = 84,
    LATIN_CAPITAL_U = 85,
    LATIN_CAPITAL_Z = 90,
    LEFT_BRACKET = 91,
    BACKSLASH = 92,
    RIGHT_BRACKET = 93,
    UNDERSCORE = 95,
    LATIN_SMALL_A = 97,
    LATIN_SMALL_B = 98,
    LATIN_SMALL_E = 101,
    LATIN_SMALL_F = 102,
    LATIN_SMALL_I = 105,
    LATIN_SMALL_L = 108,
    LATIN_SMALL_N = 110,
    LATIN_SMALL_O = 111,
    LATIN_SMALL_R = 114,
    LATIN_SMALL_S = 115,
    LATIN_SMALL_T = 116,
    LATIN_SMALL_U = 117,
    LATIN_SMALL_X = 120,
    LATIN_SMALL_Z = 122,
    LEFT_BRACE = 123,
    RIGHT_BRACE = 125,
    DELETE = 127,
    PAD = 128,
    SUPERSCRIPT_TWO = 178,
    SUPERSCRIPT_THREE = 179,
    SUPERSCRIPT_ONE = 185,
    VULGAR_FRACTION_ONE_QUARTER = 188,
    VULGAR_FRACTION_THREE_QUARTERS = 190,
    LATIN_CAPITAL_LETTER_A_WITH_GRAVE = 192,
    LATIN_CAPITAL_LETTER_O_WITH_DIAERESIS = 214,
    LATIN_CAPITAL_LETTER_O_WITH_STROKE = 216,
    LATIN_SMALL_LETTER_O_WITH_DIAERESIS = 246,
    LATIN_SMALL_LETTER_O_WITH_STROKE = 248,
    GREEK_SMALL_REVERSED_DOTTED_LUNATE_SIGMA_SYMBOL = 891,
    GREEK_CAPITAL_LETTER_YOT = 895,
    CP_1FFF = 8191,
    ZERO_WIDTH_NON_JOINER = 8204,
    ZERO_WIDTH_JOINER = 8205,
    UNDERTIE = 8255,
    CHARACTER_TIE = 8256,
    SUPERSCRIPT_ZERO = 8304,
    CP_218F = 8591,
    CIRCLED_DIGIT_ONE = 9312,
    NEGATIVE_CIRCLED_DIGIT_ZERO = 9471,
    GLAGOLITIC_CAPITAL_LETTER_AZU = 11264,
    CP_2FEF = 12271,
    IDEOGRAPHIC_COMMA = 12289,
    CP_D7FF = 55295,
    CP_E000 = 57344,
    CJK_COMPATIBILITY_IDEOGRAPH_F900 = 63744,
    ARABIC_LIGATURE_SALAAMUHU_ALAYNAA = 64975,
    ARABIC_LIGATURE_SALLA_USED_AS_KORANIC_STOP_SIGN_ISOLATED_FORM = 65008,
    REPLACEMENT_CHARACTER = 65533,
    LINEAR_B_SYLLABLE_B008_A = 65536,
    CP_EFFFF = 983039,
    CP_10FFFF = 1114111
}
/**
 * Check whether the code point is a control character.
 */
export declare function isControl(cp: number): boolean;
/**
 * Check whether the code point is a whitespace.
 */
export declare function isWhitespace(cp: number): boolean;
/**
 * Check whether the code point is a end of line.
 */
export declare function isEOL(cp: number): boolean;
/**
 * Check whether the code point is a letter character.
 */
export declare function isLetter(cp: number): boolean;
/**
 * Check whether the code point is a digit character.
 */
export declare function isDigit(cp: number): boolean;
/**
 * Check whether the code point is a hex digit character.
 */
export declare function isHexDig(cp: number): boolean;
/**
 * Check whether the code point is a octal digit character.
 */
export declare function isOctalDig(cp: number): boolean;
/**
 * Check whether the code point is a high-surrogate code point.
 */
export declare function isHighSurrogate(cp: number): boolean;
/**
 * Check whether the code point is a low-surrogate code point.
 */
export declare function isLowSurrogate(cp: number): boolean;
/**
 * Check whether the code point is valid code point.
 *
 * see
 * - https://unicode.org/glossary/#unicode_scalar_value
 * - https://toml.io/en/v1.0.0#string
 */
export declare function isUnicodeScalarValue(cp: number): boolean;
