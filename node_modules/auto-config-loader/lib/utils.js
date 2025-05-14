"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findConfigFile = findConfigFile;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
function findConfigFile(moduleName, root, searchPlaces = []) {
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
        const filePath = path_1.default.resolve(root, file);
        if (fs_1.default.existsSync(filePath)) {
            return filePath;
        }
    }
    return null;
}
