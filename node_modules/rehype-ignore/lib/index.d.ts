import type { Plugin } from 'unified';
import type { Root, Literal } from 'hast';
/**
 * Raw string of HTML embedded into HTML AST.
 */
export interface Raw extends Literal {
    /**
     * Node type.
     */
    type: 'raw';
}
declare module 'hast' {
    interface RootContentMap {
        /**
         * Raw string of HTML embedded into HTML AST.
         */
        raw: Raw;
    }
    interface ElementContentMap {
        /**
         * Raw string of HTML embedded into HTML AST.
         */
        raw: Raw;
    }
}
export type RehypeIgnoreOptions = {
    /**
     *  Character to use for opening delimiter, by default `rehype:ignore:start`
     */
    openDelimiter?: string;
    /**
     * Character to use for closing delimiter, by default `rehype:ignore:end`
     */
    closeDelimiter?: string;
};
declare const rehypeIgnore: Plugin<[RehypeIgnoreOptions?], Root>;
export default rehypeIgnore;
