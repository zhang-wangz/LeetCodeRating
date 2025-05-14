Convert Markdown to HTML.
===

[![Buy me a coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-048754?logo=buymeacoffee)](https://jaywcjlove.github.io/#/sponsor)
[![CI](https://github.com/jaywcjlove/markdown-to-html/actions/workflows/ci.yml/badge.svg)](https://github.com/jaywcjlove/markdown-to-html/actions/workflows/ci.yml)
[![jsDelivr CDN](https://data.jsdelivr.com/v1/package/npm/@wcj/markdown-to-html/badge?style=rounded)](https://www.jsdelivr.com/package/npm/@wcj/markdown-to-html)
[![npm version](https://img.shields.io/npm/v/@wcj/markdown-to-html.svg)](https://www.npmjs.com/package/@wcj/markdown-to-html)
[![Open in unpkg](https://img.shields.io/badge/Open%20in-unpkg-blue)](https://uiwjs.github.io/npm-unpkg/#/pkg/@wcj/markdown-to-html/file/README.md)

Converts markdown text to HTML.

## Installation

This package v2+ is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c): Node 12+ is needed to use it and it must be import instead of require.

```bash
$ npm i @wcj/markdown-to-html
```

## Usage

```js
import markdown, { getCodeString } from '@wcj/markdown-to-html';

markdown('# Markdown String')
// => <h1>Markdown String</h1>
```

Or manually download and link `markdown-to-html` in your HTML, It can also be downloaded via [UNPKG](https://unpkg.com/browse/@wcj/markdown-to-html/):

CDN: [UNPKG](https://unpkg.com/@wcj/markdown-to-html/dist/) | [jsDelivr](https://cdn.jsdelivr.net/npm/@wcj/markdown-to-html/) | [Githack](https://raw.githack.com/jaywcjlove/markdown-to-html/gh-pages/markdown.min.js) | [Statically](https://cdn.statically.io/gh/jaywcjlove/markdown-to-html/gh-pages/markdown.min.js)

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.15.0/dist/katex.min.css">
<link rel="stylesheet" href="https://unpkg.com/@wcj/markdown-to-html/dist/marked.css">

<script src="https://unpkg.com/@wcj/markdown-to-html/dist/markdown.min.js"></script>
<script type="text/javascript">
  ;(() => {
    const str = '# Markdown to HTML\n\nConverts markdown text to HTML.\n\n';
    const div = document.createElement('div');
    div.className = 'markdown-body';
    div.innerHTML = markdown.default(str)
    document.body.appendChild(div)
  })()
</script>
```

## Add Markdown Style

① Import the css file.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.15.0/dist/katex.min.css">
<link rel="stylesheet" href="https://unpkg.com/@wcj/markdown-to-html/dist/marked.css">
```

② Or use [`<markdown-style>`](https://jaywcjlove.github.io/markdown-style) components.

[![npm version](https://img.shields.io/npm/v/@wcj/markdown-style.svg)](https://www.npmjs.com/package/@wcj/markdown-style)
[![Github Source Code](https://shields.io/badge/style-%3Cmarkdown--style%3E-green?logo=github&label=github)](https://github.com/jaywcjlove/markdown-style)

```html
<script src="https://unpkg.com/@wcj/markdown-style"></script>
<markdown-style>
  <!-- markdown html is here -->
  <h1>Markdown HTML</h1>
</markdown-style>
```

## API

```ts
import { PluggableList } from 'unified';
import { Options as RemarkRehypeOptions } from 'remark-rehype';
import { RehypeRewriteOptions, getCodeString } from 'rehype-rewrite';
export { getCodeString };
export interface Options {
  /** [remark-rehype](https://github.com/remarkjs/remark-rehype) options */
  remarkRehypeOptions?: RemarkRehypeOptions;
  /** List of [remark plugins](https://github.com/remarkjs/remark/blob/main/doc/plugins.md#list-of-plugins) to use. See the next section for examples on how to pass options */
  remarkPlugins?: PluggableList;
  /** List of [rehype plugins](https://github.com/rehypejs/rehype/blob/main/doc/plugins.md#list-of-plugins) to use. See the next section for examples on how to pass options */
  rehypePlugins?: PluggableList;
  /** Used to filter default plugins */
  filterPlugins?: (type: 'remark' | 'rehype', plugins?: PluggableList) => PluggableList;
  /** Resulting Node tree. */
  hastNode?: boolean;
  /** Rewrite Element. [rehype-rewrite](https://github.com/jaywcjlove/rehype-rewrite#rewritenode-index-parent-void) */
  rewrite?: RehypeRewriteOptions['rewrite'];
  /** See KaTeX [options](https://katex.org/docs/options.html). */
  katexOptions?: KatexOptions;
}
export default function markdown(markdownStr?: string, options?: Options): string | import("hast").Root;
```

## Markdown Features

### Supports for CSS Style

Use HTML comments [`<!--rehype:xxx-->`](https://github.com/jaywcjlove/rehype-attr)<!--rehype:style=color: red;--> to let Markdown support style customization.

```markdown
## Title
<!--rehype:style=display: flex; height: 230px; align-items: center; justify-content: center; font-size: 38px;-->

Markdown Supports **Style**<!--rehype:style=color: red;-->
```

### Support for [GFM footnotes](https://github.blog/changelog/2021-09-30-footnotes-now-supported-in-markdown-fields/)

```markdown
Here is a simple footnote[^1]. With some additional text after it.

[^1]: My reference.
```

### Support for [KaTeX](https://github.com/Khan/KaTeX)

Support markdown syntax to render math. You can combine it with [KaTeX](https://github.com/Khan/KaTeX) in markdown, add <kbd>\`KaTeX:string\`</kbd> and <kbd>\`\`\`markdown</kbd> classes in markdown.

```markdown
\`KaTeX:c = \\pm\\sqrt{a^2 + b^2}\`
```

```markdown
\`\`\`KaTeX
c = \\pm\\sqrt{a^2 + b^2}

L = \\frac{1}{2} \\rho v^2 S C_L
\`\`\`
```

## Related

- [markdown-to-html-cli](https://github.com/jaywcjlove/markdown-to-html-cli) Converts markdown text to HTML, Provide command line tools and methods.

## Contributors

As always, thanks to our amazing contributors!

<a href="https://github.com/jaywcjlove/markdown-to-html/graphs/contributors">
  <img src="https://jaywcjlove.github.io/markdown-to-html/CONTRIBUTORS.svg" />
</a>

Made with [github-action-contributors](https://github.com/jaywcjlove/github-action-contributors).

## License

Licensed under the [MIT License](https://opensource.org/licenses/MIT).
