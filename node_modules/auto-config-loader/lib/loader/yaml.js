"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.yamlLoader = yamlLoader;
const yaml_eslint_parser_1 = require("yaml-eslint-parser");
function yamlLoader(_, content) {
    const ast = (0, yaml_eslint_parser_1.parseYAML)(content);
    return (0, yaml_eslint_parser_1.getStaticYAMLValue)(ast);
}
