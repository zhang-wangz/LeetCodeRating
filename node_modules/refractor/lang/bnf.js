// @ts-nocheck
/**
 * @import {Syntax} from '../core.js'
 */
bnf.displayName = 'bnf'
bnf.aliases = ['rbnf']

/** @type {Syntax} */
export default function bnf(Prism) {
  Prism.languages.bnf = {
    string: {
      pattern: /"[^\r\n"]*"|'[^\r\n']*'/
    },
    definition: {
      pattern: /<[^<>\r\n\t]+>(?=\s*::=)/,
      alias: ['rule', 'keyword'],
      inside: {
        punctuation: /^<|>$/
      }
    },
    rule: {
      pattern: /<[^<>\r\n\t]+>/,
      inside: {
        punctuation: /^<|>$/
      }
    },
    operator: /::=|[|()[\]{}*+?]|\.{3}/
  }
  Prism.languages.rbnf = Prism.languages.bnf
}
