import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remark2rehype from 'remark-rehype';
import { rehype } from 'rehype';
import rehypeRaw from 'rehype-raw';
import stringify from 'rehype-stringify';
import rehypeIgnore from '../index.js';

it('rehypeIgnore markdown raw test case 1', async () => {
  const markdown = `<!--rehype:ignore:start-->\n# Title\n<!--rehype:ignore:end-->\n\ntest`;
  const htmlStr = unified()
    .use(remarkParse)
    .use(remark2rehype, { allowDangerousHtml: true })
    .use(rehypeIgnore, { })
    .use(stringify)
    .processSync(markdown)
    .toString()
    expect(htmlStr).toEqual('\n<p>test</p>');
});

it('rehypeIgnore test case 1', async () => {
  const html = `<!--rehype:ignore:start--><h1>header</h1><!--rehype:ignore:end-->`;
  const htmlStr = rehype()
    .data('settings', { fragment: true })
    .use(rehypeIgnore, { })
    .use(stringify)
    .processSync(html)
    .toString()
    expect(htmlStr).toEqual('');
});

it('rehypeIgnore test case 2', async () => {
  const html = `<!--rehype:ignore:start--><h1>header</h1>`;
  const htmlStr = rehype()
    .data('settings', { fragment: true })
    .use(rehypeIgnore, { })
    .use(stringify)
    .processSync(html)
    .toString()
    expect(htmlStr).toEqual('');
});

it('rehypeIgnore test case 3', async () => {
  const html = `<h1>header</h1><!--rehype:ignore:end-->`;
  const htmlStr = rehype()
    .data('settings', { fragment: true })
    .use(rehypeIgnore, { })
    .use(stringify)
    .processSync(html)
    .toString()
    expect(htmlStr).toEqual('<h1>header</h1>');
});

it('rehypeIgnore test case 4', async () => {
  const html = `<!--rehype:ignore:start--><h1>header</h1><!--rehype:ignore:end--><!--rehype:ignore:end-->`;
  const htmlStr = rehype()
    .data('settings', { fragment: true })
    .use(rehypeIgnore, { })
    .use(stringify)
    .processSync(html)
    .toString()
    expect(htmlStr).toEqual('');
});

it('rehypeIgnore Markdown test case', async () => {
  const html = `# Hello World

<!--rehype:ignore:start-->Hello World<!--rehype:ignore:end-->

Good!`;
  const expected = `<h1>Hello World</h1>

<p>Good!</p>`;
  const htmlStr = unified()
    .use(remarkParse)
    .use(remark2rehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeIgnore, { })
    .use(stringify)
    .processSync(html)
    .toString()

    expect(htmlStr).toEqual(expected);
});

it('rehypeIgnore test case openDelimiter/closeDelimiter', async () => {
  const html = `<!--idoc:start--><h1>header</h1><!--idoc:end-->`;
  const htmlStr = rehype()
    .data('settings', { fragment: true })
    .use(rehypeIgnore, {
      openDelimiter: 'idoc:start',
      closeDelimiter: 'idoc:end',
    })
    .use(stringify)
    .processSync(html)
    .toString()
    expect(htmlStr).toEqual('');
});

it('rehypeIgnore test case', async () => {
  const html = `<!--rehype:ignore:start-->
<h1>header</h1>
<!--rehype:ignore:end-->
<p>
  Hello <!--rehype:ignore:start--> <code>World</code> <!--rehype:ignore:end-->
</p>

<!--rehype:ignore:start-->
<h2>header</h2>
<!--rehype:ignore:end-->
<p>Hi</p>
`;
  const expected = `
<p>
  Hello 
</p>


<p>Hi</p>
`;
  const htmlStr = rehype()
    .data('settings', { fragment: true })
    .use(rehypeIgnore, { })
    .use(stringify)
    .processSync(html)
    .toString()
    expect(htmlStr).toEqual(expected);
});
