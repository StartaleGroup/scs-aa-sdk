"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSimulationUserOp = exports.DUMMY_SIMULATION_GAS = void 0;
exports.tenderlySimulation = tenderlySimulation;
const account_abstraction_1 = require("viem/account-abstraction");
const _1 = require("./index.js");
const constants_1 = require("../../constants/index.js");
const deepHexlify_1 = require("./deepHexlify.js");
exports.DUMMY_SIMULATION_GAS = {
    callGasLimit: 1000000n,
    verificationGasLimit: 1000000n,
    preVerificationGas: 1000000n,
    maxFeePerGas: 1000000n,
    maxPriorityFeePerGas: 1000000n
};
const getSimulationUserOp = (partialUserOp) => {
    const mergedUserOp = (0, deepHexlify_1.deepHexlify)({
        ...exports.DUMMY_SIMULATION_GAS,
        ...partialUserOp
    });
    return (0, account_abstraction_1.toPackedUserOperation)(mergedUserOp);
};
exports.getSimulationUserOp = getSimulationUserOp;
function tenderlySimulation(partialUserOp, chainId = 84532) {
    const tenderlyDetails = (0, _1.getTenderlyDetails)();
    if (!tenderlyDetails) {
        console.log("Tenderly details not found in environment variables. Please set TENDERLY_API_KEY, TENDERLY_ACCOUNT_SLUG, and TENDERLY_PROJECT_SLUG.");
        return null;
    }
    const tenderlyUrl = new URL(`https://dashboard.tenderly.co/${tenderlyDetails.accountSlug}/${tenderlyDetails.projectSlug}/simulator/new`);
    const packedUserOp = (0, exports.getSimulationUserOp)(partialUserOp);
    console.log({ packedUserOp });
    const params = new URLSearchParams();
    params.append("contractAddress", constants_1.ENTRY_POINT_ADDRESS);
    params.append("value", "0");
    params.append("network", chainId.toString());
    params.append("contractFunction", "0x765e827f");
    params.append("functionInputs", JSON.stringify([packedUserOp]));
    params.append("stateOverrides", JSON.stringify([
        {
            contractAddress: packedUserOp.sender,
            balance: "100000000000000000000"
        },
        {
            contractAddress: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
            balance: "100000000000000000000"
        }
    ]));
    tenderlyUrl.search = params.toString();
    return tenderlyUrl.toString();
}
//# sourceMappingURL=tenderlySimulation.js.map