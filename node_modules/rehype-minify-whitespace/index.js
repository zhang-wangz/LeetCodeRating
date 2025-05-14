/**
 * rehype plugin to minify whitespace between elements.
 *
 * ## What is this?
 *
 * This package is a plugin that can minify the whitespace between elements.
 *
 * ## When should I use this?
 *
 * You can use this plugin when you want to improve the size of HTML documents.
 *
 * ## API
 *
 * ### `unified().use(rehypeMinifyWhitespace[, options])`
 *
 * Minify whitespace.
 *
 * ###### Parameters
 *
 * *   `options` (`Options`, optional)
 *     — configuration
 *
 * ###### Returns
 *
 * Transform ([`Transformer`](https://github.com/unifiedjs/unified#transformer)).
 *
 * ### `Options`
 *
 * Configuration (TypeScript).
 *
 * ###### Fields
 *
 * *   `newlines` (`boolean`, default: `false`)
 *     — collapse whitespace containing newlines to `'\n'` instead of `' '`;
 *     the default is to collapse to a single space
 *
 * @example
 *   {}
 *   <h1>Heading</h1>
 *   <p><strong>This</strong> and <em>that</em></p>
 */

/**
 * @typedef {import('hast-util-minify-whitespace').Options} Options
 */

export {default} from './lib/index.js'
