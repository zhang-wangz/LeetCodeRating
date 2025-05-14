// @ts-nocheck
/**
 * @import {Syntax} from '../core.js'
 */
csv.displayName = 'csv'
csv.aliases = []

/** @type {Syntax} */
export default function csv(Prism) {
  // https://tools.ietf.org/html/rfc4180

  Prism.languages.csv = {
    value: /[^\r\n,"]+|"(?:[^"]|"")*"(?!")/,
    punctuation: /,/
  }
}
