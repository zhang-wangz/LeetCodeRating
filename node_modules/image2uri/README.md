Image To URI
===

[![Buy me a coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-048754?logo=buymeacoffee)](https://jaywcjlove.github.io/#/sponsor)
[![NPM Downloads](https://img.shields.io/npm/dm/image2uri.svg?style=flat)](https://www.npmjs.com/package/image2uri)
[![Build & Test](https://github.com/jaywcjlove/image2uri/actions/workflows/ci.yml/badge.svg)](https://github.com/jaywcjlove/image2uri/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/image2uri.svg)](https://www.npmjs.com/package/image2uri)
[![Coverage Status](https://jaywcjlove.github.io/image2uri/badges.svg)](https://jaywcjlove.github.io/image2uri/lcov-report/)

Convert image file to data URI. Support `.png`,`.gif`,`.jpg`,`.jpeg`,`.bm`,`.bmp`,`.webp`,`.ico`,`.svg`.

### Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c): Node 12+ is needed to use it and it must be import instead of require.

```bash
npm i image2uri
```

```js
const recursiveReaddirFiles = await import('image2uri');

// Fix compiling in typescript.
// https://github.com/microsoft/TypeScript/issues/43329#issuecomment-922544562
const { getExt, recursiveReaddirFiles } = await (Function('return import("image2uri")')()) as Promise<typeof import("image2uri")>;
```

### Basic Usage

```js
import image2uri from "image2uri";

console.log(image2uri('./example.bmp'));
// data:image/bmp;base64,Qk0YCAAAAAAAADYAAAAoAAAAGAAAABwAAAABABgAAAAAAOIHAAA....
console.log(image2uri('./example.jpg'));
// data:image/jpeg;base64,Qk0YCAAAAAAAADYAAAAoAAAAGAAAABwAAAABABgAAAAAAOIHAAA....

const uri = await image2uri('https://avatars.githubusercontent.com/u/1680273?v=4', { ext: '.apng' });
// data:image/apng;base64,/9j/2wCEAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDc
const avatar = await image2uri('https://avatars.githubusercontent.com/u/1680273?v=4');
// /9j/2wCEAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDc
```

### API

```ts
export declare const validUrl: (url: string) => boolean;
export declare const extTypeMap: {
    '.png': string;
    '.apng': string;
    '.gif': string;
    '.jpg': string;
    '.jpeg': string;
    '.bm': string;
    '.bmp': string;
    '.webp': string;
    '.ico': string;
    '.svg': string;
};
export type ExtType = keyof typeof extTypeMap;
export default function image2uri(file: string, options?: {
    ext?: string;
}): string | Promise<string>;
```

### Development

```bash
npm run watch # Listen compile .ts files.
npm run build # compile .ts files.

npm run start
```

### Related

- [recursive-readdir-files](https://github.com/jaywcjlove/recursive-readdir-files) Node.js module to list all files in a directory or any subdirectories.

## Contributors

As always, thanks to our amazing contributors!

<a href="https://github.com/jaywcjlove/image2uri/graphs/contributors">
  <img src="https://jaywcjlove.github.io/image2uri/CONTRIBUTORS.svg" />
</a>

Made with [action-contributors](https://github.com/jaywcjlove/github-action-contributors).

### License

Licensed under the MIT License.
