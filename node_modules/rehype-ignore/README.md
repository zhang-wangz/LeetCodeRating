rehype-ignore
===
<!--rehype:style=display: flex; height: 230px; align-items: center; justify-content: center; font-size: 38px;-->

[![Buy me a coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-048754?logo=buymeacoffee)](https://jaywcjlove.github.io/#/sponsor) 
[![Downloads](https://img.shields.io/npm/dm/rehype-ignore.svg?style=flat)](https://www.npmjs.com/package/rehype-ignore)
[![NPM version](https://img.shields.io/npm/v/rehype-ignore.svg?style=flat)](https://npmjs.org/package/rehype-ignore)
[![Build](https://github.com/jaywcjlove/rehype-ignore/actions/workflows/ci.yml/badge.svg)](https://github.com/jaywcjlove/rehype-ignore/actions/workflows/ci.yml)
[![Coverage Status](https://jaywcjlove.github.io/rehype-ignore/badges.svg)](https://jaywcjlove.github.io/rehype-ignore/lcov-report/)
[![Repo Dependents](https://badgen.net/github/dependents-repo/jaywcjlove/rehype-ignore)](https://github.com/jaywcjlove/rehype-ignore/network/dependents)

Ignore content display via HTML comments, Shown in GitHub readme, excluded in HTML.

## Installation

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c): Node 12+ is needed to use it and it must be `import` instead of `require`.

```bash
npm install rehype-ignore
```

## Options

```ts
export declare type RehypeIgnoreOptions = {
  /**
   *  Character to use for opening delimiter, by default `rehype:ignore:start`
   */
  openDelimiter?: string;
  /**
   * Character to use for closing delimiter, by default `rehype:ignore:end`
   */
  closeDelimiter?: string;
};
```

## Usage

```js
import { rehype } from 'rehype';
import rehypeIgnore from 'rehype-ignore';

rehype()
  .data('settings', { fragment: true })
  .use(rehypeIgnore, { })
```

### HTML Example

```html
<h1>header</h1>
<p>
  Hello <!--rehype:ignore:start--> <code>World</code> <!--rehype:ignore:end-->
</p>
```

Output:

```html
<h1>header</h1>
<p>
  Hello </p>
```

```js
import { rehype } from 'rehype';
import rehypeIgnore from 'rehype-ignore';

const html = `<h1>header</h1>
<p>
  Hello <!--rehype:ignore:start--> <code>World</code> <!--rehype:ignore:end-->
</p>`

const htmlStr = rehype()
  .data('settings', { fragment: true })
  .use(rehypeAttrs, { properties: 'attr' })
  .processSync(html)
  .toString()
```

### Markdown Example

```markdown
# Hello World

<!--rehype:ignore:start-->Hello World<!--rehype:ignore:end-->

Good!
```

Output:

```html
<h1>Hello World</h1>

<p>Good!</p>
```

```js
import { unified } from 'unified';
import rehypeIgnore from 'rehype-ignore';
import remarkParse from 'remark-parse';
import remark2rehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import stringify from 'rehype-stringify';

const html = `# Hello World

<!--rehype:ignore:start-->Hello World<!--rehype:ignore:end-->

Good!`

const htmlStr = unified()
  .use(remarkParse)
  .use(remark2rehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeIgnore, { })
  .use(stringify)
  .processSync(html)
  .toString()
```

## Related

- [`rehype-rewrite`](https://github.com/jaywcjlove/rehype-rewrite) Rewrite element with rehype.
- [`rehype-video`](https://github.com/jaywcjlove/rehype-video) Add improved video syntax: links to `.mp4` and `.mov` turn into videos.
- [`rehype-attr`](https://github.com/jaywcjlove/rehype-attr) New syntax to add attributes to Markdown.
- [`rehype-ignore`](https://github.com/jaywcjlove/rehype-ignore) Ignore content display via HTML comments, Shown in GitHub readme, excluded in HTML.
- [`rehypejs`](https://github.com/rehypejs/rehype) HTML processor powered by plugins part of the @unifiedjs collective
- [`remark-parse`](https://www.npmjs.com/package/remark-parse) remark plugin to parse Markdown
- [`remark-rehype`](https://www.npmjs.com/package/remark-rehype) remark plugin to transform to rehype
- [`rehype-raw`](https://www.npmjs.com/package/rehype-raw) rehype plugin to reparse the tree (and raw nodes)
- [`rehype-stringify`](https://www.npmjs.com/package/rehype-stringify) rehype plugin to serialize HTML

## Contributors

As always, thanks to our amazing contributors!

<a href="https://github.com/jaywcjlove/rehype-ignore/graphs/contributors">
  <img src="https://jaywcjlove.github.io/rehype-ignore/CONTRIBUTORS.svg" />
</a>

Made with [action-contributors](https://github.com/jaywcjlove/github-action-contributors).

## License

MIT © [Kenny Wong](https://github.com/jaywcjlove)
