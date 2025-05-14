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
export function filter<Tree extends import("unist").Node, Check extends Test>(tree: Tree, options: Options | null | undefined, test: Check): import("./complex-types.js").Matches<Tree, Check>;
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
export function filter<Tree extends import("unist").Node, Check extends Test>(tree: Tree, test: Check): import("./complex-types.js").Matches<Tree, Check>;
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
export function filter<Tree extends import("unist").Node, Check extends Test>(tree: Tree, options?: null | undefined): Tree;
export type Node = import('unist').Node;
export type Parent = import('unist').Parent;
/**
 * Test from `unist-util-is`.
 *
 * Note: we have remove and add `undefined`, because otherwise when generating
 * automatic `.d.ts` files, TS tries to flatten paths from a local perspective,
 * which doesn’t work when publishing on npm.
 */
export type Test = Exclude<import('unist-util-is').Test, undefined> | undefined;
/**
 * Configuration (optional).
 */
export type Options = {
    /**
     * Whether to drop parent nodes if they had children, but all their children
     * were filtered out (default: `true`).
     */
    cascade?: boolean | null | undefined;
};
