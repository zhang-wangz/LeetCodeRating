"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTOMLVer = void 0;
class TOMLVerImpl {
    constructor(major, minor) {
        this.major = major;
        this.minor = minor;
    }
    lt(major, minor) {
        return this.major < major || (this.major === major && this.minor < minor);
    }
    gte(major, minor) {
        return this.major > major || (this.major === major && this.minor >= minor);
    }
}
const TOML_VERSION_1_0 = new TOMLVerImpl(1, 0);
const TOML_VERSION_1_1 = new TOMLVerImpl(1, 1);
const DEFAULT_TOML_VERSION = TOML_VERSION_1_0;
const SUPPORTED_TOML_VERSIONS = {
    "1.0": TOML_VERSION_1_0,
    "1.0.0": TOML_VERSION_1_0,
    "1.1": TOML_VERSION_1_1,
    "1.1.0": TOML_VERSION_1_1,
    latest: TOML_VERSION_1_0,
    next: TOML_VERSION_1_1,
};
/**
 * Get TOML version object from given TOML version string.
 */
function getTOMLVer(v) {
    return SUPPORTED_TOML_VERSIONS[v || "latest"] || DEFAULT_TOML_VERSION;
}
exports.getTOMLVer = getTOMLVer;
