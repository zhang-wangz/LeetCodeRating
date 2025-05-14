import type { Plugin } from 'unified';
import type { Root, Element } from 'hast';
import { visit } from 'unist-util-visit';
import { detailsNode } from './detailsNode.js';
import { trackNode } from './trackNode.js';

export type RehypeVideoOptions = {
  /**
   * URL suffix verification.
   * @default /\/(.*)(.mp4|.mov)$/
   */
  test?: RegExp | ((url: string) => boolean);
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
}

function isValidURL(string: string) {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
}

const properties = { muted: 'muted', controls: 'controls', style: 'max-height:640px;' };
const queryStringToObject = (url: string) =>
  [...new URLSearchParams(url.split('?')[1])].reduce(
    (a: Record<string, string>, [k, v]) => ((a[k] = v), a),
    {}
  );

function reElement(node: Element, details: boolean, track: boolean, href: string) {
  const url = isValidURL(href.trim()) ? new URL(href) : null;
  const pathname = url?.pathname || href;
  const filename = pathname.split('/').pop()?.replace(/(\?|!|\#|$).+/, '');
  const params = queryStringToObject(href.replace(/\?\!/, "?").replace(/\?\!\#/, "?"));
  const { title = filename } = params;
  const result = trackNode(params);
  const searchParams = new URLSearchParams({ ...result.query });
  if (url) {
    url.search = searchParams.toString() ?? "";
  }
  node.tagName = 'video';
  node.children = [];
  node.properties = { ...properties, src: url?.toString() || href };
  if (track) {
    result.element.forEach((tr) => node.children.push({ ...tr }));
  }
  if (details) {
    const reNode = detailsNode(title);
    reNode.children.push({ ...node });
    node.children = reNode.children;
    node.tagName = reNode.tagName;
    node.properties = reNode.properties;
  }
}

const RehypeVideo: Plugin<[RehypeVideoOptions?], Root> = (options) => {
  const { test = /\/(.*)(.mp4|.mov)$/i, details = true, track = true } = options || {};
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      const isChecked = (str: string) => {
        if (test instanceof RegExp) return test.test(str.replace(/(\?|!|\#|$).+/g, '').toLocaleLowerCase())
        if (typeof test === 'function') return test(str)
        return false;
      }
      const child = node.children[0];

      if (node.tagName === 'p' && node.children.length === 1) {
        if (child.type === 'text' && isValidURL(child.value) && isChecked(child.value)) {
          reElement(node, details, track, child.value);
        }
        if (child.type === 'element' && child.tagName === 'a' && child.properties && typeof child.properties.href === 'string' && isChecked(child.properties.href)) {
          reElement(node, details, track, child.properties.href);
        }
      }
    });
  }
}

export default RehypeVideo;
