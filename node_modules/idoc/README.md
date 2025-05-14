<!--idoc:ignore:start-->
idoc
===
<!--idoc:ignore:end-->

[![NPM version](https://img.shields.io/npm/v/idoc.svg?style=flat)](https://npmjs.org/package/idoc)
[![CI](https://github.com/jaywcjlove/idoc/actions/workflows/ci.yml/badge.svg)](https://github.com/jaywcjlove/idoc/actions/workflows/ci.yml)
[![Dependents Repo](https://badgen.net/github/dependents-repo/jaywcjlove/idoc)](https://github.com/jaywcjlove/idoc/network/dependents)
[![npm Downloads](https://img.shields.io/npm/dw/idoc?style=flat)](https://www.npmjs.com/package/idoc)
[![npm Downloads](https://img.shields.io/npm/dm/idoc?style=flat)](https://www.npmjs.com/package/idoc)
[![npm Downloads](https://img.shields.io/npm/dy/idoc?style=flat)](https://www.npmjs.com/package/idoc)

Generate static pages from all Markdown in a folder.

```bash
  ,,        ,,
  db      `7MM
            MM
`7MM   ,M""bMM  ,pW"Wq.   ,p6"bo
  MM ,AP    MM 6W'   `Wb 6M'  OO
  MM 8MI    MM 8M     M8 8M
  MM `Mb    MM YA.   ,A9 YM.    ,
.JMML.`Wbmd"MML.`Ybmd9'   YMbmd'
```

## Quick Start

Create a idoc site using the beautiful defalut theme.

```bash
$ npx idoc init myapp
```

Or

```bash
$ sudo npm i idoc -g
$ idoc init myapp
```

Running the `idoc init myapp` generator from the command line will create a directory structure with the following elements:

```bash
├── docs
│   ├── README.md
│   └── about.md
├── package.json
└── idoc.yml
```

Or use in github actions

```yml
- name: Create idoc config.
  run: |
    cat > idoc.yml << EOF
    site: "Rehype Rewrite {{version}}"
    menus:
      Home: index.html
    EOF

- run: npm install idoc@1.26.6 -g
- run: idoc --output="www"
```

## Command Help

```bash
Usage: idoc [init|new][options] [--help|h] [--version|v]

Options:

  -v, --version, Show version number
  -h, --help,    Displays help information.
  -f, --force,   Force file regeneration.
  -s, --site,    Set website name.
  -d, --dir <dir-path>, Markdown file directory. defalut(docs)
  -o, --output <dir-path>, Output directory. defalut(dist)
  -w, --watch,   Watch and compile Markdown files.
  -t, --theme,   Customize theme settings. defalut(defalut)
  -m, --minify,  minify HTML

Example:

  $ idoc init <folder>
  $ idoc new introduce/README.md
  $ idoc new introduce/README.md "Hello World" -f
  $ idoc --theme="defalut"
  $ idoc --dir="docs"
  $ idoc --output="dist"
  $ idoc --watch --output="www"
```

## Compiled with idoc

My macOS app's official website is also built with it:

<p style="display: inline-block">
    <a target="_blank" href="https://wangchujiang.com/daybar/" title="DayBar for macOS"><img align="center" alt="DayBar" height="50" width="50" src="https://github.com/user-attachments/assets/b67d4a2e-92e2-4d8c-8c6f-2a1eb3e2fa93"></a>
    <a target="_blank" href="https://wangchujiang.com/iconed/" title="Iconed for macOS"><img align="center" alt="Iconed" height="50" width="50" src="https://github.com/user-attachments/assets/8a35dc7b-4faf-4e2a-9311-f66d6844a896"></a>
    <a target="_blank" href="https://wangchujiang.com/rightmenu-master/" title="RightMenu Master for macOS"><img align="center" alt="RightMenu Master" height="50" width="50" src="https://github.com/user-attachments/assets/39a76541-71bf-4de7-a01c-c62f0557dff5"></a>
    <a target="_blank" href="https://wangchujiang.com/paste-quick/" title="Paste Quick for macOS"><img align="center" alt="Quick RSS" height="50" width="50" src="https://github.com/user-attachments/assets/bdaad5b7-9810-44ce-8f17-8410864465d2"></a>
    <a target="_blank" href="https://wangchujiang.com/quick-rss/" title="Quick RSS for macOS/iOS"><img align="center" alt="Quick RSS" height="50" width="50" src="https://github.com/user-attachments/assets/374106b5-a448-4d1d-9ccb-b04b6bc681ed"></a>
    <a target="_blank" href="https://wangchujiang.com/web-serve/" title="Web Serve for macOS"><img align="center" alt="Web Serve" height="50" width="50" src="https://github.com/user-attachments/assets/e1d9f76f-0f3d-4ba5-8a15-253ee173bb1c"></a>
    <a target="_blank" href="https://wangchujiang.com/copybook-generator/" title="Copybook Generator for macOS/iOS"><img align="center" alt="Copybook Generator" height="50" width="50" src="https://github.com/jaywcjlove/jaywcjlove/assets/1680273/b90e42ff-158b-4534-82ca-5898fd0e8d73"></a>
    <a target="_blank" href="https://wangchujiang.com/devtutor/" title="DevTutor for macOS/iOS"><img align="center" alt="DevTutor for SwiftUI" height="50" width="50" src="https://github.com/jaywcjlove/jaywcjlove/assets/1680273/f15c154d-0192-48eb-8e0e-9e245ffd974a"></a>
    <a target="_blank" href="https://wangchujiang.com/regex-mate/" title="RegexMate for macOS/iOS"><img align="center" alt="RegexMate" height="50" width="50" src="https://github.com/jaywcjlove/jaywcjlove/assets/1680273/aabe5aa9-9a96-4390-8bed-c3e4023d0dea"></a>
    <a target="_blank" href="https://wangchujiang.com/time-passage/" title="Time Passage for macOS/iOS"><img align="center" alt="Time Passage" height="50" width="50" src="https://github.com/jaywcjlove/time-passage/assets/1680273/6f30e429-e6f3-4dbe-9921-a5effe2a05e9"></a>
    <a target="_blank" href="https://wangchujiang.com/IconizeFolder/" title="IconizeFolder for macOS"><img align="center" alt="Iconize Folder" height="50" width="50" src="https://github.com/jaywcjlove/jaywcjlove/assets/1680273/fa9d8b9c-1e51-4ded-877c-fa5b21c47220"></a>
    <a target="_blank" href="https://wangchujiang.com/TextSoundSaver/" title="Textsound Saver for macOS/iOS"><img align="center" alt="Textsound Saver" height="50" width="50" src="https://github.com/jaywcjlove/jaywcjlove/assets/1680273/0595e842-980b-4574-8891-a8ba853a08be"></a>
    <a target="_blank" href="https://wangchujiang.com/create-custom-symbols/" title="Create Custom Symbols for macOS"><img align="center" alt="Create Custom Symbols" height="50" width="50" src="https://github.com/jaywcjlove/jaywcjlove/assets/1680273/8cd022ce-a3f1-4e89-b7c6-6fbd0d4db77c"></a>
    <a target="_blank" href="https://wangchujiang.com/DevHub/" title="DevHub for macOS"><img align="center" alt="DevHub" height="50" width="50" src="https://github.com/user-attachments/assets/4a44a4fd-67ce-430b-af0a-72f18feaa47d"></a>
    <a target="_blank" href="https://wangchujiang.com/ResumeRevise/" title="Resume Revise for macOS"><img align="center" alt="Resume Revise" height="50" width="50" src="https://github.com/jaywcjlove/jaywcjlove/assets/1680273/c9954a20-1905-48de-bdf8-d71837974aa2"></a>
    <a target="_blank" href="https://wangchujiang.com/palette-genius/" title="Palette Genius for macOS"><img align="center" alt="Palette Genius" height="50" width="50" src="https://github.com/jaywcjlove/jaywcjlove/assets/1680273/27340413-d355-45b2-8f6f-6ac37682d957"></a>
    <a target="_blank" href="https://wangchujiang.com/symbol-scribe/" title="Symbol Scribe for macOS"><img align="center" alt="Symbol Scribe" height="50" width="50" src="https://github.com/jaywcjlove/jaywcjlove/assets/1680273/c7249f05-fa70-4def-a1e9-571d5f171fc9"></a>
</p>
<br />

| Repo | Starred | Last Commit | Website |
| ---- | ---- | ---- | ---- |
| [Awesome Mac](https://github.com/jaywcjlove/awesome-mac) | [![Github Stars](https://img.shields.io/github/stars/jaywcjlove/awesome-mac.svg)](https://github.com/jaywcjlove/awesome-mac/stargazers) | [![GitHub last commit](https://img.shields.io/github/last-commit/jaywcjlove/awesome-mac?style=flat&label=last)](https://github.com/jaywcjlove/awesome-mac/commits) | [Preview Website](https://jaywcjlove.github.io/awesome-mac) |
| [Awesome UIKit](https://github.com/jaywcjlove/shell-tutorialawesome-uikit) | [![Github Stars](https://img.shields.io/github/stars/jaywcjlove/awesome-uikit.svg)](https://github.com/jaywcjlove/awesome-uikit/stargazers) | [![GitHub last commit](https://img.shields.io/github/last-commit/jaywcjlove/awesome-uikit?style=flat&label=last)](https://github.com/jaywcjlove/awesome-uikit/commits) | [Preview Website](https://jaywcjlove.github.io/awesome-uikit) |
| [MySQL Tutorial](https://github.com/jaywcjlove/mysql-tutorial) | [![Github Stars](https://img.shields.io/github/stars/jaywcjlove/mysql-tutorial.svg)](https://github.com/jaywcjlove/mysql-tutorial/stargazers) | [![GitHub last commit](https://img.shields.io/github/last-commit/jaywcjlove/mysql-tutorial?style=flat&label=last)](https://github.com/jaywcjlove/mysql-tutorial/commits) | [Preview Website](https://jaywcjlove.github.io/mysql-tutorial) |
| [Docker Tutorial](https://github.com/jaywcjlove/docker-tutorial) | [![Github Stars](https://img.shields.io/github/stars/jaywcjlove/docker-tutorial.svg)](https://github.com/jaywcjlove/docker-tutorial/stargazers) | [![GitHub last commit](https://img.shields.io/github/last-commit/jaywcjlove/docker-tutorial?style=flat&label=last)](https://github.com/jaywcjlove/docker-tutorial/commits) | [Preview Website](https://jaywcjlove.github.io/docker-tutorial) |
| [Nginx Tutorial](https://github.com/jaywcjlove/nginx-tutorial) | [![Github Stars](https://img.shields.io/github/stars/jaywcjlove/nginx-tutorial.svg)](https://github.com/jaywcjlove/nginx-tutorial/stargazers) | [![GitHub last commit](https://img.shields.io/github/last-commit/jaywcjlove/nginx-tutorial?style=flat&label=last)](https://github.com/jaywcjlove/nginx-tutorial/commits) | [Preview Website](https://jaywcjlove.github.io/nginx-tutorial) |
| [Vim Web](https://github.com/jaywcjlove/vim-web) | [![Github Stars](https://img.shields.io/github/stars/jaywcjlove/vim-web.svg)](https://github.com/jaywcjlove/vim-web/stargazers) | [![GitHub last commit](https://img.shields.io/github/last-commit/jaywcjlove/vim-web?style=flat&label=last)](https://github.com/jaywcjlove/vim-web/commits) | [Preview Website](https://jaywcjlove.github.io/vim-web) |
| [Git Tips](https://github.com/jaywcjlove/git-tips) | [![Github Stars](https://img.shields.io/github/stars/jaywcjlove/git-tips.svg)](https://github.com/jaywcjlove/git-tips/stargazers) | [![GitHub last commit](https://img.shields.io/github/last-commit/jaywcjlove/git-tips?style=flat&label=last)](https://github.com/jaywcjlove/git-tips/commits) | [Preview Website](https://jaywcjlove.github.io/git-tips) |
| [Shell Tutorial](https://github.com/jaywcjlove/shell-tutorial) | [![Github Stars](https://img.shields.io/github/stars/jaywcjlove/shell-tutorial.svg)](https://github.com/jaywcjlove/shell-tutorial/stargazers) | [![GitHub last commit](https://img.shields.io/github/last-commit/jaywcjlove/shell-tutorial?style=flat&label=last)](https://github.com/jaywcjlove/shell-tutorial/commits) | [Preview Website](https://jaywcjlove.github.io/shell-tutorial) |
| [SwiftUI Example](https://github.com/jaywcjlove/swiftui-example) | [![Github Stars](https://img.shields.io/github/stars/jaywcjlove/swiftui-example.svg)](https://github.com/jaywcjlove/swiftui-example/stargazers) | [![GitHub last commit](https://img.shields.io/github/last-commit/jaywcjlove/swiftui-example?style=flat&label=last)](https://github.com/jaywcjlove/swiftui-example/commits) | [Preview Website](https://jaywcjlove.github.io/swiftui-example) |
| [Swift Tutorial](https://github.com/jaywcjlove/swift-tutorial) | [![Github Stars](https://img.shields.io/github/stars/jaywcjlove/swift-tutorial.svg)](https://github.com/jaywcjlove/swift-tutorial/stargazers) | [![GitHub last commit](https://img.shields.io/github/last-commit/jaywcjlove/swift-tutorial?style=flat&label=last)](https://github.com/jaywcjlove/swift-tutorial/commits) | [Preview Website](https://jaywcjlove.github.io/swift-tutorial) |
| [Handbook](https://github.com/jaywcjlove/handbook) | [![Github Stars](https://img.shields.io/github/stars/jaywcjlove/handbook.svg)](https://github.com/jaywcjlove/handbook/stargazers) | [![GitHub last commit](https://img.shields.io/github/last-commit/jaywcjlove/handbook?style=flat&label=last)](https://github.com/jaywcjlove/handbook/commits) | [Preview Website](https://jaywcjlove.github.io/handbook) |
| [GitHub Actions](https://github.com/jaywcjlove/github-actions) | [![Github Stars](https://img.shields.io/github/stars/jaywcjlove/github-actions.svg)](https://github.com/jaywcjlove/github-actions/stargazers) | [![GitHub last commit](https://img.shields.io/github/last-commit/jaywcjlove/github-actions?style=flat&label=last)](https://github.com/jaywcjlove/github-actions/commits) | [Preview Website](https://jaywcjlove.github.io/github-actions) |
| [HTML Tutorial](https://github.com/jaywcjlove/html-tutorial) | [![Github Stars](https://img.shields.io/github/stars/jaywcjlove/html-tutorial.svg)](https://github.com/jaywcjlove/html-tutorial/stargazers) | [![GitHub last commit](https://img.shields.io/github/last-commit/jaywcjlove/html-tutorial?style=flat&label=last)](https://github.com/jaywcjlove/html-tutorial/commits) | [Preview Website](https://jaywcjlove.github.io/html-tutorial) |
| [C Tutorial](https://github.com/jaywcjlove/c-tutorial) | [![Github Stars](https://img.shields.io/github/stars/jaywcjlove/c-tutorial.svg)](https://github.com/jaywcjlove/c-tutorial/stargazers) | [![GitHub last commit](https://img.shields.io/github/last-commit/jaywcjlove/c-tutorial?style=flat&label=last)](https://github.com/jaywcjlove/c-tutorial/commits) | [Preview Website](https://jaywcjlove.github.io/c-tutorial) |
| [React Native](https://github.com/jaywcjlove/react-native) | [![Github Stars](https://img.shields.io/github/stars/jaywcjlove/react-native.svg)](https://github.com/jaywcjlove/react-native/stargazers) | [![GitHub last commit](https://img.shields.io/github/last-commit/jaywcjlove/react-native?style=flat&label=last)](https://github.com/jaywcjlove/react-native/commits) | [Preview Website](https://jaywcjlove.github.io/react-native) |
| [TypeNexus](https://github.com/jaywcjlove/typenexus) | [![Github Stars](https://img.shields.io/github/stars/jaywcjlove/typenexus.svg)](https://github.com/jaywcjlove/typenexus/stargazers) | [![GitHub last commit](https://img.shields.io/github/last-commit/jaywcjlove/typenexus?style=flat&label=last)](https://github.com/jaywcjlove/typenexus/commits) | [Preview Website](https://jaywcjlove.github.io/typenexus) |
| [Awesome ChatGPT](https://github.com/jaywcjlove/awesome-chatgpt) | [![Github Stars](https://img.shields.io/github/stars/jaywcjlove/awesome-chatgpt.svg)](https://github.com/jaywcjlove/awesome-chatgpt/stargazers) | [![GitHub last commit](https://img.shields.io/github/last-commit/jaywcjlove/awesome-chatgpt?style=flat&label=last)](https://github.com/jaywcjlove/awesome-chatgpt/commits) | [Preview Website](https://jaywcjlove.github.io/awesome-chatgpt) |
| [React Components Awesome](https://github.com/jaywcjlove/react-components-awesome) | [![Github Stars](https://img.shields.io/github/stars/jaywcjlove/react-components-awesome.svg)](https://github.com/jaywcjlove/react-components-awesome/stargazers) | [![GitHub last commit](https://img.shields.io/github/last-commit/jaywcjlove/react-components-awesome?style=flat&label=last)](https://github.com/jaywcjlove/react-components-awesome/commits) | [Preview Website](https://jaywcjlove.github.io/react-components-awesome) |
| Repo | Starred | Downloads | Website |
| [rehype-rewrite](https://github.com/jaywcjlove/rehype-rewrite) | [![Github Stars](https://img.shields.io/github/stars/jaywcjlove/rehype-rewrite.svg)](https://github.com/jaywcjlove/rehype-rewrite/stargazers) | [![NPM Downloads](https://img.shields.io/npm/dm/rehype-rewrite.svg?label=&logo=npm&style=flat&labelColor=ffacab&color=dd4e4c)](https://www.npmjs.com/package/rehype-rewrite) | [Preview Website](https://jaywcjlove.github.io/rehype-rewrite) |
| [rehype-attr](https://github.com/jaywcjlove/rehype-attr) | [![Github Stars](https://img.shields.io/github/stars/jaywcjlove/rehype-attr.svg)](https://github.com/jaywcjlove/rehype-attr/stargazers) | [![NPM Downloads](https://img.shields.io/npm/dm/rehype-attr.svg?label=&logo=npm&style=flat&labelColor=ffacab&color=dd4e4c)](https://www.npmjs.com/package/rehype-attr) | [Preview Website](https://jaywcjlove.github.io/rehype-attr) |
| [rehype-ignore](https://github.com/jaywcjlove/rehype-ignore) | [![Github Stars](https://img.shields.io/github/stars/jaywcjlove/rehype-ignore.svg)](https://github.com/jaywcjlove/rehype-ignore/stargazers) | [![NPM Downloads](https://img.shields.io/npm/dm/rehype-ignore.svg?label=&logo=npm&style=flat&labelColor=ffacab&color=dd4e4c)](https://www.npmjs.com/package/rehype-ignore) | [Preview Website](https://jaywcjlove.github.io/rehype-ignore) |
| [rehype-video](https://github.com/jaywcjlove/rehype-video) | [![Github Stars](https://img.shields.io/github/stars/jaywcjlove/rehype-video.svg)](https://github.com/jaywcjlove/rehype-video/stargazers) | [![NPM Downloads](https://img.shields.io/npm/dm/rehype-video.svg?label=&logo=npm&style=flat&labelColor=ffacab&color=dd4e4c)](https://www.npmjs.com/package/rehype-video) | [Preview Website](https://jaywcjlove.github.io/rehype-video) |
| [remark-github-blockquote-alert](https://github.com/jaywcjlove/remark-github-blockquote-alert) | [![Github Stars](https://img.shields.io/github/stars/jaywcjlove/remark-github-blockquote-alert.svg)](https://github.com/jaywcjlove/remark-github-blockquote-alert/stargazers) | [![NPM Downloads](https://img.shields.io/npm/dm/remark-github-blockquote-alert.svg?label=&logo=npm&style=flat&labelColor=ffacab&color=dd4e4c)](https://www.npmjs.com/package/remark-github-blockquote-alert) | [Preview Website](https://jaywcjlove.github.io/remark-github-blockquote-alert) |
| [store.js](https://github.com/jaywcjlove/store.js) | [![Github Stars](https://img.shields.io/github/stars/jaywcjlove/store.js.svg)](https://github.com/jaywcjlove/store.js/stargazers) | [![NPM Downloads](https://img.shields.io/npm/dm/storejs.svg?label=&logo=npm&style=flat&labelColor=ffacab&color=dd4e4c)](https://www.npmjs.com/package/storejs) | [Preview Website](https://jaywcjlove.github.io/store.js) |
| [cookie.js](https://github.com/jaywcjlove/cookie.js) | [![Github Stars](https://img.shields.io/github/stars/jaywcjlove/cookie.js.svg)](https://github.com/jaywcjlove/cookie.js/stargazers) | [![NPM Downloads](https://img.shields.io/npm/dm/cookiejs.svg?label=&logo=npm&style=flat&labelColor=ffacab&color=dd4e4c)](https://www.npmjs.com/package/cookiejs) | [Preview Website](https://jaywcjlove.github.io/cookie.js) |
| [auto-config-loader](https://github.com/jaywcjlove/auto-config-loader) | [![Github Stars](https://img.shields.io/github/stars/jaywcjlove/auto-config-loader.svg)](https://github.com/jaywcjlove/auto-config-loader/stargazers) | [![NPM Downloads](https://img.shields.io/npm/dm/auto-config-loader.svg?label=&logo=npm&style=flat&labelColor=ffacab&color=dd4e4c)](https://www.npmjs.com/package/auto-config-loader) | [Preview Website](https://jaywcjlove.github.io/auto-config-loader) |
| [chmod-cli](https://github.com/jaywcjlove/chmod-cli) | [![Github Stars](https://img.shields.io/github/stars/jaywcjlove/chmod-cli.svg)](https://github.com/jaywcjlove/chmod-cli/stargazers) | [![NPM Downloads](https://img.shields.io/npm/dm/chmod-cli.svg?label=&logo=npm&style=flat&labelColor=ffacab&color=dd4e4c)](https://www.npmjs.com/package/chmod-cli) | [Preview Website](https://jaywcjlove.github.io/chmod-cli) |
| [local-ip-url](https://github.com/jaywcjlove/local-ip-url) | [![Github Stars](https://img.shields.io/github/stars/jaywcjlove/local-ip-url.svg)](https://github.com/jaywcjlove/local-ip-url/stargazers) | [![NPM Downloads](https://img.shields.io/npm/dm/local-ip-url.svg?label=&logo=npm&style=flat&labelColor=ffacab&color=dd4e4c)](https://www.npmjs.com/package/local-ip-url) | [Preview Website](https://jaywcjlove.github.io/local-ip-url) |
| [path-templater](https://github.com/jaywcjlove/path-templater) | [![Github Stars](https://img.shields.io/github/stars/jaywcjlove/path-templater.svg)](https://github.com/jaywcjlove/path-templater/stargazers) | [![NPM Downloads](https://img.shields.io/npm/dm/path-templater.svg?label=&logo=npm&style=flat&labelColor=ffacab&color=dd4e4c)](https://www.npmjs.com/package/path-templater) | [Preview Website](https://jaywcjlove.github.io/path-templater) |
| [html-to-markdown-cli](https://github.com/jaywcjlove/html-to-markdown-cli) | [![Github Stars](https://img.shields.io/github/stars/jaywcjlove/html-to-markdown-cli.svg)](https://github.com/jaywcjlove/html-to-markdown-cli/stargazers) | [![NPM Downloads](https://img.shields.io/npm/dm/@wcj/html-to-markdown.svg?label=&logo=npm&style=flat&labelColor=ffacab&color=dd4e4c)](https://www.npmjs.com/package/@wcj/html-to-markdown) | [Preview Website](https://jaywcjlove.github.io/html-to-markdown-cli) |
| [colors-named](https://github.com/jaywcjlove/colors-named) | [![Github Stars](https://img.shields.io/github/stars/jaywcjlove/colors-named.svg)](https://github.com/jaywcjlove/colors-named/stargazers) | [![NPM Downloads](https://img.shields.io/npm/dm/colors-named.svg?label=&logo=npm&style=flat&labelColor=ffacab&color=dd4e4c)](https://www.npmjs.com/package/colors-named) | [Preview Website](https://jaywcjlove.github.io/colors-named) |
| [colors-named-hex](https://github.com/jaywcjlove/colors-named-hex) | [![Github Stars](https://img.shields.io/github/stars/jaywcjlove/colors-named-hex.svg)](https://github.com/jaywcjlove/colors-named-hex/stargazers) | [![NPM Downloads](https://img.shields.io/npm/dm/colors-named-hex.svg?label=&logo=npm&style=flat&labelColor=ffacab&color=dd4e4c)](https://www.npmjs.com/package/colors-named-hex) | [Preview Website](https://jaywcjlove.github.io/colors-named-hex) |
| [colors-named-decimal](https://github.com/jaywcjlove/colors-named-decimal) | [![Github Stars](https://img.shields.io/github/stars/jaywcjlove/colors-named-decimal.svg)](https://github.com/jaywcjlove/colors-named-decimal/stargazers) | [![NPM Downloads](https://img.shields.io/npm/dm/colors-named-decimal.svg?label=&logo=npm&style=flat&labelColor=ffacab&color=dd4e4c)](https://www.npmjs.com/package/colors-named-decimal) | [Preview Website](https://jaywcjlove.github.io/colors-named-decimal) |
| [chinese-numerals](https://github.com/jaywcjlove/chinese-numerals) | [![Github Stars](https://img.shields.io/github/stars/jaywcjlove/chinese-numerals.svg)](https://github.com/jaywcjlove/chinese-numerals/stargazers) | [![NPM Downloads](https://img.shields.io/npm/dm/@wcj/chinese-numerals.svg?label=&logo=npm&style=flat&labelColor=ffacab&color=dd4e4c)](https://www.npmjs.com/package/@wcj/chinese-numerals) | [Preview Website](https://jaywcjlove.github.io/chinese-numerals) |
| [image2uri](https://github.com/jaywcjlove/image2uri) | [![Github Stars](https://img.shields.io/github/stars/jaywcjlove/image2uri.svg)](https://github.com/jaywcjlove/image2uri/stargazers) | [![NPM Downloads](https://img.shields.io/npm/dm/image2uri.svg?label=&logo=npm&style=flat&labelColor=ffacab&color=dd4e4c)](https://www.npmjs.com/package/image2uri) | [Preview Website](https://jaywcjlove.github.io/image2uri) |
| [svgtofont](https://github.com/jaywcjlove/svgtofont) | [![Github Stars](https://img.shields.io/github/stars/jaywcjlove/svgtofont.svg)](https://github.com/jaywcjlove/svgtofont/stargazers) | [![NPM Downloads](https://img.shields.io/npm/dm/svgtofont.svg?label=&logo=npm&style=flat&labelColor=ffacab&color=dd4e4c)](https://www.npmjs.com/package/svgtofont) | [Preview Website](https://jaywcjlove.github.io/svgtofont) |
| [console-emojis](https://github.com/jaywcjlove/console-emojis) | [![Github Stars](https://img.shields.io/github/stars/jaywcjlove/console-emojis.svg)](https://github.com/jaywcjlove/console-emojis/stargazers) | [![NPM Downloads](https://img.shields.io/npm/dm/console-emojis.svg?label=&logo=npm&style=flat&labelColor=ffacab&color=dd4e4c)](https://www.npmjs.com/package/console-emojis) | [Preview Website](https://jaywcjlove.github.io/console-emojis) |
| [compile-less](https://github.com/jaywcjlove/compile-less) | [![Github Stars](https://img.shields.io/github/stars/jaywcjlove/compile-less.svg)](https://github.com/jaywcjlove/compile-less/stargazers) | [![NPM Downloads](https://img.shields.io/npm/dm/compile-less-cli.svg?label=&logo=npm&style=flat&labelColor=ffacab&color=dd4e4c)](https://www.npmjs.com/package/compile-less-cli) | [Preview Website](https://jaywcjlove.github.io/compile-less) |
<!--rehype:style=width: 100%; display: inline-table;-->

## Contributors

As always, thanks to our amazing contributors!

<a href="https://github.com/jaywcjlove/idoc/graphs/contributors">
  <img src="https://jaywcjlove.github.io/idoc/CONTRIBUTORS.svg" />
</a>

Made with [action-contributors](https://github.com/jaywcjlove/github-action-contributors).

## License

Licensed under the MIT License.
