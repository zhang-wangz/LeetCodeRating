export type Range = [number, number];
export interface Position {
    /** >= 1 */
    line: number;
    /** >= 0 */
    column: number;
}
export interface SourceLocation {
    start: Position;
    end: Position;
}
export interface HasLocs {
    loc: SourceLocation;
    range: Range;
}
