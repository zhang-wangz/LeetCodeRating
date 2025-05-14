Auto Config Loader
===

[![Buy me a coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-048754?logo=buymeacoffee)](https://jaywcjlove.github.io/#/sponsor)
[![CI](https://github.com/jaywcjlove/auto-config-loader/actions/workflows/main.yml/badge.svg)](https://github.com/jaywcjlove/auto-config-loader/actions/workflows/main.yml)
[![NPM version](https://img.shields.io/npm/v/auto-config-loader.svg?style=flat&label=npm)](https://npmjs.org/package/auto-config-loader)
[![Coverage Status](https://jaywcjlove.github.io/auto-config-loader/badges.svg)](https://jaywcjlove.github.io/auto-config-loader/lcov-report/)
[![npm Downloads](https://img.shields.io/npm/dm/auto-config-loader?style=flat)](https://www.npmjs.com/package/auto-config-loader)

Find and load configuration from a `package.json` property, `rc` file, or `CommonJS` module. It has smart default based on traditional expectations in the JavaScript ecosystem. But it's also flexible enough to search anywhere you want and load whatever you want.

[V1 To V2 Migration](#v1-to-v2-migration)

## Features

- Support [JSON](https://www.json.org), [JSONC](https://github.com/microsoft/node-jsonc-parser), [JSON5](https://json5.org/), [YAML](https://yaml.org/), [TOML](https://toml.io), [INI](https://en.wikipedia.org/wiki/INI_file), [CJS](http://www.commonjs.org), [Typescript](https://www.typescriptlang.org/), and ESM config load.
- Reads config from the nearest `package.json` file

## Install

```bash
$ npm i auto-config-loader
```

## Quick start

```js
const autoConf = require('auto-config-loader');

import { autoConf } from 'auto-config-loader';

// will look for:
// process.cwd() + '.namespacerc'
// process.cwd() + '.namespacerc.js'
// process.cwd() + '.namespacerc.ts'
// process.cwd() + '.namespacerc.mjs'
// process.cwd() + '.namespacerc.cjs'
// process.cwd() + '.namespacerc.json'
// process.cwd() + '.namespacerc.json5'
// process.cwd() + '.namespacerc.jsonc'
// process.cwd() + '.namespacerc.yaml'
// process.cwd() + '.namespacerc.yml'
// process.cwd() + '.namespacerc.toml'
// process.cwd() + 'namespace.config.mjs'
// process.cwd() + 'namespace.config.cjs'
// process.cwd() + 'namespace.config.js'
// ........
const data = await autoConf('namespace', {
  default: {
    testItem2: 'some value'
  }
});
```

## Load JS

Load the JS file and return the result, support `.js`, `.cjs`, `.mjs`, `.ts`.

```js
// => ./app/app.config.js
export default {
  name: 'app'
}
```

```ts
import { loadConf } from 'auto-config-loader/load-conf';

interface Config {
  name: string;
}

const result = await loadConf<Config>('./app/app.config.js');
// => { name: 'app' }
```

## Option

```ts
import { LoadConfOption } from 'auto-config-loader';
export type LoaderFunc<T> = (filepath: string, content: string, jsOption?: LoadConfOption) => T | Promise<T>;
export type Loader<T> = Record<string, LoaderFunc<T>>;
export interface AutoConfOption<T> {
  searchPlaces?: string[];
  /** An object that maps extensions to the loader functions responsible for loading and parsing files with those extensions. */
  loaders?: Loader<T>;
  /** Specify default configuration. It has the lowest priority and is applied after extending config. */
  default?: T;
  /** Resolve configuration from this working directory. The default is `process.cwd()` */
  cwd?: string;
  /** Default transform js configuration */
  jsOption?: LoadConfOption;
  /** @deprecated use `mustExist` instead */
  ignoreLog?: boolean;
  mustExist?: boolean;
}
export declare const getConfigPath: () => string;
/**
 * Find and load configuration from a `package.json` property, `rc` file, or `CommonJS` module.
 * @param namespace {string} Configuration base name. The default is `autoconf`.
 * @param option
 */
export declare function autoConf<T>(namespace?: string, option?: AutoConfOption<T>): Promise<{} & T>;
export default autoConf;
```

Discover configurations in the specified directory order. When configuring a tool, you can use multiple file formats and put these in multiple places. Usually, a tool would mention this in its own README file, but by default, these are the following places, where `${moduleName}` represents the name of the tool:

**Default `searchPlaces`:**

```js
[
  'package.json',
  `.${moduleName}rc`,
  `.${moduleName}rc.json`,
  `.${moduleName}rc.json5`,
  `.${moduleName}rc.jsonc`,
  `.${moduleName}rc.yaml`,
  `.${moduleName}rc.yml`,
  `.${moduleName}rc.toml`,
  `.${moduleName}rc.ini`,
  `.${moduleName}rc.js`,
  `.${moduleName}rc.ts`,
  `.${moduleName}rc.cjs`,
  `.${moduleName}rc.mjs`,
  `.config/${moduleName}rc`,
  `.config/${moduleName}rc.json`,
  `.config/${moduleName}rc.json5`,
  `.config/${moduleName}rc.jsonc`,
  `.config/${moduleName}rc.yaml`,
  `.config/${moduleName}rc.yml`,
  `.config/${moduleName}rc.toml`,
  `.config/${moduleName}rc.ini`,
  `.config/${moduleName}rc.js`,
  `.config/${moduleName}rc.ts`,
  `.config/${moduleName}rc.cjs`,
  `.config/${moduleName}rc.mjs`,
  `${moduleName}.config.js`,
  `${moduleName}.config.ts`,
  `${moduleName}.config.cjs`,
  `${moduleName}.config.mjs`,
]
```

Configurations are loaded sequentially, and the configuration file search is terminated when a configuration file exists.


The content of these files is defined by the tool. For example, you can add a `semi` configuration value to `false` using a file called `.config/autoconfig.yml`:

```yml
semi: true
```

Additionally, you have the option to put a property named after the tool in your `package.json` file, with the contents of that property being the same as the file contents. To use the same example as above:

```js
{
  "name": "your-project",
  "autoconfig": {
    "semi": true
  }
}
```

This has the advantage that you can put the configuration of all tools (at least the ones that use `auto-config-loader`) in one file.

## Loader

### `.js`,`.ts`,`.cjs`,`.mjs`

```ts
import type jiti from 'jiti';
import { Options } from 'sucrase';
type Jiti = ReturnType<typeof jiti>;
type JITIOptions = Jiti['options'];
export interface LoadConfOption {
    jiti?: boolean;
    jitiOptions?: JITIOptions;
    transformOption?: Options;
}
export declare function loadConf<T>(path: string, option?: LoadConfOption): Promise<T>;
export declare function jsLoader<T>(
  filepath: string,
  content: string,
  option?: LoadConfOption
): Promise<T>;
```

Modify default `.js`,`.ts`,`.cjs`,`.mjs` loader parameters.

```js
import load, { jsLoader } from 'auto-config-loader';

function loadJS(filepath, content) {
  return jsLoader(filepath, content, {
    // change option...
  });
}

const data = await load('namespace', {
  loaders: {
    '.js': loadJS,
    '.ts': loadJS,
    '.cjs': loadJS,
    '.mjs': loadJS,
  },
  default: {
    testItem2: 'some value'
  }
});
```

example:

```ts
import { jsLoader } from 'auto-config-loader';

const data = jsLoader('/path/to/file/name.js')
```

### `.ini`

```ts
export declare function iniLoader<T>(_: string, content: string): T;
```

example:

```ts
import { iniLoader } from 'auto-config-loader';

const data = iniLoader(undefined, `...`)
```

### `.json`,`.jsonc`, `json5`

```ts
export declare function jsonLoader<T>(_: string, content: string): T;
```

example:

```ts
import { jsonLoader } from 'auto-config-loader';

const data = jsonLoader(undefined, `{ "a": 123 }`)
```

### `.toml`

```ts
export declare function tomlLoader<T>(_: string, content: string): T;
```

example:

```ts
import { tomlLoader } from 'auto-config-loader';

const data = tomlLoader(undefined, `...`)
```

### `.yaml`

```ts
export declare function yamlLoader<T>(_: string, content: string): T;
```

example:

```ts
import { yamlLoader } from 'auto-config-loader';

const data = yamlLoader(undefined, `...`)
```

## Custom `Yaml` loader

This is an example, the default `yaml`/`yml` does not require a loader.

```js
import load from 'auto-config-loader';
import yaml from 'yaml';

function loadYaml(filepath, content) {
  return yaml.parse(content);
}

const data = await load('namespace', {
  searchPlaces: [
    '.namespacerc.yaml',
    '.namespacerc.yml',
  ],
  loaders: {
    '.yaml': loadYaml,
    '.yml': loadYaml,
  },
  default: {
    testItem2: 'some value'
  }
});
```

## Utils

### merge

```ts
export declare const merge: {
  <TObject, TSource>(object: TObject, source: TSource): TObject & TSource;
  <TObject, TSource1, TSource2>(object: TObject, source1: TSource1, source2: TSource2): TObject & TSource1 & TSource2;
  <TObject, TSource1, TSource2, TSource3>(object: TObject, source1: TSource1, source2: TSource2, source3: TSource3): TObject & TSource1 & TSource2 & TSource3;
  <TObject, TSource1, TSource2, TSource3, TSource4>(object: TObject, source1: TSource1, source2: TSource2, source3: TSource3, source4: TSource4): TObject & TSource1 & TSource2 & TSource3 & TSource4;
  (object: any, ...otherArgs: any[]): any;
};
```

### findConfigFile

```ts
export declare function findConfigFile(
  moduleName: string,
  root: string,
  searchPlaces?: string[]
): string;
```

### getConfigPath

```ts
export declare const getConfigPath: () => string;
```

Example:

```ts
import { autoConf, getConfigPath } from 'auto-config-loader';

const data = autoConf<Config>('idoc');
const configPath = getConfigPath();
// => /.autoconfrc.js
```

## V1 To V2 Migration

This guide provides the steps to migrate to the latest version of the configuration loader API.

### Key Changes

1. **Loader Functions Support Async**
    - `LoaderFunc<T>` now supports returning `T` or `Promise<T>`.
    - Update custom loaders to handle asynchronous operations if needed.

    **Example:**
    ```ts
    export type LoaderFunc<T> = (
      filepath: string,
      content: string,
      jsOption?: LoadConfOption
    ) => T | Promise<T>;
    ```

2. **`autoConf` Returns a Promise**
    - The `autoConf` function now returns a `Promise` instead of a synchronous result.
    - Update your code to handle asynchronous calls.

    **Example:**
    ```ts
    export declare function autoConf<T>(
      namespace?: string,
      option?: AutoConfOption<T>
    ): Promise<{} & T>;
    ```

### Migration Steps

#### 1. Update Custom Loader Functions

If you have custom loaders, update their return types to support asynchronous operations:

**Example:**

```ts
const jsonLoader: LoaderFunc<MyConfig> = async (
  filepath, content
) => JSON.parse(content);
```

#### 2. Handle Asynchronous `autoConf` Calls

Update all calls to `autoConf` to use `await` or `.then` to handle Promises:

**Example Using `await`:**
```ts
const config = await autoConf('myNamespace', options);
console.log(config);
```

**Example Using `.then`:**
```ts
autoConf('myNamespace', options).then(config => {
  console.log(config);
});
```

## Related

- [cosmiconfig](https://github.com/cosmiconfig/cosmiconfig) Find and load configuration from a package.json property, rc file, or CommonJS module
- [cjson](https://www.npmjs.com/package/cjson) Comments enabled json loader (Commented JavaScript Object Notation)
- [Config Loader](https://www.npmjs.com/package/@web/config-loader) Load user config files for node js projects.
- [Lilconfig](https://www.npmjs.com/package/lilconfig) Zero-dependency nodejs config seeker.
- [proload](https://github.com/natemoo-re/proload) Searches for and loads your tool's JavaScript configuration files with full support for CJS, ESM, TypeScript and more.
- [rc](https://github.com/dominictarr/rc) The non-configurable configuration loader for lazy people.

Library | Last commit | Download | loaders | config ext
:-- | --- | --- | --- | ---
**auto-config-loader** | [![GitHub last commit](https://img.shields.io/github/last-commit/jaywcjlove/auto-config-loader?style=flat&label=)](https://github.com/jaywcjlove/auto-config-loader/commits) | [![NPM Downloads](https://img.shields.io/npm/dm/auto-config-loader.svg?style=flat&label=)](https://www.npmjs.com/package/auto-config-loader) | ✅ | `.js`, `.ts`, `.cjs`, `.mjs`, `.json`, `.jsonc`, `json5`, `.ini`, `.toml`, `.yaml` ++
cosmiconfig | [![GitHub last commit](https://img.shields.io/github/last-commit/cosmiconfig/cosmiconfig?style=flat&label=)](https://github.com/cosmiconfig/cosmiconfig/commits) | [![NPM Downloads](https://img.shields.io/npm/dm/cosmiconfig.svg?style=flat&label=)](https://www.npmjs.com/package/cosmiconfig) | ✅ | `.json`, `.yaml`, `.yml`, `.js`, `.mjs`, `.cjs`
~~rc~~ | [![GitHub last commit](https://img.shields.io/github/last-commit/dominictarr/rc?style=flat&label=)](https://github.com/dominictarr/rc/commits) | [![NPM Downloads](https://img.shields.io/npm/dm/rc.svg?style=flat&label=)](https://www.npmjs.com/package/rc) | ✅ | `.json`, `.yaml`, `.yml`, `.js`, `.mjs`, `.cjs`
@proload/core | [![GitHub last commit](https://img.shields.io/github/last-commit/natemoo-re/proload?style=flat&label=)](https://github.com/natemoo-re/proload/commits) | [![NPM Downloads](https://img.shields.io/npm/dm/@proload/core.svg?style=flat&label=)](https://www.npmjs.com/package/@proload/core) | ✅ | `.js`, `.ts`, `.cjs`, `.mjs`, `.json`, `.jsonc`, `json5`, `.ini`, `.toml`, `.yaml` ++
lilconfig | [![GitHub last commit](https://img.shields.io/github/last-commit/antonk52/lilconfig?style=flat&label=)](https://github.com/antonk52/lilconfig/commits) | [![NPM Downloads](https://img.shields.io/npm/dm/lilconfig.svg?style=flat&label=)](https://www.npmjs.com/package/lilconfig) | ✅ | `.js`, `.cjs`, `.mjs`, `.json` ++
~~cjson~~ | [![GitHub last commit](https://img.shields.io/github/last-commit/kof/node-cjson?style=flat&label=)](https://github.com/kof/node-cjson/commits) | [![NPM Downloads](https://img.shields.io/npm/dm/cjson.svg?style=flat&label=)](https://www.npmjs.com/package/cjson) | ✅ | `.json`
@web/config-loader | [![GitHub last commit](https://img.shields.io/github/last-commit/modernweb-dev/web?style=flat&label=)](https://github.com/modernweb-dev/web/commits) | [![NPM Downloads](https://img.shields.io/npm/dm/@web/config-loader.svg?style=flat&label=)](https://www.npmjs.com/package/@web/config-loader) | ❌ | `.js`, `.mjs`, `.cjs`

## Contributors

As always, thanks to our amazing contributors!

<a href="https://github.com/jaywcjlove/auto-config-loader/graphs/contributors">
  <img src="https://jaywcjlove.github.io/auto-config-loader/CONTRIBUTORS.svg" />
</a>

Made with [contributors](https://github.com/jaywcjlove/github-action-contributors).


## License

This package is licensed under the MIT License.
