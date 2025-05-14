/**
 * @import {Options} from 'hast-util-minify-whitespace'
 * @import {Root} from 'hast'
 */

import {minifyWhitespace} from 'hast-util-minify-whitespace'

/**
 * Minify whitespace.
 *
 * @param {Options | null | undefined} [options]
 *   Configuration (optional).
 * @returns
 *   Transform.
 */
export default function rehypeMinifyWhitespace(options) {
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  return function (tree) {
    minifyWhitespace(tree, options)
  }
}
