"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomChain = exports.stringOrStringsToArray = exports.getChain = void 0;
const chains = require("viem/chains");
const CUSTOM_CHAINS = [
    {
        id: 81_457,
        name: "Blast",
        nativeCurrency: {
            decimals: 18,
            name: "Ethereum",
            symbol: "ETH"
        },
        rpcUrls: {
            public: { http: ["https://rpc.blast.io"] },
            default: { http: ["https://rpc.blast.io"] }
        },
        blockExplorers: {
            etherscan: { name: "Blastscan", url: "https://blastscan.io/" },
            default: { name: "Blastscan", url: "https://blastscan.io/" }
        },
        contracts: {
            multicall3: {
                address: "0xca11bde05977b3631167028862be2a173976ca11",
                blockCreated: 88_189
            }
        }
    }
];
const getChain = (chainId) => {
    const allChains = [...Object.values(chains), ...CUSTOM_CHAINS];
    for (const chain of allChains) {
        if (Number(chain.id) === Number(chainId)) {
            return chain;
        }
    }
    throw new Error(`Chain ${chainId} not found. Please add a customChain into your config using the getCustomChain(...) helper`);
};
exports.getChain = getChain;
const stringOrStringsToArray = (str) => Array.isArray(str) ? str : [str];
exports.stringOrStringsToArray = stringOrStringsToArray;
const getCustomChain = (name, id, rpcUrl, blockExplorer, nativeCurrency, contracts, testnet = true) => {
    const chain = {
        testnet,
        id,
        name,
        nativeCurrency: nativeCurrency ?? {
            decimals: 18,
            name: "Ethereum",
            symbol: "ETH"
        },
        rpcUrls: {
            default: { http: (0, exports.stringOrStringsToArray)(rpcUrl) }
        },
        blockExplorers: {
            default: {
                name: "Explorer",
                url: blockExplorer ? (0, exports.stringOrStringsToArray)(blockExplorer)[0] : ""
            }
        },
        ...((contracts && { contracts }) || {})
    };
    return chain;
};
exports.getCustomChain = getCustomChain;
//# sourceMappingURL=getChain.js.map