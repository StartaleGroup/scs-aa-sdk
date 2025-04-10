"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStartaleAccountAddress = void 0;
const viem_1 = require("viem");
const constants_1 = require("../../constants/index.js");
const AccountFactory_1 = require("../../constants/abi/AccountFactory.js");
const getStartaleAccountAddress = async (params) => {
    const { publicClient, initData, factoryAddress = constants_1.ACCOUNT_FACTORY_ADDRESS, index = 0n } = params;
    const salt = (0, viem_1.pad)((0, viem_1.toHex)(index), { size: 32 });
    return await publicClient.readContract({
        address: factoryAddress,
        abi: AccountFactory_1.AccountFactoryAbi,
        functionName: "computeAccountAddress",
        args: [initData, salt]
    });
};
exports.getStartaleAccountAddress = getStartaleAccountAddress;
//# sourceMappingURL=getStartaleAccountAddress.js.map