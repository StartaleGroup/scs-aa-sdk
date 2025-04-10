"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toInstallData = void 0;
const toInstallData = (mod) => {
    const address = mod.module || mod.address;
    const initData = mod.initData || mod.data;
    const deInitData = mod.deInitData || "0x";
    const type = mod.type || mod.moduleType;
    if (!address || !initData || !type) {
        throw new Error("address, type or data is missing");
    }
    return { address, initData, type, deInitData };
};
exports.toInstallData = toInstallData;
//# sourceMappingURL=toInstallData.js.map