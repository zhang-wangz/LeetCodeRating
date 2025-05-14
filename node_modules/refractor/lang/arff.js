// @ts-nocheck
/**
 * @import {Syntax} from '../core.js'
 */
arff.displayName = 'arff'
arff.aliases = []

/** @type {Syntax} */
export default function arff(Prism) {
  Prism.languages.arff = {
    comment: /%.*/,
    string: {
      pattern: /(["'])(?:\\.|(?!\1)[^\\\r\n])*\1/,
      greedy: true
    },
    keyword: /@(?:attribute|data|end|relation)\b/i,
    number: /\b\d+(?:\.\d+)?\b/,
    punctuation: /[{},]/
  }
}
