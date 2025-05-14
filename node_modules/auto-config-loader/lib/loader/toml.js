"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tomlLoader = tomlLoader;
const toml_eslint_parser_1 = require("toml-eslint-parser");
function tomlLoader(_, content) {
    const ast = (0, toml_eslint_parser_1.parseTOML)(content);
    return (0, toml_eslint_parser_1.getStaticTOMLValue)(ast);
}
