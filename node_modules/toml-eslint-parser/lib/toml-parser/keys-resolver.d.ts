import type { TOMLTable, TOMLTopLevelTable } from "../ast";
import type { Context } from "./context";
export declare class KeysResolver {
    private readonly rootKeys;
    private readonly tables;
    private readonly ctx;
    constructor(ctx: Context);
    applyResolveKeyForTable(node: TOMLTable): void;
    verifyDuplicateKeys(node: TOMLTopLevelTable): void;
}
