export default rehypePrismCommon;
/**
 * Rehype prism plugin that highlights code blocks with refractor (prismjs)
 * Supported languages: https://github.com/wooorm/refractor#data
 *
 * Consider using rehypePrismGenerator to generate a plugin
 * that supports your required languages.
 */
declare const rehypePrismCommon: import("unified").Plugin<[import("./generator.js").Options?], import("hast").Root, import("hast").Root>;
