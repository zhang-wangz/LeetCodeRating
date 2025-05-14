import { parseForESLint } from "./parser";
import type * as AST from "./ast";
import { traverseNodes } from "./traverse";
import { getStaticTOMLValue } from "./utils";
import { ParseError } from "./errors";
import type { ParserOptions } from "./parser-options";
export * as meta from "./meta";
export { name } from "./meta";
export { AST, ParseError };
export { parseForESLint };
export declare const VisitorKeys: import("eslint").SourceCode.VisitorKeys;
export { traverseNodes, getStaticTOMLValue };
/**
 * Parse TOML source code
 */
export declare function parseTOML(code: string, options?: ParserOptions): AST.TOMLProgram;
