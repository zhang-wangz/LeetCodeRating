/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist').Parent} Parent
 *
 * @typedef {Exclude<import('unist-util-is').Test, undefined> | undefined} Test
 *   Test from `unist-util-is`.
 *
 *   Note: we have remove and add `undefined`, because otherwise when generating
 *   automatic `.d.ts` files, TS tries to flatten paths from a local perspective,
 *   which doesn’t work when publishing on npm.
 */

/**
 * @typedef Options
 *   Configuration (optional).
 * @property {boolean | null | undefined} [cascade=true]
 *   Whether to drop parent nodes if they had children, but all their children
 *   were filtered out (default: `true`).
 */

import {convert} from 'unist-util-is'

const own = {}.hasOwnProperty

/**
 * Create a new `tree` of copies of all nodes that pass `test`.
 *
 * The tree is walked in *preorder* (NLR), visiting the node itself, then its
 * head, etc.
 *
 * @template {Node} Tree
 * @template {Test} Check
 *
 * @overload
 * @param {Tree} tree
 * @param {Options | null | undefined} options
 * @param {Check} test
 * @returns {import('./complex-types.js').Matches<Tree, Check>}
 *
 * @overload
 * @param {Tree} tree
 * @param {Check} test
 * @returns {import('./complex-types.js').Matches<Tree, Check>}
 *
 * @overload
 * @param {Tree} tree
 * @param {null | undefined} [options]
 * @returns {Tree}
 *
 * @param {Node} tree
 *   Tree to filter.
 * @param {Options | Test} [options]
 *   Configuration (optional).
 * @param {Test} [test]
 *   `unist-util-is` compatible test.
 * @returns {Node | undefined}
 *   New filtered tree.
 *
 *   `undefined` is returned if `tree` itself didn’t pass the test, or is
 *   cascaded away.
 */
export function filter(tree, options, test) {
  const is = convert(test || options)
  const cascadeRaw =
    options && typeof options === 'object' && 'cascade' in options
      ? /** @type {boolean | null | undefined} */ (options.cascade)
      : undefined
  const cascade =
    cascadeRaw === undefined || cascadeRaw === null ? true : cascadeRaw

  return preorder(tree)

  /**
   * @param {Node} node
   *   Current node.
   * @param {number | undefined} [index]
   *   Index of `node` in `parent`.
   * @param {Parent | undefined} [parentNode]
   *   Parent node.
   * @returns {Node | undefined}
   *   Shallow copy of `node`.
   */
  function preorder(node, index, parentNode) {
    /** @type {Array<Node>} */
    const children = []

    if (!is(node, index, parentNode)) return undefined

    if (parent(node)) {
      let childIndex = -1

      while (++childIndex < node.children.length) {
        const result = preorder(node.children[childIndex], childIndex, node)

        if (result) {
          children.push(result)
        }
      }

      if (cascade && node.children.length > 0 && children.length === 0) {
        return undefined
      }
    }

    // Create a shallow clone, using the new children.
    /** @type {typeof node} */
    // @ts-expect-error all the fields will be copied over.
    const next = {}
    /** @type {string} */
    let key

    for (key in node) {
      if (own.call(node, key)) {
        // @ts-expect-error: Looks like a record.
        next[key] = key === 'children' ? children : node[key]
      }
    }

    return next
  }
}

/**
 * @param {Node} node
 * @returns {node is Parent}
 */
function parent(node) {
  return 'children' in node && node.children !== undefined
}
