"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = void 0;
const errors_1 = require("../errors");
const tokenizer_1 = require("../tokenizer");
const keys_resolver_1 = require("./keys-resolver");
class Context {
    constructor(data) {
        this.tokens = [];
        this.comments = [];
        this.back = null;
        this.stateStack = [];
        this.needNewLine = false;
        this.needSameLine = false;
        this.currToken = null;
        this.prevToken = null;
        this.valueContainerStack = [];
        this.tokenizer = new tokenizer_1.Tokenizer(data.text, data.parserOptions);
        this.topLevelTable = data.topLevelTable;
        this.table = data.topLevelTable;
        this.keysResolver = new keys_resolver_1.KeysResolver(this);
    }
    get startPos() {
        return this.tokenizer.positions.start;
    }
    get endPos() {
        return this.tokenizer.positions.end;
    }
    /**
     * Get the next token.
     */
    nextToken(option) {
        this.prevToken = this.currToken;
        if (this.back) {
            this.currToken = this.back;
            this.back = null;
        }
        else {
            this.currToken = this._nextTokenFromTokenizer(option);
        }
        if ((this.needNewLine || this.needSameLine || (option === null || option === void 0 ? void 0 : option.needSameLine)) &&
            this.prevToken &&
            this.currToken) {
            if (this.prevToken.loc.end.line === this.currToken.loc.start.line) {
                if (this.needNewLine) {
                    return this.reportParseError("missing-newline", this.currToken);
                }
            }
            else {
                const needSameLine = this.needSameLine || (option === null || option === void 0 ? void 0 : option.needSameLine);
                if (needSameLine) {
                    return this.reportParseError(needSameLine, this.currToken);
                }
            }
        }
        this.needNewLine = false;
        this.needSameLine = false;
        return this.currToken;
    }
    _nextTokenFromTokenizer(option) {
        const valuesEnabled = this.tokenizer.valuesEnabled;
        if (option === null || option === void 0 ? void 0 : option.valuesEnabled) {
            this.tokenizer.valuesEnabled = option.valuesEnabled;
        }
        let token = this.tokenizer.nextToken();
        while (token && token.type === "Block") {
            this.comments.push(token);
            token = this.tokenizer.nextToken();
        }
        if (token) {
            this.tokens.push(token);
        }
        this.tokenizer.valuesEnabled = valuesEnabled;
        return token;
    }
    backToken() {
        if (this.back) {
            throw new Error("Illegal state");
        }
        this.back = this.currToken;
        this.currToken = this.prevToken;
    }
    addValueContainer(valueContainer) {
        this.valueContainerStack.push(valueContainer);
        this.tokenizer.valuesEnabled = true;
    }
    consumeValueContainer() {
        const valueContainer = this.valueContainerStack.pop();
        this.tokenizer.valuesEnabled = this.valueContainerStack.length > 0;
        return valueContainer;
    }
    applyResolveKeyForTable(node) {
        this.keysResolver.applyResolveKeyForTable(node);
    }
    verifyDuplicateKeys() {
        this.keysResolver.verifyDuplicateKeys(this.topLevelTable);
    }
    /**
     * Report an invalid token error.
     */
    reportParseError(code, token) {
        let offset, line, column;
        if (token) {
            offset = token.range[0];
            line = token.loc.start.line;
            column = token.loc.start.column;
        }
        else {
            const startPos = this.startPos;
            offset = startPos.offset;
            line = startPos.line;
            column = startPos.column;
        }
        throw new errors_1.ParseError(code, offset, line, column);
    }
}
exports.Context = Context;
