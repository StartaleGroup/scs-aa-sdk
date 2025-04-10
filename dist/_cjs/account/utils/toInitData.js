"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toInitData = void 0;
const toInitData = (mod) => {
    const module = mod.module || mod.address;
    const data = mod.initData || mod.data;
    if (!module || !data) {
        throw new Error("Module or data is missing");
    }
    return { module, data };
};
exports.toInitData = toInitData;
//# sourceMappingURL=toInitData.js.map