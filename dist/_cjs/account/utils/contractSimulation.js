"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contractSimulation = contractSimulation;
const viem_1 = require("viem");
const constants_1 = require("../../constants/index.js");
const getChain_1 = require("./getChain.js");
const tenderlySimulation_1 = require("./tenderlySimulation.js");
async function contractSimulation(partialUserOp, chainId) {
    const packed = (0, tenderlySimulation_1.getSimulationUserOp)(partialUserOp);
    return (0, viem_1.createPublicClient)({
        chain: (0, getChain_1.getChain)(chainId),
        transport: (0, viem_1.http)()
    }).simulateContract({
        account: partialUserOp.sender,
        address: constants_1.ENTRY_POINT_ADDRESS,
        abi: constants_1.EntrypointAbi,
        functionName: "handleOps",
        args: [[packed], packed.sender],
        stateOverride: [
            {
                address: partialUserOp.sender,
                balance: (0, viem_1.parseEther)("1000")
            }
        ]
    });
}
//# sourceMappingURL=contractSimulation.js.map