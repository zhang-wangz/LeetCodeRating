import type { SourceCode } from "eslint";
import type { TOMLProgram } from "./ast";
import type { ParserOptions } from "./parser-options";
/**
 * Parse source code
 */
export declare function parseForESLint(code: string, options?: ParserOptions): {
    ast: TOMLProgram;
    visitorKeys: SourceCode.VisitorKeys;
    services: {
        isTOML: boolean;
    };
};
