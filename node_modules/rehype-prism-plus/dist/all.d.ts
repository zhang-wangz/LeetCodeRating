export default rehypePrismAll;
/**
 * Rehype prism plugin that highlights code blocks with refractor (prismjs)
 * This supports all the languages and should be used on the server side.
 *
 * Consider using rehypePrismCommon or rehypePrismGenerator to generate a plugin
 * that supports your required languages.
 */
declare const rehypePrismAll: import("unified").Plugin<[import("./generator.js").Options?], import("hast").Root, import("hast").Root>;
