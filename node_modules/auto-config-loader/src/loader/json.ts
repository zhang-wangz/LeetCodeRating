import type { AST } from 'jsonc-eslint-parser';
import { parseJSON, getStaticJSONValue } from 'jsonc-eslint-parser';

export function jsonLoader<T>(_: string, content: string): T {
  const ast: AST.JSONProgram = parseJSON(content);
  return getStaticJSONValue(ast) as T;
}
