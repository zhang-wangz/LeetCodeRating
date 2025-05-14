rehype-video
===

[![Buy me a coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-048754?logo=buymeacoffee)](https://jaywcjlove.github.io/#/sponsor) 
[![Downloads](https://img.shields.io/npm/dm/rehype-video.svg?style=flat)](https://www.npmjs.com/package/rehype-video)
[![NPM version](https://img.shields.io/npm/v/rehype-video.svg?style=flat)](https://npmjs.org/package/rehype-video)
[![Build](https://github.com/jaywcjlove/rehype-video/actions/workflows/ci.yml/badge.svg)](https://github.com/jaywcjlove/rehype-video/actions/workflows/ci.yml)
[![Coverage Status](https://jaywcjlove.github.io/rehype-video/badges.svg)](https://jaywcjlove.github.io/rehype-video/lcov-report/)
[![Repo Dependents](https://badgen.net/github/dependents-repo/jaywcjlove/rehype-video)](https://github.com/jaywcjlove/rehype-video/network/dependents)

Add improved video syntax: links to `.mp4` and `.mov` turn into videos. like [`github video`](https://github.blog/2021-05-13-video-uploads-available-github/) features.

The following is a sample test of the video preview in GitHub:

https://user-images.githubusercontent.com/1680273/138299599-88547edd-859c-44c9-8b52-2cc06f7f2dd3.mov?!#title=Example%20Display

## Installation

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c): Node 12+ is needed to use it and it must be import instead of require.

```bash
npm install rehype-video
```

## Usage

```js
import { unified } from 'unified';
import remark2rehype from 'remark-rehype';
import remarkParse from 'remark-parse';
import rehypeVideo from 'rehype-video';
import stringify from 'rehype-stringify';

const string = `
https://files.github.com/001.mp4 hi!

https://files.github.com/002.mp4

Good \`idea\`!!

https://github.com/002.mp4?!#title=Custom%20Title
`;

const htmlStr = unified()
  .use(remarkParse)
  .use(remark2rehype, { allowDangerousHtml: true })
  .use(rehypeVideo)
  .use(stringify)
  .processSync(string)
  .toString();
```

Output:

```html
<p>https://files.github.com/001.mp4 hi!</p>
<details open>
  <summary>
    <svg aria-hidden height="16" width="16" viewBox="0 0 16 16" version="1.1" class="octicon octicon-device-camera-video"><path fill-rule="evenodd" d="M16 3.75a.75.75 0 00-1.136-.643L11 5.425V4.75A1.75 1.75 0 009.25 3h-7.5A1.75 1.75 0 000 4.75v6.5C0 12.216.784 13 1.75 13h7.5A1.75 1.75 0 0011 11.25v-.675l3.864 2.318A.75.75 0 0016 12.25v-8.5zm-5 5.075l3.5 2.1v-5.85l-3.5 2.1v1.65zM9.5 6.75v-2a.25.25 0 00-.25-.25h-7.5a.25.25 0 00-.25.25v6.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-4.5z"></path></svg>
    <span aria-label="Video description 002.mp4">002.mp4</span>
    <span class="dropdown-caret"></span>
  </summary>
  <video muted controls style="max-height:640px;" src="https://github.com/002.mp4"></video>
</details>
<p>Good <code>idea</code>!!</p>
<details open>
  <summary>
    <svg aria-hidden height="16" width="16" viewBox="0 0 16 16" version="1.1" class="octicon octicon-device-camera-video"><path fill-rule="evenodd" d="M16 3.75a.75.75 0 00-1.136-.643L11 5.425V4.75A1.75 1.75 0 009.25 3h-7.5A1.75 1.75 0 000 4.75v6.5C0 12.216.784 13 1.75 13h7.5A1.75 1.75 0 0011 11.25v-.675l3.864 2.318A.75.75 0 0016 12.25v-8.5zm-5 5.075l3.5 2.1v-5.85l-3.5 2.1v1.65zM9.5 6.75v-2a.25.25 0 00-.25-.25h-7.5a.25.25 0 00-.25.25v6.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-4.5z"></path></svg>
    <span aria-label="Video description Custom Title">Custom Title</span>
    <span class="dropdown-caret"></span>
  </summary>
  <video muted controls style="max-height:640px;" src="https://github.com/002.mp4"></video>
</details>
```

### Example 1

```js
import { rehype } from 'rehype';
import rehypeVideo from 'rehype-video';

const mrkStr = `<p>https://github.com/004.mp4</p>`;
const htmlStr = rehype()
  .data('settings', { fragment: true })
  .use(rehypeVideo, { details: false })
  .processSync(mrkStr)
  .toString();
```

Output:

```html
<video muted controls style="max-height:640px;" src="https://github.com/004.mp4"></video>
```

### Example 2

```js
import { rehype } from 'rehype';
import rehypeVideo from 'rehype-video';

const mrkStr = `<p><a href="https://github.com/004.mp4">https://github.com/004.mp4</a></p`;
const htmlStr = rehype()
  .data('settings', { fragment: true })
  .use(rehypeVideo, { details: false })
  .processSync(mrkStr)
  .toString();
```

Output:

```html
<video muted controls style="max-height:640px;" src="https://github.com/004.mp4"></video>
```

## Custom Title

Define custom title parameter(E.g: `title=RehypeVideo`) with hash route:

```js
const string = `https://github.com/002.mp4?!#title=Custom%20Title`;
const htmlStr = unified()
  .use(remarkParse)
  .use(remark2rehype, { allowDangerousHtml: true })
  .use(rehypeVideo)
  .use(stringify)
  .processSync(string)
  .toString();
```

Output:

```html
<details open>
  <summary>
    <svg aria-hidden height="16" width="16" viewBox="0 0 16 16" version="1.1" class="octicon octicon-device-camera-video"><path fill-rule="evenodd" d="M16 3.75a.75.75 0 00-1.136-.643L11 5.425V4.75A1.75 1.75 0 009.25 3h-7.5A1.75 1.75 0 000 4.75v6.5C0 12.216.784 13 1.75 13h7.5A1.75 1.75 0 0011 11.25v-.675l3.864 2.318A.75.75 0 0016 12.25v-8.5zm-5 5.075l3.5 2.1v-5.85l-3.5 2.1v1.65zM9.5 6.75v-2a.25.25 0 00-.25-.25h-7.5a.25.25 0 00-.25.25v6.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-4.5z"></path></svg>
    <span aria-label="Video description Custom Title">Custom Title</span>
    <span class="dropdown-caret"></span>
  </summary>
  <video muted controls style="max-height:640px;" src="https://github.com/002.mp4"></video>
</details>
```

## \<track>

We will reference all two of the relevant VTT files by adding [\<track>](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/track) elements inside our HTML [\<video>](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) element:

```js
const mrkStr = `https://github.com/sintel-short.mp4?!#track['en']=captions/vtt/sintel-en.vtt&track['en:label']=English&track['en:kind']=subtitles&track['en:default']=true&track['de']=captions/vtt/sintel-de.vtt&track['de:label']=Deutsch&track['de:kind']=subtitles`;
const htmlStr = unified()
  .use(remarkParse)
  .use(remark2rehype, { allowDangerousHtml: true })
  .use(rehypeVideo, { })
  .use(stringify)
  .processSync(mrkStr)
  .toString();
```

Output:

```html
<details open class="octicon octicon-video">
  <summary>
    <svg aria-hidden height="16" width="16" viewBox="0 0 16 16" version="1.1" data-view-component class="octicon octicon-device-camera-video">
      <path fill-rule="evenodd" d="M16 3.75a.75.75 0 00-1.136-.643L11 5.425V4.75A1.75 1.75 0 009.25 3h-7.5A1.75 1.75 0 000 4.75v6.5C0 12.216.784 13 1.75 13h7.5A1.75 1.75 0 0011 11.25v-.675l3.864 2.318A.75.75 0 0016 12.25v-8.5zm-5 5.075l3.5 2.1v-5.85l-3.5 2.1v1.65zM9.5 6.75v-2a.25.25 0 00-.25-.25h-7.5a.25.25 0 00-.25.25v6.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-4.5z"></path>
    </svg>
    <span aria-label="Video description sintel-short.mp4">sintel-short.mp4</span>
    <span class="dropdown-caret"></span>
  </summary>
  <video muted controls style="max-height:640px;" src="https://github.com/sintel-short.mp4?!#track[&#x27;en&#x27;]=captions/vtt/sintel-en.vtt&#x26;track[&#x27;en:label&#x27;]=English&#x26;track[&#x27;en:kind&#x27;]=subtitles&#x26;track[&#x27;en:default&#x27;]=true&#x26;track[&#x27;de&#x27;]=captions/vtt/sintel-de.vtt&#x26;track[&#x27;de:label&#x27;]=Deutsch&#x26;track[&#x27;de:kind&#x27;]=subtitles">
    <track kind="subtitles" src="captions/vtt/sintel-en.vtt" label="English" default>
    <track kind="subtitles" src="captions/vtt/sintel-de.vtt" label="Deutsch">
  </video>
</details>
```

## Options

```ts
export declare type RehypeVideoOptions = {
  /**
   * URL suffix verification.
   * @default /\/(.*)(.mp4|.mov)$/
   */
  test?: RegExp;
  /**
   * Support `<details>` tag to wrap <video>.
   * @default true
   */
  details?: boolean;
  /**
   * Support `<track>` tag to wrap <video>.
   * @default true
   */
  track?: boolean;
};
```

## Related

- [`rehype-attr`](https://github.com/jaywcjlove/rehype-attr) New syntax to add attributes to Markdown.
- [`rehype-rewrite`](https://github.com/jaywcjlove/rehype-rewrite) Rewrite element with rehype.
- [`rehype-ignore`](https://github.com/jaywcjlove/rehype-ignore) Ignore content display via HTML comments, Shown in GitHub readme, excluded in HTML.
- [`remark-github-blockquote-alert`](https://github.com/jaywcjlove/remark-github-blockquote-alert) Remark plugin to add support for [GitHub Alert](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#alerts)

## License

MIT © [Kenny Wong](https://github.com/jaywcjlove)
