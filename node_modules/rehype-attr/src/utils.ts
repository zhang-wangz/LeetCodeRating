import type { Element, Comment, Literal, ElementContent, RootContent, Properties } from 'hast';
import type { RehypeAttrsOptions } from './index.js';

export const getURLParameters = (url: string = '') =>
  ((url.match(/([^?=&]+)(=([^&]*))/g) || []) as string[]).reduce(
      (a: Record<string, string | number | boolean>, v: string) => (
        (a[v.slice(0, v.indexOf('=')) as keyof typeof a] = v.slice(v.indexOf('=') + 1)), a
      ),
      {}
    )

export const prevChild = (data: Literal[] = [], index: number): Comment | undefined => {
  let i = index;
  while (i > -1) {
    i--;
    if (!data[i]) return
    if ((data[i] && data[i].value && (data[i].value as string).replace(/(\n|\s)/g, '') !== '') || data[i].type !== 'text') {
      if (!/^rehype:/.test(data[i].value as string) || (data[i].type as string) !== 'comment') return;
      return data[i] as unknown as Comment;
    }
  }
  return;
}

export const nextChild = (data: RootContent[] | ElementContent[] = [], index: number, tagName?: string, codeBlockParames?: boolean): ElementContent | undefined => {
  let i = index;
  while (i < data.length) {
    i++;
    if (tagName) {
      const element = data[i] as Literal & Element;
      if (element && element.value && (element.value as string).replace(/(\n|\s)/g, '') !== '' || data[i] && (data[i].type as string) === 'element') {
        return element.tagName === tagName ? element : undefined
      }
    } else {
      const element = data[i] as ElementContent & Literal;
      if (!element || element.type === 'element') return;
      if (element.type === 'text' && element.value.replace(/(\n|\s)/g, '') !== '') return;
      if (element.type && /^(comment|raw)$/ig.test(element.type)) {
        if (element.value && !/^rehype:/.test(element.value.replace(/^(\s+)?<!--(.*?)-->/, '$2') || '')) {
          return
        };
        if (codeBlockParames) {
          const nextNode = nextChild(data, i, 'pre', codeBlockParames)
          if (nextNode) return;
          element.value = (element.value || '').replace(/^(\n|\s)+/, '')
          return element;
        } else {
          element.value = (element.value || '').replace(/^(\n|\s)+/, '')
          return element;
        }
      }
    }
  }
  return
}

/**
 * 获取代码注视的位置
 * @param data 数据
 * @param index 当前数据所在的位置
 * @returns 返回 当前参数数据 Object，`{}`
 */
export const getCommentObject = ({ value = '' }: Comment): Properties => {
  const param = getURLParameters(value.replace(/^<!--(.*?)-->/, '$1').replace(/^rehype:/, ''));
  Object.keys(param).forEach((keyName: string) => {
    if (param[keyName] === 'true') {
      param[keyName] = true;
    }
    if (param[keyName] === 'false') {
      param[keyName] = false;
    }
    if (typeof param[keyName] === 'string' && !/^0/.test(param[keyName] as string) && !isNaN(+param[keyName])) {
      param[keyName] = +param[keyName];
    }
  })
  return param;
}

export type DataConfig = {
  'data-config': Properties
}

export const propertiesHandle = (defaultAttrs?: Properties | null, attrs?: Properties, type?: RehypeAttrsOptions['properties']): Properties | DataConfig => {
  if (type === 'string') {
    return { ...defaultAttrs, 'data-config': JSON.stringify({ ...attrs, rehyp: true })}
  } else if (type === 'attr') {
    return { ...defaultAttrs, ...attrs}
  }
  return { ...defaultAttrs, 'data-config': { ...attrs, rehyp: true }}
}