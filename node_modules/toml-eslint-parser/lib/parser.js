"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseForESLint = void 0;
const toml_parser_1 = require("./toml-parser");
const visitor_keys_1 = require("./visitor-keys");
/**
 * Parse source code
 */
function parseForESLint(code, options) {
    const parser = new toml_parser_1.TOMLParser(code, options);
    const ast = parser.parse();
    return {
        ast,
        visitorKeys: visitor_keys_1.KEYS,
        services: {
            isTOML: true,
        },
    };
}
exports.parseForESLint = parseForESLint;
