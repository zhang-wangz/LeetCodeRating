// @ts-nocheck
/**
 * @import {Syntax} from '../core.js'
 */
import refractorPhp from './php.js'
phpExtras.displayName = 'php-extras'
phpExtras.aliases = []

/** @type {Syntax} */
export default function phpExtras(Prism) {
  Prism.register(refractorPhp)
  Prism.languages.insertBefore('php', 'variable', {
    this: {
      pattern: /\$this\b/,
      alias: 'keyword'
    },
    global:
      /\$(?:GLOBALS|HTTP_RAW_POST_DATA|_(?:COOKIE|ENV|FILES|GET|POST|REQUEST|SERVER|SESSION)|argc|argv|http_response_header|php_errormsg)\b/,
    scope: {
      pattern: /\b[\w\\]+::/,
      inside: {
        keyword: /\b(?:parent|self|static)\b/,
        punctuation: /::|\\/
      }
    }
  })
}
