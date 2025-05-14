// @ts-nocheck
/**
 * @import {Syntax} from '../core.js'
 */
gcode.displayName = 'gcode'
gcode.aliases = []

/** @type {Syntax} */
export default function gcode(Prism) {
  Prism.languages.gcode = {
    comment: /;.*|\B\(.*?\)\B/,
    string: {
      pattern: /"(?:""|[^"])*"/,
      greedy: true
    },
    keyword: /\b[GM]\d+(?:\.\d+)?\b/,
    property: /\b[A-Z]/,
    checksum: {
      pattern: /(\*)\d+/,
      lookbehind: true,
      alias: 'number'
    },
    // T0:0:0
    punctuation: /[:*]/
  }
}
