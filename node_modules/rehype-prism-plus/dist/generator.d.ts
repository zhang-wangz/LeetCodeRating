export default rehypePrismGenerator;
export type Element = import('hast').Element;
export type Root = import('hast').Root;
/**
 * options
 * Configuration.
 */
export type Options = {
    /**
     * Set `showLineNumbers` to `true` to always display line number
     */
    showLineNumbers?: boolean;
    /**
     * Set `ignoreMissing` to `true` to ignore unsupported languages and line highlighting when no language is specified
     */
    ignoreMissing?: boolean;
    /**
     * Uses the specified language as the default if none is specified. Takes precedence over `ignoreMissing`.
     * Note: The language must be registered with refractor.
     */
    defaultLanguage?: string;
};
/**
 * Rehype prism plugin generator that highlights code blocks with refractor (prismjs)
 *
 * Pass in your own refractor object with the required languages registered:
 * https://github.com/wooorm/refractor#refractorregistersyntax
 *
 * @param {import('refractor/lib/core').Refractor} refractor
 * @return {import('unified').Plugin<[Options?], Root>}
 */
declare function rehypePrismGenerator(refractor: import('refractor/lib/core').Refractor): import('unified').Plugin<[Options?], Root>;
