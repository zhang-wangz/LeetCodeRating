import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

export const validUrl = (url: string) => /http(s)?:\/\/(\w+:?\w*@)?(\S+)(:\d+)?((?<=\.)\w+)+(\/([\w#!:.?+=&%@!\-/])*)?/gi.test(url);
export const extTypeMap = {
  '.png': 'image/png',
  '.apng': 'image/apng',
  '.gif': 'image/gif',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.bm': 'image/bmp',
  '.bmp': 'image/bmp',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml'
}

export type ExtType =  keyof typeof extTypeMap;
export default function image2uri(file: string, options: { ext?: string } = {}): string | Promise<string> {
  const ext: ExtType = (options.ext || path.extname(file)) as ExtType;
  const contentType = extTypeMap[ext]
  if (validUrl(file)) {
    return fetch(file).then((response) => response.buffer()).then((buffer) => {
      return contentType ? `data:${contentType};base64,${buffer.toString('base64')}` : buffer.toString('base64');
    });
  }
  const image = fs.readFileSync(file);
  return contentType ? `data:${contentType};base64,${image.toString('base64')}` : image.toString('base64');
}