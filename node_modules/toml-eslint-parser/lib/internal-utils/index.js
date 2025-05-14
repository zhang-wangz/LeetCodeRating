"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toKeyName = exports.last = void 0;
/**
 * Get the last element from given array
 */
function last(arr) {
    var _a;
    return (_a = arr[arr.length - 1]) !== null && _a !== void 0 ? _a : null;
}
exports.last = last;
/**
 * Node to key name
 */
function toKeyName(node) {
    return node.type === "TOMLBare" ? node.name : node.value;
}
exports.toKeyName = toKeyName;
