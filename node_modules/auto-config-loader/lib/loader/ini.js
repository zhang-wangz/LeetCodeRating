"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.iniLoader = iniLoader;
const ini_1 = __importDefault(require("ini"));
function iniLoader(_, content) {
    return ini_1.default.parse(content);
}
