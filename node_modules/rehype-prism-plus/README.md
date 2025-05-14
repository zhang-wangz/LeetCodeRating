# rehype-prism-plus

![sample-code-block-output](sample-code-block.png)

[rehype] plugin to highlight code blocks in HTML with [Prism] (via [refractor]) with additional line highlighting and line numbers functionalities.

Inspired by and uses a compatible API as [@mapbox/rehype-prism](https://github.com/mapbox/rehype-prism) with additional support for line-highlighting, line numbers and diff code blocks.

Tested to work with [xdm] and mdx v2 libraries such as [mdx-bundler]. If you are using mdx v1 libraries such as [next-mdx-remote], you will need to patch it with the `fixMetaPlugin` discussed in this [issue](https://github.com/timlrx/rehype-prism-plus/issues/20), before `rehype-prism-plus`.

An [appropriate stylesheet](#styling) should be loaded to style the language tokens, format line numbers and highlight lines. You can specify language for diff code blocks by using diff-[language] to enable syntax highlighting in diffs.

## Installation

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c):
Node 12+ is needed to use it and it must be `import`ed instead of `require`d.

```
npm install rehype-prism-plus
```

## Usage

The following import paths are supported:

- `rehype-prism-plus/generator`, generator function. Can be used to generate a rehype prism plugin that works on your desired languages.
- `rehype-prism-plus/common`, [rehype plugin]. Supports the languages in `refractor/lib/common.js`.
- `rehype-prism-plus/all`, [rehype plugin]. Works with all [language supported by refractor].
- `rehype-prism-plus`, re-exports the above 3 packages with `rehype-prism-plus/all` as the default export.

Some examples of how you might use the rehype plugin:

```js
import rehype from 'rehype'
import rehypePrism from 'rehype-prism-plus'

rehype().use(rehypePrism).process(/* some html */)
```

Here's an example of syntax highlighting in Markdown, with [xdm]

```js
import { compile } from 'xdm'
import rehypePrism from 'rehype-prism-plus'

async function main(code) {
  console.log(String(await compile(code, { rehypePlugins: [rehypePrism] })))
}

main(`~~~js
console.log(1)
~~~`)
```

## Sample markdown to HTML output

Input:

````md
```js {1,3-4} showLineNumbers
function fancyAlert(arg) {
  if (arg) {
    $.facebox({ div: '#foo' })
  }
}
```
````

HTML Output:

```html
<code class="language-js">
  <div class="code-line line-number highlight-line" line="1">
    <span class="keyword">function</span>
    <span class="function">fancyAlert</span><span class="punctuation">(</span
    ><span class="">arg</span><span class="punctuation">)</span>
    <span class="punctuation">{</span>
  </div>
  <div class="code-line line-number highlight-line" line="2">
    <span class="keyword">if</span>
    <span class="punctuation">(</span>arg<span class="punctuation">)</span>
    <span class="punctuation">{</span>
  </div>
  <div class="code-line line-number" line="3">
    $<span class="punctuation">.</span><span class="function">facebox</span
    ><span class="punctuation">(</span><span class="punctuation">{</span> div<span class="">:</span>
    <span class="string">'#foo'</span>
    <span class="punctuation">}</span><span class="punctuation">)</span>
  </div>
  <div class="code-line line-number" line="4">
    <span class="punctuation">}</span>
  </div>
  <div class="code-line line-number" line="5">
    <span class="punctuation">}</span>
  </div></code
>
```

## Generating

To customise the languages for your own prism plugin:

```js
import { refractor } from 'refractor/lib/core.js'
import markdown from 'refractor/lang/markdown.js'
import rehypePrismGenerator from 'rehype-prism-plus/generator'

refractor.register(markdown)
const myPrismPlugin = rehypePrismGenerator(refractor)
```

## Styling

To style the language tokens, you can just copy them from any prismjs compatible ones. Here's a list of [themes](https://github.com/PrismJS/prism-themes).

In addition, the following styles should be added for line highlighting and line numbers to work correctly:

```css
pre {
  overflow-x: auto;
}

/**
 * Inspired by gatsby remark prism - https://www.gatsbyjs.com/plugins/gatsby-remark-prismjs/
 * 1. Make the element just wide enough to fit its content.
 * 2. Always fill the visible space in .code-highlight.
 */
.code-highlight {
  float: left; /* 1 */
  min-width: 100%; /* 2 */
}

.code-line {
  display: block;
  padding-left: 16px;
  padding-right: 16px;
  margin-left: -16px;
  margin-right: -16px;
  border-left: 4px solid rgba(0, 0, 0, 0); /* Set placeholder for highlight accent border color to transparent */
}

.code-line.inserted {
  background-color: rgba(16, 185, 129, 0.2); /* Set inserted line (+) color */
}

.code-line.deleted {
  background-color: rgba(239, 68, 68, 0.2); /* Set deleted line (-) color */
}

.highlight-line {
  margin-left: -16px;
  margin-right: -16px;
  background-color: rgba(55, 65, 81, 0.5); /* Set highlight bg color */
  border-left: 4px solid rgb(59, 130, 246); /* Set highlight accent border color */
}

.line-number::before {
  display: inline-block;
  width: 1rem;
  text-align: right;
  margin-right: 16px;
  margin-left: -8px;
  color: rgb(156, 163, 175); /* Line number color */
  content: attr(line);
}
```

Here's the styled output using the prism-night-owl theme:

![sample-code-block-output](sample-code-block.png)

For more information on styling of language tokens, consult [refractor] and [Prism].

## API

`rehype().use(rehypePrism, [options])`

Syntax highlights `pre > code`.
Under the hood, it uses [refractor], which is a virtual version of [Prism].

The code language is configured by setting a `language-{name}` class on the `<code>` element.
You can use any [language supported by refractor].

If no `language-{name}` class is found on a `<code>` element, it will be skipped.

### options

#### options.ignoreMissing

Type: `boolean`.
Default: `false`.

By default, if `{name}` does not correspond to a [language supported by refractor] an error will be thrown.

If you would like to silently skip `<code>` elements with invalid languages or support line numbers and line highlighting for code blocks without a specified language, set this option to `true`.

#### options.defaultLanguage

Type: `string`.
Default: ``.

Uses the specified language as the default if none is specified. Takes precedence over `ignoreMissing`.

Note: The language must be first registered with [refractor].

#### options.showLineNumbers

Type: `boolean`.
Default: `false`.

By default, line numbers will only be displayed for code block cells with a meta property that includes 'showLineNumbers'. To control the starting line number use `showLineNumbers=X`, where `X` is the starting line number as a meta property for the code block.

If you would like to show line numbers for all code blocks, without specifying the meta property, set this to `true`.

**Note**: This will wrongly assign a language class and the class might appear as `language-{1,3}` or `language-showLineNumbers`, but allow the language highlighting and line number function to work. An possible approach would be to add a placeholder like `unknown` so the `div` will have `class="language-unknown"`

[rehype]: https://github.com/wooorm/rehype
[prism]: http://prismjs.com/
[refractor]: https://github.com/wooorm/refractor
[rehype plugin]: https://github.com/rehypejs/rehype/blob/master/doc/plugins.md#using-plugins
[xdm]: https://github.com/wooorm/xdm
[mdx-bundler]: https://github.com/kentcdodds/mdx-bundler
[next-mdx-remote]: https://github.com/hashicorp/next-mdx-remote
[language supported by refractor]: https://github.com/wooorm/refractor#syntaxes
