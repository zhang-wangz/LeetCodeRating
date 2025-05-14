import ini from 'ini';

export function iniLoader<T>(_: string, content: string): T {
  return ini.parse(content) as T;
}
