"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isVersionNewer = exports.isVersionOlder = exports.versionMeetsRequirement = exports.semverCompare = void 0;
exports.getVersion = getVersion;
function getVersion() {
    try {
        const packageJson = require("../../../../package.json");
        return packageJson.version;
    }
    catch (error) {
        console.warn("Could not determine SDK version from package.json");
        return "unknown";
    }
}
const semverCompare = (a, b) => {
    const aParts = a.split(".").map((part) => Number.parseInt(part, 10));
    const bParts = b.split(".").map((part) => Number.parseInt(part, 10));
    const maxLength = Math.max(aParts.length, bParts.length);
    while (aParts.length < maxLength)
        aParts.push(0);
    while (bParts.length < maxLength)
        bParts.push(0);
    for (let i = 0; i < maxLength; i++) {
        if (aParts[i] !== bParts[i]) {
            return aParts[i] - bParts[i];
        }
    }
    return 0;
};
exports.semverCompare = semverCompare;
const versionMeetsRequirement = (currentVersion, requiredVersion) => {
    const comparison = (0, exports.semverCompare)(currentVersion, requiredVersion);
    return comparison >= 0;
};
exports.versionMeetsRequirement = versionMeetsRequirement;
const isVersionOlder = (currentVersion, referenceVersion) => {
    const comparison = (0, exports.semverCompare)(currentVersion, referenceVersion);
    return comparison < 0;
};
exports.isVersionOlder = isVersionOlder;
const isVersionNewer = (currentVersion, referenceVersion) => {
    const comparison = (0, exports.semverCompare)(currentVersion, referenceVersion);
    return comparison > 0;
};
exports.isVersionNewer = isVersionNewer;
//# sourceMappingURL=getVersion.js.map