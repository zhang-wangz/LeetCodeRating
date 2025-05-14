import { VFile } from 'vfile';
import { unified, PluggableList } from 'unified';
import { Root, Element, RootContent } from 'hast';
import remarkGfm from 'remark-gfm';
import rehypeAttrs from 'rehype-attr';
import remarkParse from 'remark-parse';
import remarkRehype, { Options as RemarkRehypeOptions } from 'remark-rehype';
import rehypeVideo from 'rehype-video';
import rehypeKatex, { Options as KatexOptions } from 'rehype-katex';
import rehypeIgnore from 'rehype-ignore';
import rehypeRaw from 'rehype-raw';
import rehypeRewrite, { RehypeRewriteOptions, getCodeString } from 'rehype-rewrite';
import stringify from 'rehype-stringify';
import rehypePrism from 'rehype-prism-plus';

export { getCodeString };

Object.defineProperty(rehypePrism, 'name', {
  value: 'rehypePrism',
  configurable: true,
});

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
  /** code blocks show line numbers. @default `true` */
  showLineNumbers?: boolean;
  /** See KaTeX [options](https://katex.org/docs/options.html). */
  katexOptions?: KatexOptions;
}

function markdown(markdownStr: string = '', options: Options = {}) {
  const { filterPlugins, showLineNumbers = true, katexOptions = {} } = options;
  const remarkPlugins: PluggableList = [remarkGfm, ...(options.remarkPlugins || [])];
  const rehypePlugins: PluggableList = [
    [rehypePrism, { ignoreMissing: true, showLineNumbers }],
    rehypeRaw,
    [
      rehypeVideo,
      {
        test: (url: string) => /\.(mp4|mov)|[?&]rehype=video/i.test(url),
      },
    ],
    [rehypeAttrs, { properties: 'attr', codeBlockParames: false }],
    rehypeIgnore,
    ...(options.rehypePlugins || []),
    [
      rehypeRewrite,
      {
        rewrite: (node: Root | RootContent, index: number | null, parent: Root | Element | null) => {
          if (node.type == 'element' && node.tagName === 'code') {
            const { className = [] } = node.properties || {};
            const found = (Array.isArray(className) ? className : [className]).find(
              (str) => String(str).toLocaleLowerCase().indexOf('language-katex') > -1,
            );
            const code = getCodeString(node.children);
            if (found && node.properties) {
              if (Array.isArray(node.properties.className)) {
                if (parent && parent.type === 'element' && parent.properties) {
                  parent.properties.className = ['language-katex'];
                }
                node.properties.className.push('math');
                node.properties.className.push('math-display');
                node.children = [
                  {
                    type: 'text',
                    value: code,
                  },
                ];
              }
            }
            if (/^katex/.test(code.toLocaleLowerCase())) {
              node.properties!.className = ['math', 'math-inline'];
              node.children = [
                {
                  type: 'text',
                  value: code.replace(/^KaTeX:(\s.)?/i, ''),
                },
              ];
            }
          }

          if (options.rewrite && typeof options.rewrite === 'function') {
            options.rewrite(node, index, parent);
          }
        },
      },
    ],
    [rehypeKatex, katexOptions],
    stringify,
  ];

  const processor = unified()
    .use(remarkParse)
    .use(filterPlugins && typeof filterPlugins === 'function' ? filterPlugins('remark', remarkPlugins) : remarkPlugins)
    .use(remarkRehype, {
      ...options.remarkRehypeOptions,
      allowDangerousHtml: true,
    })
    .use(filterPlugins && typeof filterPlugins === 'function' ? filterPlugins('rehype', rehypePlugins) : rehypePlugins);

  const file = new VFile();
  file.value = markdownStr;
  const hastNode = processor.runSync(processor.parse(file), file);
  if (options.hastNode) {
    return hastNode;
  }
  return String(processor.stringify(hastNode, file));
}

export default markdown;
