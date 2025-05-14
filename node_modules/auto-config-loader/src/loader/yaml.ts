import type { AST } from 'yaml-eslint-parser';
import { parseYAML, getStaticYAMLValue } from 'yaml-eslint-parser';

export function yamlLoader<T>(_: string, content: string): T {
  const ast: AST.YAMLProgram = parseYAML(content);
  return getStaticYAMLValue(ast) as T;
}
