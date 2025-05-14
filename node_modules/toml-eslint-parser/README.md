# toml-eslint-parser

A TOML parser that produces output [compatible with ESLint](https://eslint.org/docs/developer-guide/working-with-custom-parsers#all-nodes).

[![NPM license](https://img.shields.io/npm/l/toml-eslint-parser.svg)](https://www.npmjs.com/package/toml-eslint-parser)
[![NPM version](https://img.shields.io/npm/v/toml-eslint-parser.svg)](https://www.npmjs.com/package/toml-eslint-parser)
[![NPM downloads](https://img.shields.io/badge/dynamic/json.svg?label=downloads&colorB=green&suffix=/day&query=$.downloads&uri=https://api.npmjs.org//downloads/point/last-day/toml-eslint-parser&maxAge=3600)](http://www.npmtrends.com/toml-eslint-parser)
[![NPM downloads](https://img.shields.io/npm/dw/toml-eslint-parser.svg)](http://www.npmtrends.com/toml-eslint-parser)
[![NPM downloads](https://img.shields.io/npm/dm/toml-eslint-parser.svg)](http://www.npmtrends.com/toml-eslint-parser)
[![NPM downloads](https://img.shields.io/npm/dy/toml-eslint-parser.svg)](http://www.npmtrends.com/toml-eslint-parser)
[![NPM downloads](https://img.shields.io/npm/dt/toml-eslint-parser.svg)](http://www.npmtrends.com/toml-eslint-parser)
[![Build Status](https://github.com/ota-meshi/toml-eslint-parser/workflows/CI/badge.svg?branch=main)](https://github.com/ota-meshi/toml-eslint-parser/actions?query=workflow%3ACI)

## Features

- Converts TOML text to [AST](./docs/AST.md).
- Support for [TOML 1.0.0](https://toml.io/en/v1.0.0).
- Experimental support for TOML 1.1.0. (Specifications for November 2023)

## Installation

```bash
npm install --save-dev toml-eslint-parser
```

## Usage

### Configuration

Use `.eslintrc.*` file to configure parser. See also: [https://eslint.org/docs/user-guide/configuring](https://eslint.org/docs/user-guide/configuring).

Example **.eslintrc.js**:

```js
module.exports = {
  overrides: [
    {
      files: ["*.toml"],
      parser: "toml-eslint-parser",
    },
  ],
};
```

### Advanced Configuration

The following additional configuration options are available by specifying them in [parserOptions](https://eslint.org/docs/latest/user-guide/configuring/language-options#specifying-parser-options) in your ESLint configuration file.

Example **.eslintrc.js**:

```js
module.exports = {
  overrides: [
    {
      files: ["*.toml"],
      parser: "toml-eslint-parser",
      // Additional configuration options
      parserOptions: {
        tomlVersion: "1.0.0",
      },
    },
  ],
};
```

#### `parserOptions.tomlVersion`

Select the TOML version by setting `"1.0.0"`, `"1.1.0"`, `"1.0"`, `"1.1"`, `"latest"`, or `"next"`. By default `"1.0.0"` is used.

- `"1.0.0"` ... Parsed using [TOML v1.0.0 specifications](https://toml.io/en/v1.0.0).
- `"1.0"` ... Alias for `"1.0.0"`.
- `"1.1.0"` ... Parsed using the TOML v1.1.0 specification, which is currently [under development](https://github.com/toml-lang/toml/issues/928). TOML 1.1.0 has not been released yet, so `"1.1.0"` is still an experimental feature. Please note that this may be subject to breaking changes in minor version releases of this parser.
- `"1.1"` ... Alias for `"1.1.0"`.
- `"latest"` ... Currently an alias for `"1.0.0"`. When a new version of TOML is released, we plan to change to that version in a minor version release of this parser.
- `"next"` ... Currently an alias for `"1.1.0"`.

## Usage for Custom Rules / Plugins

- [AST.md](./docs/AST.md) is AST specification.
- [keys-order.ts](https://github.com/ota-meshi/eslint-plugin-toml/blob/main/src/rules/keys-order.ts) is an example.
- You can see the AST on the [Online DEMO](https://ota-meshi.github.io/toml-eslint-parser/).

## Usage for Directly

Example:

```ts
import type { AST } from "toml-eslint-parser";
import { parseTOML, getStaticTOMLValue } from "toml-eslint-parser";

const code = `
# This is a TOML document

title = "TOML Example"

[owner]
name = "Tom Preston-Werner"
dob = 1979-05-27T07:32:00-08:00

[database]
enabled = true
ports = [ 8001, 8001, 8002 ]
data = [ ["delta", "phi"], [3.14] ]
temp_targets = { cpu = 79.5, case = 72.0 }

[servers]

[servers.alpha]
ip = "10.0.0.1"
role = "frontend"

[servers.beta]
ip = "10.0.0.2"
role = "backend"
`;

const ast: AST.TOMLProgram = parseTOML(code);
console.log(ast);
// {
//   type: 'Program',
//   body: [
//     {
//       type: 'TOMLTopLevelTable',
//       body: [
//         {
//           type: 'TOMLKeyValue',
//           key: { /* ... */ },
//           value: { /* ... */ },
//           /* ... */
//         },
//         {
//           type: 'TOMLTable',
//           kind: 'standard',
//           key: { /* ... */ },
//           body: [ /* ... */ ],
//           /* ... */
//         },
//         /* ... */
//       ]
//       /* ... */
//     }
//   ],
//   tokens: [ /* ... */ ],
//   comments: [
//     {
//       type: 'Block',
//       value: ' This is a TOML document',
//       // ...
//     }
//   ],
// }

const value = getStaticTOMLValue(ast);
console.log(value);
// {
//   title: 'TOML Example',
//   owner: { name: 'Tom Preston-Werner', dob: 1979-05-27T15:32:00.000Z },
//   database: {
//     enabled: true,
//     ports: [ 8001, 8001, 8002 ],
//     data: [ [ /* ... */ ], [ /* ... */ ] ],
//     temp_targets: { cpu: 79.5, case: 72 }
//   },
//   servers: {
//     alpha: { ip: '10.0.0.1', role: 'frontend' },
//     beta: { ip: '10.0.0.2', role: 'backend' }
//   }
// }
```

## Testing

This project uses files from [BurntSushi/toml-test](https://github.com/BurntSushi/toml-test) and [iarna/toml-spec-tests](https://github.com/iarna/toml-spec-tests) repositories for testing.

## Related Packages

- [eslint-plugin-jsonc](https://github.com/ota-meshi/eslint-plugin-jsonc) ... ESLint plugin for JSON, JSON with comments (JSONC) and JSON5.
- [eslint-plugin-yml](https://github.com/ota-meshi/eslint-plugin-yml) ... ESLint plugin for YAML.
- [eslint-plugin-toml](https://github.com/ota-meshi/eslint-plugin-toml) ... ESLint plugin for TOML.
- [eslint-plugin-json-schema-validator](https://github.com/ota-meshi/eslint-plugin-json-schema-validator) ... ESLint plugin that validates data using JSON Schema Validator.
- [jsonc-eslint-parser](https://github.com/ota-meshi/jsonc-eslint-parser) ... JSON, JSONC and JSON5 parser for use with ESLint plugins.
- [yaml-eslint-parser](https://github.com/ota-meshi/yaml-eslint-parser) ... YAML parser for use with ESLint plugins.
