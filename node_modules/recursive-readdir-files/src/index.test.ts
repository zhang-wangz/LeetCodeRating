/// <reference types="jest" />

import path from 'path';
import recursiveReaddirFiles, { getStat } from './';

it('ignored test case', async () => {
  const files = await recursiveReaddirFiles(process.cwd(), {
    ignored: /\/(node_modules|coverage|\.git|\.husky)/,
  });
  expect(files.length).toBe(12);
  expect(Object.keys(files[0])).toEqual([
    'dev',
    'mode',
    'nlink',
    'uid',
    'gid',
    'rdev',
    'blksize',
    'ino',
    'size',
    'blocks',
    'atimeMs',
    'mtimeMs',
    'ctimeMs',
    'birthtimeMs',
    'atime',
    'mtime',
    'ctime',
    'birthtime',
    'ext',
    'name',
    'path',
  ]);
});

it('ignored/exclude/include test case', async () => {
  const files = await recursiveReaddirFiles(process.cwd(), {
    ignored: /\/(node_modules|coverage|\.git|\.husky)/,
    exclude: /(\.json)$/,
    include: /(package\.json)$/,
  });
  expect(files.length).toBe(9);
  expect(typeof files[0].isFile === 'function').toBeTruthy();
  const arrs = files.filter((item) => /package\.json$/.test(item.path)).map((item) => item.name);
  expect(arrs[0]).toEqual('package.json');

  const arrs2 = files.filter((item) => /renovate\.json$/.test(item.path)).map((item) => item.name);
  expect(arrs2.length).toEqual(0);
  expect(Object.keys(files[0])).toEqual([
    'dev',
    'mode',
    'nlink',
    'uid',
    'gid',
    'rdev',
    'blksize',
    'ino',
    'size',
    'blocks',
    'atimeMs',
    'mtimeMs',
    'ctimeMs',
    'birthtimeMs',
    'atime',
    'mtime',
    'ctime',
    'birthtime',
    'ext',
    'name',
    'path',
  ]);
});

it('Recursive Readdir Files, options', async () => {
  const files = await recursiveReaddirFiles(path.resolve(process.cwd(), 'lib'));
  expect(files.length).toBe(3);
});

it('Recursive Readdir Files, callback', async () => {
  const files = await recursiveReaddirFiles(path.resolve(process.cwd(), 'lib'), {}, (file, stat) => {
    // console.log(stat)
    expect(/(ts|js|js.map)$/.test(file)).toBeTruthy();
    expect(Object.keys(stat)).toEqual([
      'dev',
      'mode',
      'nlink',
      'uid',
      'gid',
      'rdev',
      'blksize',
      'ino',
      'size',
      'blocks',
      'atimeMs',
      'mtimeMs',
      'ctimeMs',
      'birthtimeMs',
      'atime',
      'mtime',
      'ctime',
      'birthtime',
      'ext',
      'name',
      'path',
    ]);
  });
  expect(files.length).toBe(0);
});

it('Recursive Readdir Files, callback', async () => {
  const files = await recursiveReaddirFiles(
    process.cwd(),
    {
      ignored: /\/(node_modules|coverage|\.git|\.husky)/,
      exclude: /(\.json)$/,
      include: /(package\.json)$/,
    },
    (file, stat) => {
      expect(typeof file === 'string').toBeTruthy();
      expect(typeof stat.isFile === 'function').toBeTruthy();
      expect(typeof stat.isDirectory === 'function').toBeTruthy();
    },
  );
  expect(files.length).toBe(0);
});

it('Recursive Readdir Files. try catch', async () => {
  try {
    // @ts-ignore
    const files = await recursiveReaddirFiles();
    expect(files.length).toBe(21);
  } catch (error) {
    expect(error.message).toEqual(
      'The "path" argument must be of type string or an instance of Buffer or URL. Received undefined',
    );
  }
});

it('filter options test case', async () => {
  const files = await recursiveReaddirFiles(process.cwd(), {
    ignored: /\/(node_modules|\.git|(coverage))/,
    filter: (item) => /(.md)/.test(item.path),
  });
  expect(files.length).toBe(1);
  expect(files[0].name).toEqual('README.md');
});

it('getStat test case', async () => {
  const stat = await getStat(path.resolve(process.cwd(), 'package.json'));
  expect(stat.ext).toEqual('json');
  expect(stat.name).toEqual('package.json');
  expect(stat.path.endsWith('package.json')).toBeTruthy();
});
