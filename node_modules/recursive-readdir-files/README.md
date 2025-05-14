recursive-readdir-files
===
<!--rehype:style=display: flex; padding: 150px 0 0 0; align-items: center; justify-content: center; font-size: 38px; border: 0; border-radius: 5px;-->

[![Buy me a coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-048754?logo=buymeacoffee)](https://jaywcjlove.github.io/#/sponsor) 
[![Coverage Status](https://jaywcjlove.github.io/recursive-readdir-files/badges.svg)](https://jaywcjlove.github.io/recursive-readdir-files/lcov-report/)
[![npm version](https://img.shields.io/npm/v/recursive-readdir-files.svg)](https://www.npmjs.com/package/recursive-readdir-files)
[![NPM Download](https://img.shields.io/npm/dm/recursive-readdir-files.svg?style=flat)](https://www.npmjs.com/package/recursive-readdir-files)
<!--rehype:style=text-align: center;-->

Node.js module to list all files in a directory or any subdirectories.

## Installation

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c): Node 12+ is needed to use it and it must be `import` instead of `require`.

```bash
npm install recursive-readdir-files
```

If you still want to use in CommonJS, you can use dynamic `import()` to load.

```typescript
const recursiveReaddirFiles = await import('recursive-readdir-files');

// Fix compiling in typescript.
// https://github.com/microsoft/TypeScript/issues/43329#issuecomment-922544562
const { getExt, recursiveReaddirFiles } = await (Function('return import("recursive-readdir-files")')()) as Promise<typeof import("recursive-readdir-files")>;
```

## Usage

```js
import recursiveReaddirFiles from 'recursive-readdir-files';

const files = await recursiveReaddirFiles(process.cwd(), {
  ignored: /\/(node_modules|\.git)/
});

// `files` is an array
console.log(files);
// ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
// [
//   {
//     dev: 16777233,
//     mode: 33188,
//     nlink: 1,
//     uid: 501,
//     gid: 20,
//     rdev: 0,
//     blksize: 4096,
//     ino: 145023089,
//     size: 89,
//     blocks: 8,
//     atimeMs: 1649303678077.934,
//     mtimeMs: 1649303676847.1777,
//     ctimeMs: 1649303676847.1777,
//     birthtimeMs: 1649301118132.6782,
//     atime: 2022-04-07T03:54:38.078Z,
//     mtime: 2022-04-07T03:54:36.847Z,
//     ctime: 2022-04-07T03:54:36.847Z,
//     birthtime: 2022-04-07T03:11:58.133Z,
//     name: 'watch.ts',
//     path: '/Users/xxx/watch.ts',
//     ext: 'ts'
//   },
//   // ...
// ]
```

Or

```js
recursiveReaddirFiles(process.cwd(), {
  ignored: /\/(node_modules|\.git)/
}, (filepath, state) => {
  console.log(filepath);
  // 👉 /Users/xxx/watch.ts
  console.log(state.isFile());      // 👉 true
  console.log(state.isDirectory()); // 👉 false
  console.log(state);
  // ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
  // {
  //   dev: 16777233,
  //   mode: 33188,
  //   nlink: 1,
  //   uid: 501,
  //   gid: 20,
  //   rdev: 0,
  //   blksize: 4096,
  //   ino: 145023089,
  //   size: 89,
  //   blocks: 8,
  //   atimeMs: 1649303678077.934,
  //   mtimeMs: 1649303676847.1777,
  //   ctimeMs: 1649303676847.1777,
  //   birthtimeMs: 1649301118132.6782,
  //   atime: 2022-04-07T03:54:38.078Z,
  //   mtime: 2022-04-07T03:54:36.847Z,
  //   ctime: 2022-04-07T03:54:36.847Z,
  //   birthtime: 2022-04-07T03:11:58.133Z,
  //   name: 'watch.ts',
  //   path: '/Users/xxx/watch.ts',
  //   ext: 'ts'
  // }
})
```

## Options

```ts
export interface RecursiveReaddirFilesOptions {
  /**
   * Ignore files
   * @example `/\/(node_modules|\.git)/`
   */
  ignored?: RegExp;
  /**
   * Specifies a list of `glob` patterns that match files to be included in compilation.
   * @example `/(\.json)$/`
   */
  include?: RegExp;
  /**
   * Specifies a list of files to be excluded from compilation.
   * @example `/(package\.json)$/`
   */
  exclude?: RegExp;
  /** Provide filtering methods to filter data. */
  filter?: (item: IFileDirStat) => boolean;
}
```

## Result

```ts
import fs from 'node:fs';
export interface IFileDirStat extends Partial<fs.Stats> {
  /**
   * @example `/a/sum.jpg` => `sum.jpg`
   */
  name: string;
  /**
   * @example `/basic/src/utils/sum.ts`
   */
  path: string;
  /**
   * @example `/a/b.jpg` => `jpg`
   */
  ext?: string;
}
declare type Callback = (filepath: string, stat: IFileDirStat) => void;
export default function recursiveReaddirFiles(rootPath: string, options?: RecursiveReaddirFilesOptions, callback?: Callback): Promise<IFileDirStat[]>;
export { recursiveReaddirFiles };
export declare const getStat: (filepath: string) => Promise<IFileDirStat>;
/**
 * Get ext
 * @param {String} filePath `/a/b.jpg` => `jpg`
 */
export declare const getExt: (filePath: string) => string;
```

## Contributors

As always, thanks to our amazing contributors!

<a href="https://github.com/jaywcjlove/recursive-readdir-files/graphs/contributors">
  <img src="https://jaywcjlove.github.io/recursive-readdir-files/CONTRIBUTORS.svg" />
</a>

Made with [action-contributors](https://github.com/jaywcjlove/github-action-contributors).

## License

Licensed under the MIT License.
