/**
 * @import {Element, Root, Text} from 'hast'
 * @import {Grammar, Languages} from 'prismjs'
 */

/**
 * @typedef _Token
 *   Hidden Prism token.
 * @property {string} alias
 *   Alias.
 * @property {string} content
 *   Content.
 * @property {number} length
 *   Length.
 * @property {string} type
 *   Type.
 */

/**
 * @typedef _Env
 *   Hidden Prism environment.
 * @property {Record<string, string>} attributes
 *   Attributes.
 * @property {Array<string>} classes
 *   Classes.
 * @property {Array<RefractorElement | Text> | RefractorElement | Text} content
 *   Content.
 * @property {string} language
 *   Language.
 * @property {string} tag
 *   Tag.
 * @property {string} type
 *   Type.
 */

/**
 * @typedef {Omit<Element, 'children'> & {children: Array<RefractorElement | Text>}} RefractorElement
 *   Element; narrowed down to what’s used here.
 */

/**
 * @typedef {Omit<Root, 'children'> & {children: Array<RefractorElement | Text>}} RefractorRoot
 *   Root; narrowed down to what’s used here.
 */

/**
 * @typedef {((prism: Refractor) => undefined | void) & {aliases?: Array<string> | undefined, displayName: string}} Syntax
 *   Refractor syntax function.
 */

/**
 * @typedef Refractor
 *   Virtual syntax highlighting
 * @property {typeof alias} alias
 * @property {Languages} languages
 * @property {typeof listLanguages} listLanguages
 * @property {typeof highlight} highlight
 * @property {typeof registered} registered
 * @property {typeof register} register
 */

// Load all stuff in `prism.js` itself, except for `prism-file-highlight.js`.
// The wrapped non-leaky grammars are loaded instead of Prism’s originals.
import {h} from 'hastscript'
import {parseEntities} from 'parse-entities'
import {Prism} from './prism-core.js'

// To do: next major, use `Object.hasOwn`.
const own = {}.hasOwnProperty

// Inherit.
function Refractor() {}

Refractor.prototype = Prism

/** @type {Refractor} */
// @ts-expect-error: TS is wrong.
export const refractor = new Refractor()

// Create.
refractor.highlight = highlight
refractor.register = register
refractor.alias = alias
refractor.registered = registered
refractor.listLanguages = listLanguages

// @ts-expect-error Overwrite Prism.
refractor.util.encode = encode
// @ts-expect-error Overwrite Prism.
refractor.Token.stringify = stringify

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
function highlight(value, language) {
  if (typeof value !== 'string') {
    throw new TypeError('Expected `string` for `value`, got `' + value + '`')
  }

  /** @type {Grammar} */
  let grammar
  /** @type {string | undefined} */
  let name

  // `name` is a grammar object.
  // This was called internally by Prism.js before 1.28.0.
  /* c8 ignore next 2 */
  if (language && typeof language === 'object') {
    grammar = language
  } else {
    name = language

    if (typeof name !== 'string') {
      throw new TypeError('Expected `string` for `name`, got `' + name + '`')
    }

    if (own.call(refractor.languages, name)) {
      grammar = refractor.languages[name]
    } else {
      throw new Error('Unknown language: `' + name + '` is not registered')
    }
  }

  return {
    type: 'root',
    // @ts-expect-error: we hacked Prism to accept and return the things we want.
    children: Prism.highlight.call(refractor, value, grammar, name)
  }
}

/**
 * Register a syntax.
 *
 * @param {Syntax} syntax
 *   Language function made for refractor, as in, the files in
 *   `refractor/lang/*.js`.
 * @returns {undefined}
 *   Nothing.
 */
function register(syntax) {
  if (typeof syntax !== 'function' || !syntax.displayName) {
    throw new Error('Expected `function` for `syntax`, got `' + syntax + '`')
  }

  // Do not duplicate registrations.
  if (!own.call(refractor.languages, syntax.displayName)) {
    syntax(refractor)
  }
}

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
function alias(language, alias) {
  const languages = refractor.languages
  /** @type {Record<string, ReadonlyArray<string> | string>} */
  let map = {}

  if (typeof language === 'string') {
    if (alias) {
      map[language] = alias
    }
  } else {
    map = language
  }

  /** @type {string} */
  let key

  for (key in map) {
    if (own.call(map, key)) {
      const value = map[key]
      const list = typeof value === 'string' ? [value] : value
      let index = -1

      while (++index < list.length) {
        languages[list[index]] = languages[key]
      }
    }
  }
}

/**
 * Check whether an `alias` or `language` is registered.
 *
 * @param {string} aliasOrLanguage
 *   Language or alias to check.
 * @returns {boolean}
 *   Whether the language is registered.
 */
function registered(aliasOrLanguage) {
  if (typeof aliasOrLanguage !== 'string') {
    throw new TypeError(
      'Expected `string` for `aliasOrLanguage`, got `' + aliasOrLanguage + '`'
    )
  }

  return own.call(refractor.languages, aliasOrLanguage)
}

/**
 * List all registered languages (names and aliases).
 *
 * @returns {Array<string>}
 *   List of language names.
 */
function listLanguages() {
  const languages = refractor.languages
  /** @type {Array<string>} */
  const list = []
  /** @type {string} */
  let language

  for (language in languages) {
    if (
      own.call(languages, language) &&
      typeof languages[language] === 'object'
    ) {
      list.push(language)
    }
  }

  return list
}

/**
 * @param {Array<_Token | string> | _Token | string} value
 *   Token to stringify.
 * @param {string} language
 *   Language of the token.
 * @returns {Array<RefractorElement | Text> | RefractorElement | Text}
 *   Node representing the token.
 */
function stringify(value, language) {
  if (typeof value === 'string') {
    return {type: 'text', value}
  }

  if (Array.isArray(value)) {
    /** @type {Array<RefractorElement | Text>} */
    const result = []
    let index = -1

    while (++index < value.length) {
      if (
        value[index] !== null &&
        value[index] !== undefined &&
        value[index] !== ''
      ) {
        // @ts-expect-error Assume no sub-arrays.
        result.push(stringify(value[index], language))
      }
    }

    return result
  }

  /** @type {_Env} */
  const env = {
    attributes: {},
    classes: ['token', value.type],
    content: stringify(value.content, language),
    language,
    tag: 'span',
    type: value.type
  }

  if (value.alias) {
    env.classes.push(
      ...(typeof value.alias === 'string' ? [value.alias] : value.alias)
    )
  }

  // @ts-expect-error Prism.
  refractor.hooks.run('wrap', env)

  // @ts-expect-error Hush, it’s fine.
  return h(
    env.tag + '.' + env.classes.join('.'),
    attributes(env.attributes),
    env.content
  )
}

/**
 * @template {unknown} T
 *   Tokens.
 * @param {T} tokens
 *   Input.
 * @returns {T}
 *   Output, same as input.
 */
function encode(tokens) {
  return tokens
}

/**
 * @param {Record<string, string>} record
 *   Attributes.
 * @returns {Record<string, string>}
 *   Attributes.
 */
function attributes(record) {
  /** @type {string} */
  let key

  for (key in record) {
    if (own.call(record, key)) {
      record[key] = parseEntities(record[key])
    }
  }

  return record
}
