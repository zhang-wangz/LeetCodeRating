import { Plugin } from 'unified';
import { Root, Element, ElementContent, RootContent } from 'hast';
/** Get the node tree source code string */
export declare const getCodeString: (data?: ElementContent[], code?: string) => string;
export type RehypeRewriteOptions = {
    /**
     * Select an element to be wrapped. Expects a string selector that can be passed to hast-util-select ([supported selectors](https://github.com/syntax-tree/hast-util-select/blob/master/readme.md#support)).
     * If `selector` is not set then wrap will check for a body all elements.
     */
    selector?: string;
    /** Rewrite Element. */
    rewrite(node: Root | RootContent, index?: number, parent?: Root | Element): void;
};
declare const remarkRewrite: Plugin<[RehypeRewriteOptions?], Root>;
export default remarkRewrite;
