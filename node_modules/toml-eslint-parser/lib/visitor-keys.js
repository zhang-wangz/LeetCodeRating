"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KEYS = void 0;
const eslint_visitor_keys_1 = require("eslint-visitor-keys");
const tomlKeys = {
    Program: ["body"],
    TOMLTopLevelTable: ["body"],
    TOMLTable: ["key", "body"],
    TOMLKeyValue: ["key", "value"],
    TOMLKey: ["keys"],
    TOMLArray: ["elements"],
    TOMLInlineTable: ["body"],
    TOMLBare: [],
    TOMLQuoted: [],
    TOMLValue: [],
};
exports.KEYS = (0, eslint_visitor_keys_1.unionWith)(tomlKeys);
