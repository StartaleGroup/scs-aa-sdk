"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGasFeeValues = void 0;
const viem_1 = require("viem");
const PRIORITY_FEE_FLOOR = {
    1: 1000000000n
};
const resolveRpcClient = (accountClient) => {
    const attached = accountClient.client;
    if (attached)
        return attached;
    const rpcUrl = accountClient.chain?.rpcUrls.default.http[0];
    if (!rpcUrl) {
        throw new Error("getGasFeeValues: no chain RPC URL available — pass a publicClient via the client option");
    }
    return (0, viem_1.createPublicClient)({ chain: accountClient.chain, transport: (0, viem_1.http)(rpcUrl) });
};
const applyFloorAndBuild = (baseFee, rawPriorityFee, chainId) => {
    const floor = PRIORITY_FEE_FLOOR[chainId] ?? 0n;
    const priorityFee = rawPriorityFee < floor ? floor : rawPriorityFee;
    const maxFeePerGas = baseFee * 2n + priorityFee;
    return {
        slow: { maxFeePerGas, maxPriorityFeePerGas: priorityFee },
        standard: { maxFeePerGas, maxPriorityFeePerGas: priorityFee },
        fast: { maxFeePerGas, maxPriorityFeePerGas: priorityFee }
    };
};
const getGasFeeValues = async (client) => {
    const accountClient = client;
    const chainId = accountClient.chain?.id ?? 0;
    const bundlerUrl = client.transport.url ?? "";
    if (bundlerUrl.includes("pimlico")) {
        const fees = (await client.request({
            method: "pimlico_getUserOperationGasPrice",
            params: []
        }));
        return {
            slow: {
                maxFeePerGas: BigInt(fees.slow.maxFeePerGas),
                maxPriorityFeePerGas: BigInt(fees.slow.maxPriorityFeePerGas)
            },
            standard: {
                maxFeePerGas: BigInt(fees.standard.maxFeePerGas),
                maxPriorityFeePerGas: BigInt(fees.standard.maxPriorityFeePerGas)
            },
            fast: {
                maxFeePerGas: BigInt(fees.fast.maxFeePerGas),
                maxPriorityFeePerGas: BigInt(fees.fast.maxPriorityFeePerGas)
            }
        };
    }
    if (bundlerUrl.includes("alchemy")) {
        const rpcClient = resolveRpcClient(accountClient);
        const [priorityFeeHex, block] = await Promise.all([
            client.request({ method: "rundler_maxPriorityFeePerGas", params: [] }),
            rpcClient.getBlock({ blockTag: "latest" })
        ]);
        return applyFloorAndBuild(block.baseFeePerGas ?? 1n, BigInt(priorityFeeHex), chainId);
    }
    const rpcClient = resolveRpcClient(accountClient);
    const [block, priorityFee] = await Promise.all([
        rpcClient.getBlock({ blockTag: "latest" }),
        rpcClient.estimateMaxPriorityFeePerGas()
    ]);
    return applyFloorAndBuild(block.baseFeePerGas ?? 1n, priorityFee, chainId);
};
exports.getGasFeeValues = getGasFeeValues;
//# sourceMappingURL=getGasFeeValues.js.map