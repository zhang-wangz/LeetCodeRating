export namespace Prism {
    export namespace util {
        function type(o: any): string;
        function objId(obj: Object): number;
        function clone<T>(o: T, visited?: Record<number, any>): T;
    }
    export namespace languages {
        export { plainTextGrammar as plain };
        export { plainTextGrammar as plaintext };
        export { plainTextGrammar as text };
        export { plainTextGrammar as txt };
        export function extend(id: string, redef: Grammar): Grammar;
        export function insertBefore(inside: string, before: string, insert: Grammar, root?: {
            [x: string]: any;
        }): Grammar;
        export function DFS(o: any, callback: any, type: any, visited: any): void;
    }
    export let plugins: {};
    export function highlight(text: string, grammar: Grammar, language: string): string;
    export function tokenize(text: string, grammar: Grammar): TokenStream;
    export namespace hooks {
        let all: {};
        function add(name: string, callback: HookCallback): void;
        function run(name: string, env: {
            [x: string]: any;
        }): void;
    }
    export { Token };
}
/**
 * A token stream is an array of strings and {@link Token Token} objects.
 *
 * Token streams have to fulfill a few properties that are assumed by most functions (mostly internal ones) that process
 * them.
 *
 * 1. No adjacent strings.
 * 2. No empty strings.
 *
 *    The only exception here is the token stream that only contains the empty string and nothing else.
 */
export type TokenStream = Array<string | Token>;
export type RematchOptions = {
    cause: string;
    reach: number;
};
export type LinkedListNode = {
    value: T;
    /**
     * The previous node.
     */
    prev: LinkedListNode<T> | null;
    /**
     * The next node.
     */
    next: LinkedListNode<T> | null;
};
declare var plainTextGrammar: {};
/**
 * Creates a new token.
 *
 * @param {string} type See {@link Token#type type}
 * @param {string | TokenStream} content See {@link Token#content content}
 * @param {string|string[]} [alias] The alias(es) of the token.
 * @param {string} [matchedStr=""] A copy of the full string this token was created from.
 * @class
 * @global
 * @public
 */
declare function Token(type: string, content: string | TokenStream, alias?: string | string[], matchedStr?: string): void;
declare class Token {
    /**
     * Creates a new token.
     *
     * @param {string} type See {@link Token#type type}
     * @param {string | TokenStream} content See {@link Token#content content}
     * @param {string|string[]} [alias] The alias(es) of the token.
     * @param {string} [matchedStr=""] A copy of the full string this token was created from.
     * @class
     * @global
     * @public
     */
    constructor(type: string, content: string | TokenStream, alias?: string | string[], matchedStr?: string);
    /**
     * The type of the token.
     *
     * This is usually the key of a pattern in a {@link Grammar}.
     *
     * @type {string}
     * @see GrammarToken
     * @public
     */
    public type: string;
    /**
     * The strings or tokens contained by this token.
     *
     * This will be a token stream if the pattern matched also defined an `inside` grammar.
     *
     * @type {string | TokenStream}
     * @public
     */
    public content: string | TokenStream;
    /**
     * The alias(es) of the token.
     *
     * @type {string|string[]}
     * @see GrammarToken
     * @public
     */
    public alias: string | string[];
    length: number;
}
export {};
//# sourceMappingURL=prism-core.d.ts.map