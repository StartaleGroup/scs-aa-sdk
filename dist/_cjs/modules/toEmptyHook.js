"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toEmptyHook = void 0;
const viem_1 = require("viem");
const toEmptyHook = () => ({
    module: viem_1.zeroAddress,
    data: viem_1.zeroHash
});
exports.toEmptyHook = toEmptyHook;
//# sourceMappingURL=toEmptyHook.js.map