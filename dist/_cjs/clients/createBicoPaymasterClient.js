"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBicoPaymasterClient = exports.toBiconomyTokenPaymasterContext = exports.toBiconomySponsoredPaymasterContext = exports.biconomySponsoredPaymasterContext = void 0;
const viem_1 = require("viem");
const account_abstraction_1 = require("viem/account-abstraction");
const tokenPaymaster_1 = require("./decorators/tokenPaymaster/index.js");
exports.biconomySponsoredPaymasterContext = {
    mode: "SPONSORED",
    expiryDuration: 300,
    calculateGasLimits: true,
    sponsorshipInfo: {
        smartAccountInfo: {
            name: "BICONOMY",
            version: "2.0.0"
        }
    }
};
const toBiconomySponsoredPaymasterContext = (params) => {
    return {
        ...exports.biconomySponsoredPaymasterContext,
        ...params
    };
};
exports.toBiconomySponsoredPaymasterContext = toBiconomySponsoredPaymasterContext;
const toBiconomyTokenPaymasterContext = (params) => {
    const { feeTokenAddress, expiryDuration, calculateGasLimits } = params;
    return {
        mode: "ERC20",
        sponsorshipInfo: {
            smartAccountInfo: {
                name: "BICONOMY",
                version: "2.0.0"
            }
        },
        tokenInfo: {
            feeTokenAddress
        },
        expiryDuration: expiryDuration ?? 6000,
        calculateGasLimits: calculateGasLimits ?? true
    };
};
exports.toBiconomyTokenPaymasterContext = toBiconomyTokenPaymasterContext;
const createBicoPaymasterClient = (parameters) => {
    const defaultedTransport = parameters.transport
        ? parameters.transport
        : parameters.paymasterUrl
            ? (0, viem_1.http)(parameters.paymasterUrl)
            : (0, viem_1.http)(`https://paymaster.biconomy.io/api/v2/${parameters.chainId}/${parameters.apiKey}`);
    const { getPaymasterStubData, ...paymasterClient } = (0, account_abstraction_1.createPaymasterClient)({
        ...parameters,
        transport: defaultedTransport
    }).extend((0, tokenPaymaster_1.bicoTokenPaymasterActions)());
    return paymasterClient;
};
exports.createBicoPaymasterClient = createBicoPaymasterClient;
//# sourceMappingURL=createBicoPaymasterClient.js.map