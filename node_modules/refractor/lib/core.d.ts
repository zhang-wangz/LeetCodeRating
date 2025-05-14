/** @type {Refractor} */
export const refractor: Refractor;
/**
 * Hidden Prism token.
 */
export type _Token = {
    /**
     *   Alias.
     */
    alias: string;
    /**
     *   Content.
     */
    content: string;
    /**
     *   Length.
     */
    length: number;
    /**
     *   Type.
     */
    type: string;
};
/**
 * Hidden Prism environment.
 */
export type _Env = {
    /**
     *   Attributes.
     */
    attributes: Record<string, string>;
    /**
     *   Classes.
     */
    classes: Array<string>;
    /**
     *   Content.
     */
    content: Array<RefractorElement | Text> | RefractorElement | Text;
    /**
     *   Language.
     */
    language: string;
    /**
     *   Tag.
     */
    tag: string;
    /**
     *   Type.
     */
    type: string;
};
/**
 * Element; narrowed down to what’s used here.
 */
export type RefractorElement = Omit<Element, "children"> & {
    children: Array<RefractorElement | Text>;
};
/**
 * Root; narrowed down to what’s used here.
 */
export type RefractorRoot = Omit<Root, "children"> & {
    children: Array<RefractorElement | Text>;
};
/**
 * Refractor syntax function.
 */
export type Syntax = ((prism: Refractor) => undefined | void) & {
    aliases?: Array<string> | undefined;
    displayName: string;
};
/**
 * Virtual syntax highlighting
 */
export type Refractor = {
    alias: typeof alias;
    languages: Languages;
    listLanguages: typeof listLanguages;
    highlight: typeof highlight;
    registered: typeof registered;
    register: typeof register;
};
import type { Text } from 'hast';
import type { Element } from 'hast';
import type { Root } from 'hast';
/**
 * Register aliases for already registered languages.
 *
 * @param {Record<string, ReadonlyArray<string> | string> | string} language
 *   Language to alias.
 * @param {ReadonlyArray<string> | string | null | undefined} [alias]
 *   Aliases.
 * @returns {undefined}
 *   Nothing.
 */
declare function alias(language: Record<string, ReadonlyArray<string> | string> | string, alias?: ReadonlyArray<string> | string | null | undefined): undefined;
import type { Languages } from 'prismjs';
/**
 * List all registered languages (names and aliases).
 *
 * @returns {Array<string>}
 *   List of language names.
 */
declare function listLanguages(): Array<string>;
/**
 * Highlight `value` (code) as `language` (programming language).
 *
 * @param {string} value
 *   Code to highlight.
 * @param {Grammar | string} language
 *   Programming language name, alias, or grammar.
 * @returns {RefractorRoot}
 *   Node representing highlighted code.
 */
declare function highlight(value: string, language: Grammar | string): RefractorRoot;
/**
 * Check whether an `alias` or `language` is registered.
 *
 * @param {string} aliasOrLanguage
 *   Language or alias to check.
 * @returns {boolean}
 *   Whether the language is registered.
 */
declare function registered(aliasOrLanguage: string): boolean;
/**
 * Register a syntax.
 *
 * @param {Syntax} syntax
 *   Language function made for refractor, as in, the files in
 *   `refractor/lang/*.js`.
 * @returns {undefined}
 *   Nothing.
 */
declare function register(syntax: Syntax): undefined;
import type { Grammar } from 'prismjs';
export {};
//# sourceMappingURL=core.d.ts.map