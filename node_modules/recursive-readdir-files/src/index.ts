import fs from 'node:fs';
import path from 'node:path';

export interface RecursiveReaddirFilesOptions {
  /**
   * Ignore files
   * @example `/\/(node_modules|\.git)/`
   */
  ignored?: RegExp;
  /**
   * Specifies a list of `glob` patterns that match files to be included in compilation.
   * @example `/(\.json)$/`
   */
  include?: RegExp;
  /**
   * Specifies a list of files to be excluded from compilation.
   * @example `/(package\.json)$/`
   */
  exclude?: RegExp;
  /** Provide filtering methods to filter data. */
  filter?: (item: IFileDirStat) => boolean;
}

export interface IFileDirStat extends Partial<fs.Stats> {
  /**
   * @example `/a/sum.jpg` => `sum.jpg`
   */
  name: string;
  /**
   * @example `/basic/src/utils/sum.ts`
   */
  path: string;
  /**
   * @example `/a/b.jpg` => `jpg`
   */
  ext?: string;
}

type Callback = (filepath: string, stat: IFileDirStat) => void;

export default function recursiveReaddirFiles(
  rootPath: string,
  options: RecursiveReaddirFilesOptions = {},
  callback?: Callback,
): Promise<IFileDirStat[]> {
  return getFiles(rootPath, options, [], callback);
}

export { recursiveReaddirFiles };

async function getFiles(
  rootPath: string,
  options: RecursiveReaddirFilesOptions = {},
  files: IFileDirStat[] = [],
  callback?: Callback,
): Promise<IFileDirStat[]> {
  const { ignored, include, exclude, filter } = options;
  const filesData = await fs.promises.readdir(rootPath);
  const fileDir: IFileDirStat[] = filesData
    .map((file) => ({
      name: file,
      path: path.join(rootPath, file),
    }))
    .filter((item) => {
      if (include && include.test(item.path)) {
        return true;
      }
      if (exclude && exclude.test(item.path)) {
        return false;
      }
      if (ignored) {
        return !ignored.test(item.path);
      }
      return true;
    });
  if (callback) {
    fileDir.map(async (item: IFileDirStat) => {
      const stat = await getStat(item.path);
      if (stat.isDirectory()) {
        getFiles(item.path, options, [], callback);
      }
      callback(item.path, stat);
    });
  } else {
    await Promise.all(
      fileDir.map(async (item: IFileDirStat) => {
        const stat = await getStat(item.path);
        if (stat.isDirectory()) {
          const arr = await getFiles(item.path, options, []);
          files = files.concat(arr);
        } else if (stat.isFile()) {
          files.push(stat);
        }
      }),
    );
  }
  return files.filter((item) => {
    if (filter && typeof filter === 'function') {
      return filter(item);
    }
    return true;
  });
}

export const getStat = async (filepath: string): Promise<IFileDirStat> => {
  const stat = (await fs.promises.stat(filepath)) as IFileDirStat;
  stat.ext = '';
  if (stat.isFile()) {
    stat.ext = getExt(filepath);
    stat.name = path.basename(filepath);
    stat.path = path.resolve(filepath);
  }
  return stat;
};

/**
 * Get ext
 * @param {String} filePath `/a/b.jpg` => `jpg`
 */
export const getExt = (filePath: string) => path.extname(filePath).replace(/^\./, '').toLowerCase();

/** CommonJS default export hack */
if (typeof module === 'object' && typeof module.exports === 'object') {
  module.exports = Object.assign(module.exports.default, module.exports);
}
