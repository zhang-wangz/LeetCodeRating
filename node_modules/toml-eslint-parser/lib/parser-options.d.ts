export type TOMLVersionOption = "1.0" | "1.1" | "1.0.0" | "1.1.0" | "latest" | "next";
export interface TOMLVer {
    lt(major: number, minor: number): boolean;
    gte(major: number, minor: number): boolean;
}
export interface ParserOptions {
    filePath?: string;
    tomlVersion?: TOMLVersionOption;
}
/**
 * Get TOML version object from given TOML version string.
 */
export declare function getTOMLVer(v: TOMLVersionOption | undefined | null): TOMLVer;
