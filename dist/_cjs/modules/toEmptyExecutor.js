"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toEmptyExecutor = void 0;
const viem_1 = require("viem");
const toEmptyExecutor = () => ({
    module: viem_1.zeroAddress,
    data: viem_1.zeroHash
});
exports.toEmptyExecutor = toEmptyExecutor;
//# sourceMappingURL=toEmptyExecutor.js.map