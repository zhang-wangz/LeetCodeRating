"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TOMLParser = void 0;
const internal_utils_1 = require("../internal-utils");
const parser_options_1 = require("../parser-options");
const context_1 = require("./context");
const STATE_FOR_ERROR = {
    VALUE: "missing-value",
};
const STRING_VALUE_STYLE_MAP = {
    BasicString: "basic",
    MultiLineBasicString: "basic",
    LiteralString: "literal",
    MultiLineLiteralString: "literal",
};
const STRING_KEY_STYLE_MAP = {
    BasicString: "basic",
    LiteralString: "literal",
};
const DATETIME_VALUE_KIND_MAP = {
    OffsetDateTime: "offset-date-time",
    LocalDateTime: "local-date-time",
    LocalDate: "local-date",
    LocalTime: "local-time",
};
class TOMLParser {
    /**
     * Initialize this parser.
     */
    constructor(text, parserOptions) {
        this.text = text;
        this.parserOptions = parserOptions || {};
        this.tomlVersion = (0, parser_options_1.getTOMLVer)(this.parserOptions.tomlVersion);
    }
    /**
     * Parse TOML
     */
    parse() {
        const ast = {
            type: "Program",
            body: [],
            sourceType: "module",
            tokens: [],
            comments: [],
            parent: null,
            range: [0, 0],
            loc: {
                start: {
                    line: 1,
                    column: 0,
                },
                end: {
                    line: 1,
                    column: 0,
                },
            },
        };
        const node = {
            type: "TOMLTopLevelTable",
            body: [],
            parent: ast,
            range: cloneRange(ast.range),
            loc: cloneLoc(ast.loc),
        };
        ast.body = [node];
        const ctx = new context_1.Context({
            text: this.text,
            parserOptions: this.parserOptions,
            topLevelTable: node,
        });
        let token = ctx.nextToken();
        if (token) {
            node.range[0] = token.range[0];
            node.loc.start = clonePos(token.loc.start);
            while (token) {
                const state = ctx.stateStack.pop() || "TABLE";
                ctx.stateStack.push(...this[state](token, ctx));
                token = ctx.nextToken();
            }
            const state = ctx.stateStack.pop() || "TABLE";
            if (state in STATE_FOR_ERROR) {
                return ctx.reportParseError(STATE_FOR_ERROR[state], null);
            }
            if (ctx.table.type === "TOMLTable") {
                applyEndLoc(ctx.table, (0, internal_utils_1.last)(ctx.table.body));
            }
            applyEndLoc(node, (0, internal_utils_1.last)(node.body));
        }
        ctx.verifyDuplicateKeys();
        ast.tokens = ctx.tokens;
        ast.comments = ctx.comments;
        const endPos = ctx.endPos;
        ast.range[1] = endPos.offset;
        ast.loc.end = {
            line: endPos.line,
            column: endPos.column,
        };
        return ast;
    }
    TABLE(token, ctx) {
        if (isBare(token) || isString(token)) {
            return this.processKeyValue(token, ctx.table, ctx);
        }
        if (isLeftBracket(token)) {
            return this.processTable(token, ctx.topLevelTable, ctx);
        }
        return ctx.reportParseError("unexpected-token", token);
    }
    VALUE(token, ctx) {
        if (isString(token) || isMultiLineString(token)) {
            return this.processStringValue(token, ctx);
        }
        if (isNumber(token)) {
            return this.processNumberValue(token, ctx);
        }
        if (isBoolean(token)) {
            return this.processBooleanValue(token, ctx);
        }
        if (isDateTime(token)) {
            return this.processDateTimeValue(token, ctx);
        }
        if (isLeftBracket(token)) {
            return this.processArray(token, ctx);
        }
        if (isLeftBrace(token)) {
            return this.processInlineTable(token, ctx);
        }
        return ctx.reportParseError("unexpected-token", token);
    }
    processTable(token, topLevelTableNode, ctx) {
        const tableNode = {
            type: "TOMLTable",
            kind: "standard",
            key: null,
            resolvedKey: [],
            body: [],
            parent: topLevelTableNode,
            range: cloneRange(token.range),
            loc: cloneLoc(token.loc),
        };
        if (ctx.table.type === "TOMLTable") {
            applyEndLoc(ctx.table, (0, internal_utils_1.last)(ctx.table.body));
        }
        topLevelTableNode.body.push(tableNode);
        ctx.table = tableNode;
        let targetToken = ctx.nextToken({
            needSameLine: "invalid-key-value-newline",
        });
        if (isLeftBracket(targetToken)) {
            if (token.range[1] < targetToken.range[0]) {
                return ctx.reportParseError("invalid-space", targetToken);
            }
            tableNode.kind = "array";
            targetToken = ctx.nextToken({
                needSameLine: "invalid-key-value-newline",
            });
        }
        if (isRightBracket(targetToken)) {
            return ctx.reportParseError("missing-key", targetToken);
        }
        if (!targetToken) {
            return ctx.reportParseError("unterminated-table-key", null);
        }
        const keyNodeData = this.processKeyNode(targetToken, tableNode, ctx);
        targetToken = keyNodeData.nextToken;
        if (!isRightBracket(targetToken)) {
            return ctx.reportParseError("unterminated-table-key", targetToken);
        }
        if (tableNode.kind === "array") {
            const rightBracket = targetToken;
            targetToken = ctx.nextToken({
                needSameLine: "invalid-key-value-newline",
            });
            if (!isRightBracket(targetToken)) {
                return ctx.reportParseError("unterminated-table-key", targetToken);
            }
            if (rightBracket.range[1] < targetToken.range[0]) {
                return ctx.reportParseError("invalid-space", targetToken);
            }
        }
        applyEndLoc(tableNode, targetToken);
        ctx.applyResolveKeyForTable(tableNode);
        ctx.needNewLine = true;
        return [];
    }
    processKeyValue(token, tableNode, ctx) {
        const keyValueNode = {
            type: "TOMLKeyValue",
            key: null,
            value: null,
            parent: tableNode,
            range: cloneRange(token.range),
            loc: cloneLoc(token.loc),
        };
        tableNode.body.push(keyValueNode);
        const { nextToken: targetToken } = this.processKeyNode(token, keyValueNode, ctx);
        if (!isEq(targetToken)) {
            return ctx.reportParseError("missing-equals-sign", targetToken);
        }
        ctx.addValueContainer({
            parent: keyValueNode,
            set: (valNode) => {
                keyValueNode.value = valNode;
                applyEndLoc(keyValueNode, valNode);
                ctx.needNewLine = true;
                return [];
            },
        });
        ctx.needSameLine = "invalid-key-value-newline";
        return ["VALUE"];
    }
    processKeyNode(token, parent, ctx) {
        const keyNode = {
            type: "TOMLKey",
            keys: [],
            parent,
            range: cloneRange(token.range),
            loc: cloneLoc(token.loc),
        };
        parent.key = keyNode;
        let targetToken = token;
        while (targetToken) {
            if (isBare(targetToken)) {
                this.processBareKey(targetToken, keyNode);
            }
            else if (isString(targetToken)) {
                this.processStringKey(targetToken, keyNode);
            }
            else {
                break;
            }
            targetToken = ctx.nextToken({
                needSameLine: "invalid-key-value-newline",
            });
            if (isDot(targetToken)) {
                targetToken = ctx.nextToken({
                    needSameLine: "invalid-key-value-newline",
                });
            }
            else {
                break;
            }
        }
        applyEndLoc(keyNode, (0, internal_utils_1.last)(keyNode.keys));
        return { keyNode, nextToken: targetToken };
    }
    processBareKey(token, keyNode) {
        const node = {
            type: "TOMLBare",
            name: token.value,
            parent: keyNode,
            range: cloneRange(token.range),
            loc: cloneLoc(token.loc),
        };
        keyNode.keys.push(node);
    }
    processStringKey(token, keyNode) {
        const node = {
            type: "TOMLQuoted",
            kind: "string",
            value: token.string,
            style: STRING_KEY_STYLE_MAP[token.type],
            multiline: false,
            parent: keyNode,
            range: cloneRange(token.range),
            loc: cloneLoc(token.loc),
        };
        keyNode.keys.push(node);
    }
    processStringValue(token, ctx) {
        const valueContainer = ctx.consumeValueContainer();
        const node = {
            type: "TOMLValue",
            kind: "string",
            value: token.string,
            style: STRING_VALUE_STYLE_MAP[token.type],
            multiline: isMultiLineString(token),
            parent: valueContainer.parent,
            range: cloneRange(token.range),
            loc: cloneLoc(token.loc),
        };
        return valueContainer.set(node);
    }
    processNumberValue(token, ctx) {
        const valueContainer = ctx.consumeValueContainer();
        const text = this.text;
        const [startRange, endRange] = token.range;
        let numberString = null;
        /**
         * Get the text of number
         */
        // eslint-disable-next-line func-style -- ignore
        const getNumberText = () => {
            return (numberString !== null && numberString !== void 0 ? numberString : (numberString = text.slice(startRange, endRange).replace(/_/g, "")));
        };
        let node;
        if (token.type === "Integer") {
            node = {
                type: "TOMLValue",
                kind: "integer",
                value: token.number,
                bigint: token.bigint,
                get number() {
                    return getNumberText();
                },
                parent: valueContainer.parent,
                range: cloneRange(token.range),
                loc: cloneLoc(token.loc),
            };
        }
        else {
            node = {
                type: "TOMLValue",
                kind: "float",
                value: token.number,
                get number() {
                    return getNumberText();
                },
                parent: valueContainer.parent,
                range: cloneRange(token.range),
                loc: cloneLoc(token.loc),
            };
        }
        return valueContainer.set(node);
    }
    processBooleanValue(token, ctx) {
        const valueContainer = ctx.consumeValueContainer();
        const node = {
            type: "TOMLValue",
            kind: "boolean",
            value: token.boolean,
            parent: valueContainer.parent,
            range: cloneRange(token.range),
            loc: cloneLoc(token.loc),
        };
        return valueContainer.set(node);
    }
    processDateTimeValue(token, ctx) {
        const valueContainer = ctx.consumeValueContainer();
        const node = {
            type: "TOMLValue",
            kind: DATETIME_VALUE_KIND_MAP[token.type],
            value: token.date,
            datetime: token.value,
            parent: valueContainer.parent,
            range: cloneRange(token.range),
            loc: cloneLoc(token.loc),
        };
        return valueContainer.set(node);
    }
    processArray(token, ctx) {
        const valueContainer = ctx.consumeValueContainer();
        const node = {
            type: "TOMLArray",
            elements: [],
            parent: valueContainer.parent,
            range: cloneRange(token.range),
            loc: cloneLoc(token.loc),
        };
        const nextToken = ctx.nextToken({ valuesEnabled: true });
        if (isRightBracket(nextToken)) {
            applyEndLoc(node, nextToken);
            return valueContainer.set(node);
        }
        // Back token
        ctx.backToken();
        return this.processArrayValue(node, valueContainer, ctx);
    }
    processArrayValue(node, valueContainer, ctx) {
        ctx.addValueContainer({
            parent: node,
            set: (valNode) => {
                node.elements.push(valNode);
                let nextToken = ctx.nextToken({ valuesEnabled: true });
                const hasComma = isComma(nextToken);
                if (hasComma) {
                    nextToken = ctx.nextToken({ valuesEnabled: true });
                }
                if (isRightBracket(nextToken)) {
                    applyEndLoc(node, nextToken);
                    return valueContainer.set(node);
                }
                if (hasComma) {
                    // Back token
                    ctx.backToken();
                    // setup next value container
                    return this.processArrayValue(node, valueContainer, ctx);
                }
                return ctx.reportParseError(nextToken ? "missing-comma" : "unterminated-array", nextToken);
            },
        });
        return ["VALUE"];
    }
    processInlineTable(token, ctx) {
        const valueContainer = ctx.consumeValueContainer();
        const node = {
            type: "TOMLInlineTable",
            body: [],
            parent: valueContainer.parent,
            range: cloneRange(token.range),
            loc: cloneLoc(token.loc),
        };
        const needSameLine = this.tomlVersion.gte(1, 1)
            ? // Line breaks in inline tables are allowed.
                // Added in TOML 1.1
                undefined
            : "invalid-inline-table-newline";
        const nextToken = ctx.nextToken({
            needSameLine,
        });
        if (nextToken) {
            if (isBare(nextToken) || isString(nextToken)) {
                return this.processInlineTableKeyValue(nextToken, node, valueContainer, ctx);
            }
            if (isRightBrace(nextToken)) {
                applyEndLoc(node, nextToken);
                return valueContainer.set(node);
            }
        }
        return ctx.reportParseError("unexpected-token", nextToken);
    }
    processInlineTableKeyValue(token, inlineTableNode, valueContainer, ctx) {
        const keyValueNode = {
            type: "TOMLKeyValue",
            key: null,
            value: null,
            parent: inlineTableNode,
            range: cloneRange(token.range),
            loc: cloneLoc(token.loc),
        };
        inlineTableNode.body.push(keyValueNode);
        const { nextToken: targetToken } = this.processKeyNode(token, keyValueNode, ctx);
        if (!isEq(targetToken)) {
            return ctx.reportParseError("missing-equals-sign", targetToken);
        }
        const needSameLine = this.tomlVersion.gte(1, 1)
            ? // Line breaks in inline tables are allowed.
                // Added in TOML 1.1
                undefined
            : "invalid-inline-table-newline";
        ctx.addValueContainer({
            parent: keyValueNode,
            set: (valNode) => {
                keyValueNode.value = valNode;
                applyEndLoc(keyValueNode, valNode);
                let nextToken = ctx.nextToken({ needSameLine });
                if (isComma(nextToken)) {
                    nextToken = ctx.nextToken({ needSameLine });
                    if (nextToken && (isBare(nextToken) || isString(nextToken))) {
                        // setup next value container
                        return this.processInlineTableKeyValue(nextToken, inlineTableNode, valueContainer, ctx);
                    }
                    if (isRightBrace(nextToken)) {
                        if (this.tomlVersion.lt(1, 1)) {
                            return ctx.reportParseError("invalid-trailing-comma-in-inline-table", nextToken);
                        }
                        // Trailing commas in inline tables are allowed.
                        // Added in TOML 1.1
                    }
                    else {
                        return ctx.reportParseError(nextToken ? "unexpected-token" : "unterminated-inline-table", nextToken);
                    }
                }
                if (isRightBrace(nextToken)) {
                    applyEndLoc(inlineTableNode, nextToken);
                    return valueContainer.set(inlineTableNode);
                }
                return ctx.reportParseError(nextToken ? "missing-comma" : "unterminated-inline-table", nextToken);
            },
        });
        ctx.needSameLine = "invalid-key-value-newline";
        return ["VALUE"];
    }
}
exports.TOMLParser = TOMLParser;
/**
 * Check whether the given token is a dot.
 */
function isDot(token) {
    return isPunctuator(token) && token.value === ".";
}
/**
 * Check whether the given token is an equal sign.
 */
function isEq(token) {
    return isPunctuator(token) && token.value === "=";
}
/**
 * Check whether the given token is a left bracket.
 */
function isLeftBracket(token) {
    return isPunctuator(token) && token.value === "[";
}
/**
 * Check whether the given token is a right bracket.
 */
function isRightBracket(token) {
    return isPunctuator(token) && token.value === "]";
}
/**
 * Check whether the given token is a left brace.
 */
function isLeftBrace(token) {
    return isPunctuator(token) && token.value === "{";
}
/**
 * Check whether the given token is a right brace.
 */
function isRightBrace(token) {
    return isPunctuator(token) && token.value === "}";
}
/**
 * Check whether the given token is a comma.
 */
function isComma(token) {
    return isPunctuator(token) && token.value === ",";
}
/**
 * Check whether the given token is a punctuator.
 */
function isPunctuator(token) {
    return Boolean(token && token.type === "Punctuator");
}
/**
 * Check whether the given token is a bare token.
 */
function isBare(token) {
    return token.type === "Bare";
}
/**
 * Check whether the given token is a string.
 */
function isString(token) {
    return token.type === "BasicString" || token.type === "LiteralString";
}
/**
 * Check whether the given token is a multi-line string.
 */
function isMultiLineString(token) {
    return (token.type === "MultiLineBasicString" ||
        token.type === "MultiLineLiteralString");
}
/**
 * Check whether the given token is a number.
 */
function isNumber(token) {
    return token.type === "Integer" || token.type === "Float";
}
/**
 * Check whether the given token is a boolean.
 */
function isBoolean(token) {
    return token.type === "Boolean";
}
/**
 * Check whether the given token is a date time.
 */
function isDateTime(token) {
    return (token.type === "OffsetDateTime" ||
        token.type === "LocalDateTime" ||
        token.type === "LocalDate" ||
        token.type === "LocalTime");
}
/**
 * Apply end locations
 */
function applyEndLoc(node, child) {
    if (child) {
        node.range[1] = child.range[1];
        node.loc.end = clonePos(child.loc.end);
    }
}
/**
 * clone the location.
 */
function cloneRange(range) {
    return [range[0], range[1]];
}
/**
 * clone the location.
 */
function cloneLoc(loc) {
    return {
        start: clonePos(loc.start),
        end: clonePos(loc.end),
    };
}
/**
 * clone the location.
 */
function clonePos(pos) {
    return {
        line: pos.line,
        column: pos.column,
    };
}
