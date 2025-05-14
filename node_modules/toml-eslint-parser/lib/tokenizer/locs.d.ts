type Location = {
    line: number;
    column: number;
};
/**
 * A class for getting lines and columns location.
 */
export declare class Locations {
    private readonly offsets;
    addOffset(offset: number): void;
    /**
     * Calculate the location of the given index.
     * @param index The index to calculate their location.
     * @returns The location of the index.
     */
    getLocFromIndex(offset: number): Location;
}
export {};
