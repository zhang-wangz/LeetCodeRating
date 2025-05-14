"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Locations = void 0;
/**
 * Find the last index of the array that is less than or equal to the value.
 */
function sortedLastIndex(array, value) {
    let low = 0;
    let high = array.length;
    while (low < high) {
        const mid = (low + high) >>> 1;
        const val = array[mid];
        if (val === value)
            return mid + 1;
        if (val < value) {
            low = mid + 1;
        }
        else {
            high = mid;
        }
    }
    return low;
}
/**
 * A class for getting lines and columns location.
 */
class Locations {
    constructor() {
        this.offsets = [];
    }
    addOffset(offset) {
        // Check for dupe offset
        for (let i = this.offsets.length - 1; i >= 0; i--) {
            const element = this.offsets[i];
            if (element === offset)
                return;
            if (element < offset)
                break;
        }
        this.offsets.push(offset);
    }
    /**
     * Calculate the location of the given index.
     * @param index The index to calculate their location.
     * @returns The location of the index.
     */
    getLocFromIndex(offset) {
        const line = sortedLastIndex(this.offsets, offset) + 1;
        const column = offset - (line === 1 ? 0 : this.offsets[line - 2]);
        return { line, column };
    }
}
exports.Locations = Locations;
