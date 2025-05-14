// @ts-nocheck
/**
 * @import {Syntax} from '../core.js'
 */
properties.displayName = 'properties'
properties.aliases = []

/** @type {Syntax} */
export default function properties(Prism) {
  Prism.languages.properties = {
    comment: /^[ \t]*[#!].*$/m,
    value: {
      pattern:
        /(^[ \t]*(?:\\(?:\r\n|[\s\S])|[^\\\s:=])+(?: *[=:] *(?! )| ))(?:\\(?:\r\n|[\s\S])|[^\\\r\n])+/m,
      lookbehind: true,
      alias: 'attr-value'
    },
    key: {
      pattern: /^[ \t]*(?:\\(?:\r\n|[\s\S])|[^\\\s:=])+(?= *[=:]| )/m,
      alias: 'attr-name'
    },
    punctuation: /[=:]/
  }
}
