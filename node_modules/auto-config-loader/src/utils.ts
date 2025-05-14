import path from 'path';
import fs from 'fs';

export function findConfigFile(moduleName: string, root: string, searchPlaces: string[] = []) {
  const data = [
    ...searchPlaces,
    `.${moduleName}rc`,
    `.${moduleName}rc.json`,
    `.${moduleName}rc.json5`,
    `.${moduleName}rc.jsonc`,
    `.${moduleName}rc.yaml`,
    `.${moduleName}rc.yml`,
    `.${moduleName}rc.toml`,
    `.${moduleName}rc.ini`,
    `.${moduleName}rc.js`,
    `.${moduleName}rc.ts`,
    `.${moduleName}rc.cjs`,
    `.${moduleName}rc.mjs`,
    `.config/${moduleName}rc`,
    `.config/${moduleName}rc.json`,
    `.config/${moduleName}rc.json5`,
    `.config/${moduleName}rc.jsonc`,
    `.config/${moduleName}rc.yaml`,
    `.config/${moduleName}rc.yml`,
    `.config/${moduleName}rc.toml`,
    `.config/${moduleName}rc.ini`,
    `.config/${moduleName}rc.js`,
    `.config/${moduleName}rc.ts`,
    `.config/${moduleName}rc.cjs`,
    `.config/${moduleName}rc.mjs`,
    `${moduleName}.config.js`,
    `${moduleName}.config.ts`,
    `${moduleName}.config.cjs`,
    `${moduleName}.config.mjs`,
  ];
  for (const file of data) {
    const filePath = path.resolve(root, file);
    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }

  return null;
}
