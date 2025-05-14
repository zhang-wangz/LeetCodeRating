"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodePointIterator = void 0;
const locs_1 = require("./locs");
class CodePointIterator {
    /**
     * Initialize this char iterator.
     */
    constructor(text) {
        this.locs = new locs_1.Locations();
        this.lastCodePoint = 0 /* CodePoint.NULL */;
        this.start = -1;
        this.end = 0;
        this.text = text;
    }
    next() {
        if (this.lastCodePoint === -1 /* CodePoint.EOF */) {
            return -1 /* CodePoint.EOF */;
        }
        return (this.lastCodePoint = this.moveAt(this.end));
    }
    getStartLoc() {
        return this.getLocFromIndex(this.start);
    }
    getEndLoc() {
        return this.getLocFromIndex(this.end);
    }
    getLocFromIndex(index) {
        return this.locs.getLocFromIndex(index);
    }
    eat(cp) {
        if (this.text.codePointAt(this.end) === cp) {
            this.next();
            return true;
        }
        return false;
    }
    moveAt(offset) {
        var _a;
        this.start = this.end = offset;
        const cp = (_a = this.text.codePointAt(this.start)) !== null && _a !== void 0 ? _a : -1 /* CodePoint.EOF */;
        if (cp === -1 /* CodePoint.EOF */) {
            this.end = this.start;
            return cp;
        }
        const shift = cp >= 0x10000 ? 2 : 1;
        this.end += shift;
        if (cp === 10 /* CodePoint.LINE_FEED */) {
            this.locs.addOffset(this.end);
        }
        else if (cp === 13 /* CodePoint.CARRIAGE_RETURN */) {
            if (this.text.codePointAt(this.end) === 10 /* CodePoint.LINE_FEED */) {
                this.end++;
                this.locs.addOffset(this.end);
            }
            return 10 /* CodePoint.LINE_FEED */;
        }
        return cp;
    }
}
exports.CodePointIterator = CodePointIterator;
