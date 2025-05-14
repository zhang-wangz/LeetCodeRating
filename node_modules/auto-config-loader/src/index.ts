import fs from 'fs';
import path from 'path';
import mergeFun from 'lodash.merge';
import { jsLoader, LoadConfOption } from './loader/js';
import { jsonLoader } from './loader/json';
import { yamlLoader } from './loader/yaml';
import { tomlLoader } from './loader/toml';
import { iniLoader } from './loader/ini';
import { findConfigFile } from './utils';

export * from './utils';
export * from './loader/js';
export * from './loader/json';
export * from './loader/yaml';
export * from './loader/toml';
export * from './loader/ini';

export const merge = mergeFun;

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

let configPath = '';

export const getConfigPath = () => configPath;

/**
 * Find and load configuration from a `package.json` property, `rc` file, or `CommonJS` module.
 * @param namespace {string} Configuration base name. The default is `autoconf`.
 * @param option
 */
export async function autoConf<T>(namespace: string = 'autoconf', option: AutoConfOption<T> = {}) {
  const {
    searchPlaces = [],
    default: defaultValue = {},
    cwd = process.cwd(),
    ignoreLog = false,
    mustExist = ignoreLog || false,
    jsOption,
  } = option;
  const loaders: Loader<T> = {
    '.yml': yamlLoader,
    '.yaml': yamlLoader,
    '.ini': iniLoader,
    '.toml': tomlLoader,
    '.json': jsonLoader,
    '.json5': jsonLoader,
    '.jsonc': jsonLoader,
    '.js': jsLoader,
    '.ts': jsLoader,
    '.cjs': jsLoader,
    '.mjs': jsLoader,
    ...(option.loaders || {}),
  };
  const pkgPath = path.resolve(cwd, 'package.json');
  configPath = findConfigFile(namespace, cwd, searchPlaces);
  let content = '';
  let resultData: T;
  let loaderFunc: LoaderFunc<T>;
  try {
    if (configPath) {
      const extname = path.extname(configPath);
      const basename = path.basename(configPath);
      if (new RegExp(`^(.?${namespace}rc)$`).test(basename)) {
        content = fs.readFileSync(configPath, 'utf-8');
        loaderFunc = loaders['.json'];
      } else if (loaders[extname]) {
        content = fs.readFileSync(configPath, 'utf-8');
        loaderFunc = loaders[extname];
      }
    } else if (fs.existsSync(pkgPath)) {
      content = fs.readFileSync(pkgPath, 'utf-8');
      const result = loaders['.json'](configPath, content);
      resultData = (result as Record<string, T>)[namespace];
    }

    if (content && loaderFunc) {
      resultData = await loaderFunc(configPath, content, jsOption);
      if (typeof resultData === 'function') {
        return merge(defaultValue, resultData, { default: resultData });
      }
    }
    if (!!mustExist && !configPath && !resultData) {
      return null;
    }
    if (resultData) {
      return merge(defaultValue, resultData);
    }
    console.log(`AUTO_CONF:ERROR: \x1b[31;1mCan't find config file\x1b[0m`);
  } catch (error) {
    console.log(`AUTO_CONF:CATCH:ERROR: \x1b[31;1m${error}\x1b[0m`);
  }
}

export default autoConf;
