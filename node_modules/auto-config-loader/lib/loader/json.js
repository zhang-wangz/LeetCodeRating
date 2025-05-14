"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonLoader = jsonLoader;
const jsonc_eslint_parser_1 = require("jsonc-eslint-parser");
function jsonLoader(_, content) {
    const ast = (0, jsonc_eslint_parser_1.parseJSON)(content);
    return (0, jsonc_eslint_parser_1.getStaticJSONValue)(ast);
}
