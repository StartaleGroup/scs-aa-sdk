"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeeScanLink = exports.getJiffyScanLink = exports.getExplorerTxLink = void 0;
const getChain_1 = require("./getChain.js");
const getExplorerTxLink = (hash, chain_) => {
    const chain = typeof chain_ === "number" || typeof chain_ === "string"
        ? (0, getChain_1.getChain)(Number(chain_))
        : chain_;
    return `${chain.blockExplorers?.default.url}/tx/${hash}`;
};
exports.getExplorerTxLink = getExplorerTxLink;
const getJiffyScanLink = (userOpHash) => {
    return `https://v2.jiffyscan.xyz/tx/${userOpHash}`;
};
exports.getJiffyScanLink = getJiffyScanLink;
const getMeeScanLink = (hash) => {
    return `https://meescan.biconomy.io/details/${hash}`;
};
exports.getMeeScanLink = getMeeScanLink;
//# sourceMappingURL=explorer.js.map