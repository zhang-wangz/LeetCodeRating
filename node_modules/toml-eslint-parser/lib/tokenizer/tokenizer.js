"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tokenizer = void 0;
const errors_1 = require("../errors");
const parser_options_1 = require("../parser-options");
const code_point_iterator_1 = require("./code-point-iterator");
const code_point_1 = require("./code-point");
const HAS_BIGINT = typeof BigInt !== "undefined";
const RADIX_PREFIXES = {
    16: "0x",
    10: "",
    8: "0o",
    2: "0b",
};
const ESCAPES_1_0 = {
    // escape-seq-char =  %x22         ; "    quotation mark  U+0022
    [34 /* CodePoint.QUOTATION_MARK */]: 34 /* CodePoint.QUOTATION_MARK */,
    // escape-seq-char =/ %x5C         ; \    reverse solidus U+005C
    [92 /* CodePoint.BACKSLASH */]: 92 /* CodePoint.BACKSLASH */,
    // escape-seq-char =/ %x62         ; b    backspace       U+0008
    [98 /* CodePoint.LATIN_SMALL_B */]: 8 /* CodePoint.BACKSPACE */,
    // escape-seq-char =/ %x66         ; f    form feed       U+000C
    [102 /* CodePoint.LATIN_SMALL_F */]: 12 /* CodePoint.FORM_FEED */,
    // escape-seq-char =/ %x6E         ; n    line feed       U+000A
    [110 /* CodePoint.LATIN_SMALL_N */]: 10 /* CodePoint.LINE_FEED */,
    // escape-seq-char =/ %x72         ; r    carriage return U+000D
    [114 /* CodePoint.LATIN_SMALL_R */]: 13 /* CodePoint.CARRIAGE_RETURN */,
    // escape-seq-char =/ %x74         ; t    tab             U+0009
    [116 /* CodePoint.LATIN_SMALL_T */]: 9 /* CodePoint.TABULATION */,
};
const ESCAPES_LATEST = Object.assign(Object.assign({}, ESCAPES_1_0), { 
    // escape-seq-char =/ %x65         ; e    escape          U+001B
    // Added in TOML 1.1
    [101 /* CodePoint.LATIN_SMALL_E */]: 27 /* CodePoint.ESCAPE */ });
/**
 * Tokenizer for TOML.
 */
class Tokenizer {
    /**
     * Initialize this tokenizer.
     */
    constructor(text, parserOptions) {
        this.backCode = false;
        this.lastCodePoint = 0 /* CodePoint.NULL */;
        this.state = "DATA";
        this.token = null;
        this.tokenStart = -1;
        /**
         * The flag which enables values tokens.
         * If this is true, this tokenizer will generate Integer, Float, Boolean, Offset Date-Time, Local Date-Time ,Local Date, Local Time, Array and Inline Table tokens.
         */
        this.valuesEnabled = false;
        this.text = text;
        this.parserOptions = parserOptions || {};
        this.codePointIterator = new code_point_iterator_1.CodePointIterator(text);
        this.tomlVersion = (0, parser_options_1.getTOMLVer)(this.parserOptions.tomlVersion);
        this.ESCAPES = this.tomlVersion.gte(1, 1) ? ESCAPES_LATEST : ESCAPES_1_0;
    }
    get positions() {
        return {
            start: Object.assign(Object.assign({}, this.codePointIterator.getStartLoc()), { offset: this.codePointIterator.start }),
            end: Object.assign(Object.assign({}, this.codePointIterator.getEndLoc()), { offset: this.codePointIterator.end }),
        };
    }
    /**
     * Report an invalid character error.
     */
    reportParseError(code, data) {
        const loc = this.codePointIterator.getStartLoc();
        throw new errors_1.ParseError(code, this.codePointIterator.start, loc.line, loc.column, data);
    }
    /**
     * Get the next token.
     */
    nextToken() {
        let token = this.token;
        if (token != null) {
            this.token = null;
            return token;
        }
        let cp = this.lastCodePoint;
        while (cp !== -1 /* CodePoint.EOF */ && !this.token) {
            cp = this.nextCode();
            const nextState = this[this.state](cp);
            if (!nextState) {
                throw new Error(`Unknown error: pre state=${this.state}`);
            }
            this.state = nextState;
        }
        token = this.token;
        this.token = null;
        return token;
    }
    /**
     * Get the next code point.
     */
    nextCode() {
        if (this.lastCodePoint === -1 /* CodePoint.EOF */) {
            return -1 /* CodePoint.EOF */;
        }
        if (this.backCode) {
            this.backCode = false;
            return this.lastCodePoint;
        }
        return (this.lastCodePoint = this.codePointIterator.next());
    }
    /**
     * Eat the next code point.
     */
    eatCode(cp) {
        if (this.lastCodePoint === -1 /* CodePoint.EOF */) {
            return false;
        }
        if (this.backCode) {
            if (this.lastCodePoint === cp) {
                this.backCode = false;
                return true;
            }
            return false;
        }
        return this.codePointIterator.eat(cp);
    }
    /**
     * Moves the character position to the given position.
     */
    moveAt(loc) {
        if (this.backCode) {
            this.backCode = false;
        }
        this.lastCodePoint = this.codePointIterator.moveAt(loc);
    }
    /**
     * Back the current code point as the given state.
     */
    back(state) {
        this.backCode = true;
        return state;
    }
    punctuatorToken() {
        this.startToken();
        this.endToken("Punctuator", "end");
    }
    startToken() {
        this.tokenStart = this.codePointIterator.start;
    }
    /**
     * Commit the current token.
     */
    endToken(type, pos, option1, option2) {
        const { tokenStart } = this;
        const end = this.codePointIterator[pos];
        const range = [tokenStart, end];
        const loc = {
            start: this.codePointIterator.getLocFromIndex(tokenStart),
            end: this.codePointIterator.getLocFromIndex(end),
        };
        if (type === "Block") {
            this.token = {
                type,
                value: this.text.slice(tokenStart + 1, end),
                range,
                loc,
            };
        }
        else {
            let token;
            const value = this.text.slice(tokenStart, end);
            if (type === "BasicString" ||
                type === "LiteralString" ||
                type === "MultiLineBasicString" ||
                type === "MultiLineLiteralString") {
                token = {
                    type,
                    value,
                    string: option1,
                    range,
                    loc,
                };
            }
            else if (type === "Integer") {
                const text = option1;
                token = {
                    type,
                    value,
                    number: parseInt(text, option2),
                    bigint: HAS_BIGINT
                        ? BigInt(RADIX_PREFIXES[option2] + text)
                        : null,
                    range,
                    loc,
                };
            }
            else if (type === "Float") {
                token = {
                    type,
                    value,
                    number: option1,
                    range,
                    loc,
                };
            }
            else if (type === "Boolean") {
                token = {
                    type,
                    value,
                    boolean: option1,
                    range,
                    loc,
                };
            }
            else if (type === "LocalDate" ||
                type === "LocalTime" ||
                type === "LocalDateTime" ||
                type === "OffsetDateTime") {
                token = {
                    type,
                    value,
                    date: option1,
                    range,
                    loc,
                };
            }
            else {
                token = {
                    type,
                    value,
                    range,
                    loc,
                };
            }
            this.token = token;
        }
    }
    DATA(cp) {
        while ((0, code_point_1.isWhitespace)(cp) || (0, code_point_1.isEOL)(cp)) {
            cp = this.nextCode();
        }
        if (cp === 35 /* CodePoint.HASH */) {
            this.startToken();
            return "COMMENT";
        }
        if (cp === 34 /* CodePoint.QUOTATION_MARK */) {
            this.startToken();
            return "BASIC_STRING";
        }
        if (cp === 39 /* CodePoint.SINGLE_QUOTE */) {
            this.startToken();
            return "LITERAL_STRING";
        }
        if (cp === 46 /* CodePoint.DOT */ || // .
            cp === 61 /* CodePoint.EQUALS_SIGN */ || // =
            cp === 91 /* CodePoint.LEFT_BRACKET */ || // [
            cp === 93 /* CodePoint.RIGHT_BRACKET */ || // ]
            cp === 123 /* CodePoint.LEFT_BRACE */ || // {
            cp === 125 /* CodePoint.RIGHT_BRACE */ || // }
            cp === 44 /* CodePoint.COMMA */ // ,
        ) {
            this.punctuatorToken();
            return "DATA";
        }
        if (this.valuesEnabled) {
            if (cp === 45 /* CodePoint.DASH */ || cp === 43 /* CodePoint.PLUS_SIGN */) {
                this.startToken();
                return "SIGN";
            }
            if (cp === 110 /* CodePoint.LATIN_SMALL_N */ || cp === 105 /* CodePoint.LATIN_SMALL_I */) {
                this.startToken();
                return this.back("NAN_OR_INF");
            }
            if ((0, code_point_1.isDigit)(cp)) {
                this.startToken();
                return this.back("NUMBER");
            }
            if (cp === 116 /* CodePoint.LATIN_SMALL_T */ || cp === 102 /* CodePoint.LATIN_SMALL_F */) {
                this.startToken();
                return this.back("BOOLEAN");
            }
        }
        else {
            if (isUnquotedKeyChar(cp, this.tomlVersion)) {
                this.startToken();
                return "BARE";
            }
        }
        if (cp === -1 /* CodePoint.EOF */) {
            // end
            return "DATA";
        }
        return this.reportParseError("unexpected-char");
    }
    COMMENT(cp) {
        const processCommentChar = this.tomlVersion.gte(1, 1)
            ? (c) => {
                if (!isAllowedCommentCharacter(c)) {
                    this.reportParseError("invalid-comment-character");
                }
            }
            : (c) => {
                if (isControlOtherThanTab(c)) {
                    this.reportParseErrorControlChar();
                }
            };
        while (!(0, code_point_1.isEOL)(cp) && cp !== -1 /* CodePoint.EOF */) {
            processCommentChar(cp);
            cp = this.nextCode();
        }
        this.endToken("Block", "start");
        return "DATA";
    }
    BARE(cp) {
        while (isUnquotedKeyChar(cp, this.tomlVersion)) {
            cp = this.nextCode();
        }
        this.endToken("Bare", "start");
        return this.back("DATA");
    }
    BASIC_STRING(cp) {
        if (cp === 34 /* CodePoint.QUOTATION_MARK */) {
            cp = this.nextCode();
            if (cp === 34 /* CodePoint.QUOTATION_MARK */) {
                return "MULTI_LINE_BASIC_STRING";
            }
            this.endToken("BasicString", "start", "");
            return this.back("DATA");
        }
        const out = [];
        while (cp !== 34 /* CodePoint.QUOTATION_MARK */ &&
            cp !== -1 /* CodePoint.EOF */ &&
            cp !== 10 /* CodePoint.LINE_FEED */) {
            if (isControlOtherThanTab(cp)) {
                return this.reportParseErrorControlChar();
            }
            if (cp === 92 /* CodePoint.BACKSLASH */) {
                cp = this.nextCode();
                const ecp = this.ESCAPES[cp];
                if (ecp) {
                    out.push(ecp);
                    cp = this.nextCode();
                    continue;
                }
                else if (cp === 117 /* CodePoint.LATIN_SMALL_U */) {
                    // escape-seq-char =/ %x75 4HEXDIG ; uHHHH                U+HHHH
                    const code = this.parseUnicode(4);
                    out.push(code);
                    cp = this.nextCode();
                    continue;
                }
                else if (cp === 85 /* CodePoint.LATIN_CAPITAL_U */) {
                    // escape-seq-char =/ %x55 8HEXDIG ; UHHHHHHHH            U+HHHHHHHH
                    const code = this.parseUnicode(8);
                    out.push(code);
                    cp = this.nextCode();
                    continue;
                }
                else if (cp === 120 /* CodePoint.LATIN_SMALL_X */ &&
                    this.tomlVersion.gte(1, 1)) {
                    // escape-seq-char =/ %x78 2HEXDIG ; xHH                  U+00HH
                    // Added in TOML 1.1
                    const code = this.parseUnicode(2);
                    out.push(code);
                    cp = this.nextCode();
                    continue;
                }
                return this.reportParseError("invalid-char-in-escape-sequence");
            }
            out.push(cp);
            cp = this.nextCode();
        }
        if (cp !== 34 /* CodePoint.QUOTATION_MARK */) {
            return this.reportParseError("unterminated-string");
        }
        this.endToken("BasicString", "end", String.fromCodePoint(...out));
        return "DATA";
    }
    MULTI_LINE_BASIC_STRING(cp) {
        const out = [];
        if (cp === 10 /* CodePoint.LINE_FEED */) {
            // A newline immediately following the opening delimiter will be trimmed.
            cp = this.nextCode();
        }
        while (cp !== -1 /* CodePoint.EOF */) {
            if (cp !== 10 /* CodePoint.LINE_FEED */ && isControlOtherThanTab(cp)) {
                return this.reportParseErrorControlChar();
            }
            if (cp === 34 /* CodePoint.QUOTATION_MARK */) {
                const startPos = this.codePointIterator.start;
                if (this.eatCode(34 /* CodePoint.QUOTATION_MARK */) &&
                    this.eatCode(34 /* CodePoint.QUOTATION_MARK */)) {
                    if (this.eatCode(34 /* CodePoint.QUOTATION_MARK */)) {
                        out.push(34 /* CodePoint.QUOTATION_MARK */);
                        if (this.eatCode(34 /* CodePoint.QUOTATION_MARK */)) {
                            out.push(34 /* CodePoint.QUOTATION_MARK */);
                            if (this.eatCode(34 /* CodePoint.QUOTATION_MARK */)) {
                                this.moveAt(startPos);
                                return this.reportParseError("invalid-three-quotes");
                            }
                        }
                    }
                    // end
                    this.endToken("MultiLineBasicString", "end", String.fromCodePoint(...out));
                    return "DATA";
                }
                this.moveAt(startPos);
            }
            if (cp === 92 /* CodePoint.BACKSLASH */) {
                cp = this.nextCode();
                const ecp = this.ESCAPES[cp];
                if (ecp) {
                    out.push(ecp);
                    cp = this.nextCode();
                    continue;
                }
                else if (cp === 117 /* CodePoint.LATIN_SMALL_U */) {
                    // escape-seq-char =/ %x75 4HEXDIG ; uHHHH                U+HHHH
                    const code = this.parseUnicode(4);
                    out.push(code);
                    cp = this.nextCode();
                    continue;
                }
                else if (cp === 85 /* CodePoint.LATIN_CAPITAL_U */) {
                    // escape-seq-char =/ %x55 8HEXDIG ; UHHHHHHHH            U+HHHHHHHH
                    const code = this.parseUnicode(8);
                    out.push(code);
                    cp = this.nextCode();
                    continue;
                }
                else if (cp === 120 /* CodePoint.LATIN_SMALL_X */ &&
                    this.tomlVersion.gte(1, 1)) {
                    // escape-seq-char =/ %x78 2HEXDIG ; xHH                  U+00HH
                    // Added in TOML 1.1
                    const code = this.parseUnicode(2);
                    out.push(code);
                    cp = this.nextCode();
                    continue;
                }
                else if (cp === 10 /* CodePoint.LINE_FEED */) {
                    cp = this.nextCode();
                    while ((0, code_point_1.isWhitespace)(cp) || cp === 10 /* CodePoint.LINE_FEED */) {
                        cp = this.nextCode();
                    }
                    continue;
                }
                else if ((0, code_point_1.isWhitespace)(cp)) {
                    let valid = true;
                    const startPos = this.codePointIterator.start;
                    let nextCp;
                    while ((nextCp = this.nextCode()) !== -1 /* CodePoint.EOF */) {
                        if (nextCp === 10 /* CodePoint.LINE_FEED */) {
                            break;
                        }
                        if (!(0, code_point_1.isWhitespace)(nextCp)) {
                            this.moveAt(startPos);
                            valid = false;
                            break;
                        }
                    }
                    if (valid) {
                        cp = this.nextCode();
                        while ((0, code_point_1.isWhitespace)(cp) || cp === 10 /* CodePoint.LINE_FEED */) {
                            cp = this.nextCode();
                        }
                        continue;
                    }
                }
                return this.reportParseError("invalid-char-in-escape-sequence");
            }
            out.push(cp);
            cp = this.nextCode();
        }
        return this.reportParseError("unterminated-string");
    }
    LITERAL_STRING(cp) {
        if (cp === 39 /* CodePoint.SINGLE_QUOTE */) {
            cp = this.nextCode();
            if (cp === 39 /* CodePoint.SINGLE_QUOTE */) {
                return "MULTI_LINE_LITERAL_STRING";
            }
            this.endToken("LiteralString", "start", "");
            return this.back("DATA");
        }
        const out = [];
        while (cp !== 39 /* CodePoint.SINGLE_QUOTE */ &&
            cp !== -1 /* CodePoint.EOF */ &&
            cp !== 10 /* CodePoint.LINE_FEED */) {
            if (isControlOtherThanTab(cp)) {
                return this.reportParseErrorControlChar();
            }
            out.push(cp);
            cp = this.nextCode();
        }
        if (cp !== 39 /* CodePoint.SINGLE_QUOTE */) {
            return this.reportParseError("unterminated-string");
        }
        this.endToken("LiteralString", "end", String.fromCodePoint(...out));
        return "DATA";
    }
    MULTI_LINE_LITERAL_STRING(cp) {
        const out = [];
        if (cp === 10 /* CodePoint.LINE_FEED */) {
            // A newline immediately following the opening delimiter will be trimmed.
            cp = this.nextCode();
        }
        while (cp !== -1 /* CodePoint.EOF */) {
            if (cp !== 10 /* CodePoint.LINE_FEED */ && isControlOtherThanTab(cp)) {
                return this.reportParseErrorControlChar();
            }
            if (cp === 39 /* CodePoint.SINGLE_QUOTE */) {
                const startPos = this.codePointIterator.start;
                if (this.eatCode(39 /* CodePoint.SINGLE_QUOTE */) &&
                    this.eatCode(39 /* CodePoint.SINGLE_QUOTE */)) {
                    if (this.eatCode(39 /* CodePoint.SINGLE_QUOTE */)) {
                        out.push(39 /* CodePoint.SINGLE_QUOTE */);
                        if (this.eatCode(39 /* CodePoint.SINGLE_QUOTE */)) {
                            out.push(39 /* CodePoint.SINGLE_QUOTE */);
                            if (this.eatCode(39 /* CodePoint.SINGLE_QUOTE */)) {
                                this.moveAt(startPos);
                                return this.reportParseError("invalid-three-quotes");
                            }
                        }
                    }
                    // end
                    this.endToken("MultiLineLiteralString", "end", String.fromCodePoint(...out));
                    return "DATA";
                }
                this.moveAt(startPos);
            }
            out.push(cp);
            cp = this.nextCode();
        }
        return this.reportParseError("unterminated-string");
    }
    SIGN(cp) {
        if (cp === 110 /* CodePoint.LATIN_SMALL_N */ || cp === 105 /* CodePoint.LATIN_SMALL_I */) {
            return this.back("NAN_OR_INF");
        }
        if ((0, code_point_1.isDigit)(cp)) {
            return this.back("NUMBER");
        }
        return this.reportParseError("unexpected-char");
    }
    NAN_OR_INF(cp) {
        if (cp === 110 /* CodePoint.LATIN_SMALL_N */) {
            const startPos = this.codePointIterator.start;
            if (this.eatCode(97 /* CodePoint.LATIN_SMALL_A */) &&
                this.eatCode(110 /* CodePoint.LATIN_SMALL_N */)) {
                this.endToken("Float", "end", NaN);
                return "DATA";
            }
            this.moveAt(startPos);
        }
        else if (cp === 105 /* CodePoint.LATIN_SMALL_I */) {
            const startPos = this.codePointIterator.start;
            if (this.eatCode(110 /* CodePoint.LATIN_SMALL_N */) &&
                this.eatCode(102 /* CodePoint.LATIN_SMALL_F */)) {
                this.endToken("Float", "end", this.text[this.tokenStart] === "-" ? -Infinity : Infinity);
                return "DATA";
            }
            this.moveAt(startPos);
        }
        return this.reportParseError("unexpected-char");
    }
    NUMBER(cp) {
        const start = this.text[this.tokenStart];
        const sign = start === "+"
            ? 43 /* CodePoint.PLUS_SIGN */
            : start === "-"
                ? 45 /* CodePoint.DASH */
                : 0 /* CodePoint.NULL */;
        if (cp === 48 /* CodePoint.DIGIT_0 */) {
            if (sign === 0 /* CodePoint.NULL */) {
                const startPos = this.codePointIterator.start;
                const nextCp = this.nextCode();
                if ((0, code_point_1.isDigit)(nextCp)) {
                    const nextNextCp = this.nextCode();
                    if (nextNextCp === 58 /* CodePoint.COLON */) {
                        const data = {
                            hasDate: false,
                            year: 0,
                            month: 0,
                            day: 0,
                            hour: Number(String.fromCodePoint(48 /* CodePoint.DIGIT_0 */, nextCp)),
                            minute: 0,
                            second: 0,
                        };
                        this.data = data;
                        return "TIME_MINUTE";
                    }
                    if ((0, code_point_1.isDigit)(nextNextCp)) {
                        const nextNextNextCp = this.nextCode();
                        if ((0, code_point_1.isDigit)(nextNextNextCp) && this.eatCode(45 /* CodePoint.DASH */)) {
                            const data = {
                                hasDate: true,
                                year: Number(String.fromCodePoint(48 /* CodePoint.DIGIT_0 */, nextCp, nextNextCp, nextNextNextCp)),
                                month: 0,
                                day: 0,
                                hour: 0,
                                minute: 0,
                                second: 0,
                            };
                            this.data = data;
                            return "DATE_MONTH";
                        }
                    }
                    this.moveAt(startPos);
                    return this.reportParseError("invalid-leading-zero");
                }
                this.moveAt(startPos);
            }
            cp = this.nextCode();
            if (cp === 120 /* CodePoint.LATIN_SMALL_X */ ||
                cp === 111 /* CodePoint.LATIN_SMALL_O */ ||
                cp === 98 /* CodePoint.LATIN_SMALL_B */) {
                if (sign !== 0 /* CodePoint.NULL */) {
                    return this.reportParseError("unexpected-char");
                }
                return cp === 120 /* CodePoint.LATIN_SMALL_X */
                    ? "HEX"
                    : cp === 111 /* CodePoint.LATIN_SMALL_O */
                        ? "OCTAL"
                        : "BINARY";
            }
            if (cp === 101 /* CodePoint.LATIN_SMALL_E */ || cp === 69 /* CodePoint.LATIN_CAPITAL_E */) {
                const data = {
                    // Float values -0.0 and +0.0 are valid and should map according to IEEE 754.
                    minus: sign === 45 /* CodePoint.DASH */,
                    left: [48 /* CodePoint.DIGIT_0 */],
                };
                this.data = data;
                return "EXPONENT_RIGHT";
            }
            if (cp === 46 /* CodePoint.DOT */) {
                const data = {
                    minus: sign === 45 /* CodePoint.DASH */,
                    absInt: [48 /* CodePoint.DIGIT_0 */],
                };
                this.data = data;
                return "FRACTIONAL_RIGHT";
            }
            // Integer values -0 and +0 are valid and identical to an unprefixed zero.
            this.endToken("Integer", "start", "0", 10);
            return this.back("DATA");
        }
        const { out, nextCp, hasUnderscore } = this.parseDigits(cp, code_point_1.isDigit);
        if (nextCp === 45 /* CodePoint.DASH */ &&
            sign === 0 /* CodePoint.NULL */ &&
            !hasUnderscore &&
            out.length === 4) {
            const data = {
                hasDate: true,
                year: Number(String.fromCodePoint(...out)),
                month: 0,
                day: 0,
                hour: 0,
                minute: 0,
                second: 0,
            };
            this.data = data;
            return "DATE_MONTH";
        }
        if (nextCp === 58 /* CodePoint.COLON */ &&
            sign === 0 /* CodePoint.NULL */ &&
            !hasUnderscore &&
            out.length === 2) {
            const data = {
                hasDate: false,
                year: 0,
                month: 0,
                day: 0,
                hour: Number(String.fromCodePoint(...out)),
                minute: 0,
                second: 0,
            };
            this.data = data;
            return "TIME_MINUTE";
        }
        if (nextCp === 101 /* CodePoint.LATIN_SMALL_E */ ||
            nextCp === 69 /* CodePoint.LATIN_CAPITAL_E */) {
            const data = {
                minus: sign === 45 /* CodePoint.DASH */,
                left: out,
            };
            this.data = data;
            return "EXPONENT_RIGHT";
        }
        if (nextCp === 46 /* CodePoint.DOT */) {
            const data = {
                minus: sign === 45 /* CodePoint.DASH */,
                absInt: out,
            };
            this.data = data;
            return "FRACTIONAL_RIGHT";
        }
        this.endToken("Integer", "start", sign === 45 /* CodePoint.DASH */
            ? String.fromCodePoint(45 /* CodePoint.DASH */, ...out)
            : String.fromCodePoint(...out), 10);
        return this.back("DATA");
    }
    HEX(cp) {
        const { out } = this.parseDigits(cp, code_point_1.isHexDig);
        this.endToken("Integer", "start", String.fromCodePoint(...out), 16);
        return this.back("DATA");
    }
    OCTAL(cp) {
        const { out } = this.parseDigits(cp, code_point_1.isOctalDig);
        this.endToken("Integer", "start", String.fromCodePoint(...out), 8);
        return this.back("DATA");
    }
    BINARY(cp) {
        const { out } = this.parseDigits(cp, (c) => c === 48 /* CodePoint.DIGIT_0 */ || c === 49 /* CodePoint.DIGIT_1 */);
        this.endToken("Integer", "start", String.fromCodePoint(...out), 2);
        return this.back("DATA");
    }
    FRACTIONAL_RIGHT(cp) {
        const { minus, absInt } = this.data;
        const { out, nextCp } = this.parseDigits(cp, code_point_1.isDigit);
        const absNum = [...absInt, 46 /* CodePoint.DOT */, ...out];
        if (nextCp === 101 /* CodePoint.LATIN_SMALL_E */ ||
            nextCp === 69 /* CodePoint.LATIN_CAPITAL_E */) {
            const data = {
                minus,
                left: absNum,
            };
            this.data = data;
            return "EXPONENT_RIGHT";
        }
        const value = Number(minus
            ? String.fromCodePoint(45 /* CodePoint.DASH */, ...absNum)
            : String.fromCodePoint(...absNum));
        this.endToken("Float", "start", value);
        return this.back("DATA");
    }
    EXPONENT_RIGHT(cp) {
        const { left, minus: leftMinus } = this.data;
        let minus = false;
        if (cp === 45 /* CodePoint.DASH */ || cp === 43 /* CodePoint.PLUS_SIGN */) {
            minus = cp === 45 /* CodePoint.DASH */;
            cp = this.nextCode();
        }
        const { out } = this.parseDigits(cp, code_point_1.isDigit);
        const right = out;
        if (minus) {
            right.unshift(45 /* CodePoint.DASH */);
        }
        const value = Number(leftMinus
            ? String.fromCodePoint(45 /* CodePoint.DASH */, ...left, 101 /* CodePoint.LATIN_SMALL_E */, ...right)
            : String.fromCodePoint(...left, 101 /* CodePoint.LATIN_SMALL_E */, ...right));
        this.endToken("Float", "start", value);
        return this.back("DATA");
    }
    BOOLEAN(cp) {
        if (cp === 116 /* CodePoint.LATIN_SMALL_T */) {
            const startPos = this.codePointIterator.start;
            if (this.eatCode(114 /* CodePoint.LATIN_SMALL_R */) &&
                this.eatCode(117 /* CodePoint.LATIN_SMALL_U */) &&
                this.eatCode(101 /* CodePoint.LATIN_SMALL_E */)) {
                // true
                this.endToken("Boolean", "end", true);
                return "DATA";
            }
            this.moveAt(startPos);
        }
        else if (cp === 102 /* CodePoint.LATIN_SMALL_F */) {
            const startPos = this.codePointIterator.start;
            if (this.eatCode(97 /* CodePoint.LATIN_SMALL_A */) &&
                this.eatCode(108 /* CodePoint.LATIN_SMALL_L */) &&
                this.eatCode(115 /* CodePoint.LATIN_SMALL_S */) &&
                this.eatCode(101 /* CodePoint.LATIN_SMALL_E */)) {
                // false
                this.endToken("Boolean", "end", false);
                return "DATA";
            }
            this.moveAt(startPos);
        }
        return this.reportParseError("unexpected-char");
    }
    DATE_MONTH(cp) {
        const start = this.codePointIterator.start;
        if (!(0, code_point_1.isDigit)(cp)) {
            return this.reportParseError("unexpected-char");
        }
        cp = this.nextCode();
        if (!(0, code_point_1.isDigit)(cp)) {
            return this.reportParseError("unexpected-char");
        }
        cp = this.nextCode();
        if (cp !== 45 /* CodePoint.DASH */) {
            return this.reportParseError("unexpected-char");
        }
        const end = this.codePointIterator.start;
        const data = this.data;
        data.month = Number(this.text.slice(start, end));
        return "DATE_DAY";
    }
    DATE_DAY(cp) {
        const start = this.codePointIterator.start;
        if (!(0, code_point_1.isDigit)(cp)) {
            return this.reportParseError("unexpected-char");
        }
        cp = this.nextCode();
        if (!(0, code_point_1.isDigit)(cp)) {
            return this.reportParseError("unexpected-char");
        }
        const end = this.codePointIterator.end;
        const data = this.data;
        data.day = Number(this.text.slice(start, end));
        if (!isValidDate(data.year, data.month, data.day)) {
            return this.reportParseError("invalid-date");
        }
        cp = this.nextCode();
        if (cp === 84 /* CodePoint.LATIN_CAPITAL_T */ || cp === 116 /* CodePoint.LATIN_SMALL_T */) {
            return "TIME_HOUR";
        }
        if (cp === 32 /* CodePoint.SPACE */) {
            const startPos = this.codePointIterator.start;
            if ((0, code_point_1.isDigit)(this.nextCode()) && (0, code_point_1.isDigit)(this.nextCode())) {
                this.moveAt(startPos);
                return "TIME_HOUR";
            }
            this.moveAt(startPos);
        }
        const dateValue = getDateFromDateTimeData(data, "");
        this.endToken("LocalDate", "start", dateValue);
        return this.back("DATA");
    }
    TIME_HOUR(cp) {
        const start = this.codePointIterator.start;
        if (!(0, code_point_1.isDigit)(cp)) {
            return this.reportParseError("unexpected-char");
        }
        cp = this.nextCode();
        if (!(0, code_point_1.isDigit)(cp)) {
            return this.reportParseError("unexpected-char");
        }
        cp = this.nextCode();
        if (cp !== 58 /* CodePoint.COLON */) {
            return this.reportParseError("unexpected-char");
        }
        const end = this.codePointIterator.start;
        const data = this.data;
        data.hour = Number(this.text.slice(start, end));
        return "TIME_MINUTE";
    }
    TIME_MINUTE(cp) {
        const start = this.codePointIterator.start;
        if (!(0, code_point_1.isDigit)(cp)) {
            return this.reportParseError("unexpected-char");
        }
        cp = this.nextCode();
        if (!(0, code_point_1.isDigit)(cp)) {
            return this.reportParseError("unexpected-char");
        }
        const end = this.codePointIterator.end;
        const data = this.data;
        data.minute = Number(this.text.slice(start, end));
        cp = this.nextCode();
        if (cp === 58 /* CodePoint.COLON */) {
            return "TIME_SECOND";
        }
        if (this.tomlVersion.lt(1, 1)) {
            return this.reportParseError("unexpected-char");
        }
        // Omitted seconds
        // Added in TOML 1.1
        if (!isValidTime(data.hour, data.minute, data.second)) {
            return this.reportParseError("invalid-time");
        }
        return this.processTimeEnd(cp, data);
    }
    TIME_SECOND(cp) {
        const start = this.codePointIterator.start;
        if (!(0, code_point_1.isDigit)(cp)) {
            return this.reportParseError("unexpected-char");
        }
        cp = this.nextCode();
        if (!(0, code_point_1.isDigit)(cp)) {
            return this.reportParseError("unexpected-char");
        }
        const end = this.codePointIterator.end;
        const data = this.data;
        data.second = Number(this.text.slice(start, end));
        if (!isValidTime(data.hour, data.minute, data.second)) {
            return this.reportParseError("invalid-time");
        }
        cp = this.nextCode();
        if (cp === 46 /* CodePoint.DOT */) {
            return "TIME_SEC_FRAC";
        }
        return this.processTimeEnd(cp, data);
    }
    TIME_SEC_FRAC(cp) {
        if (!(0, code_point_1.isDigit)(cp)) {
            return this.reportParseError("unexpected-char");
        }
        const start = this.codePointIterator.start;
        while ((0, code_point_1.isDigit)(cp)) {
            cp = this.nextCode();
        }
        const end = this.codePointIterator.start;
        const data = this.data;
        data.frac = this.text.slice(start, end);
        return this.processTimeEnd(cp, data);
    }
    processTimeEnd(cp, data) {
        if (data.hasDate) {
            if (cp === 45 /* CodePoint.DASH */ || cp === 43 /* CodePoint.PLUS_SIGN */) {
                data.offsetSign = cp;
                return "TIME_OFFSET";
            }
            if (cp === 90 /* CodePoint.LATIN_CAPITAL_Z */ || cp === 122 /* CodePoint.LATIN_SMALL_Z */) {
                const dateValue = getDateFromDateTimeData(data, "Z");
                this.endToken("OffsetDateTime", "end", dateValue);
                return "DATA";
            }
            const dateValue = getDateFromDateTimeData(data, "");
            this.endToken("LocalDateTime", "start", dateValue);
            return this.back("DATA");
        }
        const dateValue = getDateFromDateTimeData(data, "");
        this.endToken("LocalTime", "start", dateValue);
        return this.back("DATA");
    }
    TIME_OFFSET(cp) {
        if (!(0, code_point_1.isDigit)(cp)) {
            return this.reportParseError("unexpected-char");
        }
        const hourStart = this.codePointIterator.start;
        cp = this.nextCode();
        if (!(0, code_point_1.isDigit)(cp)) {
            return this.reportParseError("unexpected-char");
        }
        cp = this.nextCode();
        if (cp !== 58 /* CodePoint.COLON */) {
            return this.reportParseError("unexpected-char");
        }
        const hourEnd = this.codePointIterator.start;
        cp = this.nextCode();
        const minuteStart = this.codePointIterator.start;
        if (!(0, code_point_1.isDigit)(cp)) {
            return this.reportParseError("unexpected-char");
        }
        cp = this.nextCode();
        if (!(0, code_point_1.isDigit)(cp)) {
            return this.reportParseError("unexpected-char");
        }
        const minuteEnd = this.codePointIterator.end;
        const hour = Number(this.text.slice(hourStart, hourEnd));
        const minute = Number(this.text.slice(minuteStart, minuteEnd));
        if (!isValidTime(hour, minute, 0)) {
            return this.reportParseError("invalid-time");
        }
        const data = this.data;
        const dateValue = getDateFromDateTimeData(data, `${String.fromCodePoint(data.offsetSign)}${padStart(hour, 2)}:${padStart(minute, 2)}`);
        this.endToken("OffsetDateTime", "end", dateValue);
        return "DATA";
    }
    parseDigits(cp, checkDigit) {
        if (cp === 95 /* CodePoint.UNDERSCORE */) {
            return this.reportParseError("invalid-underscore");
        }
        if (!checkDigit(cp)) {
            return this.reportParseError("unexpected-char");
        }
        const out = [];
        let before = 0 /* CodePoint.NULL */;
        let hasUnderscore = false;
        while (checkDigit(cp) || cp === 95 /* CodePoint.UNDERSCORE */) {
            if (cp === 95 /* CodePoint.UNDERSCORE */) {
                hasUnderscore = true;
                if (before === 95 /* CodePoint.UNDERSCORE */) {
                    return this.reportParseError("invalid-underscore");
                }
            }
            else {
                out.push(cp);
            }
            before = cp;
            cp = this.nextCode();
        }
        if (before === 95 /* CodePoint.UNDERSCORE */) {
            return this.reportParseError("invalid-underscore");
        }
        return {
            out,
            nextCp: cp,
            hasUnderscore,
        };
    }
    parseUnicode(count) {
        const startLoc = this.codePointIterator.start;
        const start = this.codePointIterator.end;
        let charCount = 0;
        let cp;
        while ((cp = this.nextCode()) !== -1 /* CodePoint.EOF */) {
            if (!(0, code_point_1.isHexDig)(cp)) {
                this.moveAt(startLoc);
                return this.reportParseError("invalid-char-in-escape-sequence");
            }
            charCount++;
            if (charCount >= count) {
                break;
            }
        }
        const end = this.codePointIterator.end;
        const code = this.text.slice(start, end);
        const codePoint = parseInt(code, 16);
        if (!(0, code_point_1.isUnicodeScalarValue)(codePoint)) {
            return this.reportParseError("invalid-code-point", { cp: code });
        }
        return codePoint;
    }
    reportParseErrorControlChar() {
        return this.reportParseError("invalid-control-character");
    }
}
exports.Tokenizer = Tokenizer;
/**
 * Check whether the code point is unquoted-key-char
 */
function isUnquotedKeyChar(cp, tomlVersion) {
    // unquoted-key-char = ALPHA / DIGIT / %x2D / %x5F         ; a-z A-Z 0-9 - _
    if ((0, code_point_1.isLetter)(cp) ||
        (0, code_point_1.isDigit)(cp) ||
        cp === 95 /* CodePoint.UNDERSCORE */ ||
        cp === 45 /* CodePoint.DASH */) {
        return true;
    }
    if (tomlVersion.lt(1, 1)) {
        // TOML 1.0
        // unquoted-key = 1*( ALPHA / DIGIT / %x2D / %x5F ) ; A-Z / a-z / 0-9 / - / _
        return false;
    }
    // Other unquoted-key-char
    // Added in TOML 1.1
    if (cp === 178 /* CodePoint.SUPERSCRIPT_TWO */ ||
        cp === 179 /* CodePoint.SUPERSCRIPT_THREE */ ||
        cp === 185 /* CodePoint.SUPERSCRIPT_ONE */ ||
        (188 /* CodePoint.VULGAR_FRACTION_ONE_QUARTER */ <= cp &&
            cp <= 190 /* CodePoint.VULGAR_FRACTION_THREE_QUARTERS */)) {
        // unquoted-key-char =/ %xB2 / %xB3 / %xB9 / %xBC-BE       ; superscript digits, fractions
        return true;
    }
    if ((192 /* CodePoint.LATIN_CAPITAL_LETTER_A_WITH_GRAVE */ <= cp &&
        cp <= 214 /* CodePoint.LATIN_CAPITAL_LETTER_O_WITH_DIAERESIS */) ||
        (216 /* CodePoint.LATIN_CAPITAL_LETTER_O_WITH_STROKE */ <= cp &&
            cp <= 246 /* CodePoint.LATIN_SMALL_LETTER_O_WITH_DIAERESIS */) ||
        (248 /* CodePoint.LATIN_SMALL_LETTER_O_WITH_STROKE */ <= cp &&
            cp <= 891 /* CodePoint.GREEK_SMALL_REVERSED_DOTTED_LUNATE_SIGMA_SYMBOL */)) {
        // unquoted-key-char =/ %xC0-D6 / %xD8-F6 / %xF8-37D       ; non-symbol chars in Latin block
        return true;
    }
    if (895 /* CodePoint.GREEK_CAPITAL_LETTER_YOT */ <= cp && cp <= 8191 /* CodePoint.CP_1FFF */) {
        // unquoted-key-char =/ %x37F-1FFF                         ; exclude GREEK QUESTION MARK, which is basically a semi-colon
        return true;
    }
    if ((8204 /* CodePoint.ZERO_WIDTH_NON_JOINER */ <= cp &&
        cp <= 8205 /* CodePoint.ZERO_WIDTH_JOINER */) ||
        (8255 /* CodePoint.UNDERTIE */ <= cp && cp <= 8256 /* CodePoint.CHARACTER_TIE */)) {
        // unquoted-key-char =/ %x200C-200D / %x203F-2040          ; from General Punctuation Block, include the two tie symbols and ZWNJ, ZWJ
        return true;
    }
    if ((8304 /* CodePoint.SUPERSCRIPT_ZERO */ <= cp && cp <= 8591 /* CodePoint.CP_218F */) ||
        (9312 /* CodePoint.CIRCLED_DIGIT_ONE */ <= cp &&
            cp <= 9471 /* CodePoint.NEGATIVE_CIRCLED_DIGIT_ZERO */)) {
        // unquoted-key-char =/ %x2070-218F / %x2460-24FF          ; include super-/subscripts, letterlike/numberlike forms, enclosed alphanumerics
        return true;
    }
    if ((11264 /* CodePoint.GLAGOLITIC_CAPITAL_LETTER_AZU */ <= cp &&
        cp <= 12271 /* CodePoint.CP_2FEF */) ||
        (12289 /* CodePoint.IDEOGRAPHIC_COMMA */ <= cp && cp <= 55295 /* CodePoint.CP_D7FF */)) {
        // unquoted-key-char =/ %x2C00-2FEF / %x3001-D7FF          ; skip arrows, math, box drawing etc, skip 2FF0-3000 ideographic up/down markers and spaces
        return true;
    }
    if ((63744 /* CodePoint.CJK_COMPATIBILITY_IDEOGRAPH_F900 */ <= cp &&
        cp <= 64975 /* CodePoint.ARABIC_LIGATURE_SALAAMUHU_ALAYNAA */) ||
        (65008 /* CodePoint.ARABIC_LIGATURE_SALLA_USED_AS_KORANIC_STOP_SIGN_ISOLATED_FORM */ <=
            cp &&
            cp <= 65533 /* CodePoint.REPLACEMENT_CHARACTER */)) {
        // unquoted-key-char =/ %xF900-FDCF / %xFDF0-FFFD          ; skip D800-DFFF surrogate block, E000-F8FF Private Use area, FDD0-FDEF intended for process-internal use (unicode)
        return true;
    }
    if (65536 /* CodePoint.LINEAR_B_SYLLABLE_B008_A */ <= cp && cp <= 983039 /* CodePoint.CP_EFFFF */) {
        // unquoted-key-char =/ %x10000-EFFFF                      ; all chars outside BMP range, excluding Private Use planes (F0000-10FFFF)
        return true;
    }
    return false;
}
/**
 * Check whether the code point is control character other than tab
 */
function isControlOtherThanTab(cp) {
    return (((0, code_point_1.isControl)(cp) && cp !== 9 /* CodePoint.TABULATION */) || cp === 127 /* CodePoint.DELETE */);
}
/**
 * Check whether the code point is allowed-comment-char for TOML 1.1
 */
function isAllowedCommentCharacter(cp) {
    // allowed-comment-char = %x01-09 / %x0E-7F / non-ascii
    return ((1 /* CodePoint.SOH */ <= cp && cp <= 9 /* CodePoint.TABULATION */) ||
        (14 /* CodePoint.SO */ <= cp && cp <= 127 /* CodePoint.DELETE */) ||
        isNonAscii(cp));
}
/**
 * Check whether the code point is a non-ascii character.
 */
function isNonAscii(cp) {
    //  %x80-D7FF / %xE000-10FFFF
    return ((128 /* CodePoint.PAD */ <= cp && cp <= 55295 /* CodePoint.CP_D7FF */) ||
        (57344 /* CodePoint.CP_E000 */ <= cp && cp <= 1114111 /* CodePoint.CP_10FFFF */));
}
/**
 * Check whether the given values is valid date
 */
function isValidDate(y, m, d) {
    if (y >= 0 && m <= 12 && m >= 1 && d >= 1) {
        const maxDayOfMonth = m === 2
            ? y & 3 || (!(y % 25) && y & 15)
                ? 28
                : 29
            : 30 + ((m + (m >> 3)) & 1);
        return d <= maxDayOfMonth;
    }
    return false;
}
/**
 * Check whether the given values is valid time
 */
function isValidTime(h, m, s) {
    if (h >= 24 || h < 0 || m > 59 || m < 0 || s > 60 || s < 0) {
        return false;
    }
    return true;
}
/**
 * Get date from DateTimeData
 */
function getDateFromDateTimeData(data, timeZone) {
    const year = padStart(data.year, 4);
    const month = data.month ? padStart(data.month, 2) : "01";
    const day = data.day ? padStart(data.day, 2) : "01";
    const hour = padStart(data.hour, 2);
    const minute = padStart(data.minute, 2);
    const second = padStart(data.second, 2);
    const textDate = `${year}-${month}-${day}`;
    const frac = data.frac ? `.${data.frac}` : "";
    const dateValue = new Date(`${textDate}T${hour}:${minute}:${second}${frac}${timeZone}`);
    if (!isNaN(dateValue.getTime()) || data.second !== 60) {
        return dateValue;
    }
    // leap seconds?
    return new Date(`${textDate}T${hour}:${minute}:59${frac}${timeZone}`);
}
/**
 * Pad with zeros.
 */
function padStart(num, maxLength) {
    return String(num).padStart(maxLength, "0");
}
