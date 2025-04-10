"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNexusSessionClient = exports.createNexusClient = exports.createSmartAccountClient = exports.createBicoBundlerClient = void 0;
const viem_1 = require("viem");
const account_abstraction_1 = require("viem/account-abstraction");
const createBicoPaymasterClient_1 = require("./createBicoPaymasterClient.js");
const bundler_1 = require("./decorators/bundler/index.js");
const getGasFeeValues_1 = require("./decorators/bundler/getGasFeeValues.js");
const erc7579_1 = require("./decorators/erc7579/index.js");
const smartAccount_1 = require("./decorators/smartAccount/index.js");
const createBicoBundlerClient = (parameters) => {
    const { mock = false, transport, bundlerUrl, apiKey, paymaster, paymasterContext, userOperation, chain } = parameters;
    if (!apiKey && !bundlerUrl && !transport && !chain) {
        throw new Error("Cannot set determine a bundler url, please provide a chain.");
    }
    const defaultedTransport = transport
        ? transport
        : bundlerUrl
            ? (0, viem_1.http)(bundlerUrl)
            : (0, viem_1.http)(`https://bundler.biconomy.io/api/v3/${chain?.id}/${apiKey ?? "nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f14"}`);
    const defaultedPaymasterContext = paymaster
        ? (paymasterContext ?? createBicoPaymasterClient_1.biconomySponsoredPaymasterContext)
        : undefined;
    const defaultedUserOperation = userOperation ?? {
        estimateFeesPerGas: async () => {
            return (await (0, getGasFeeValues_1.getGasFeeValues)(bundler_)).fast;
        }
    };
    const bundler_ = (0, account_abstraction_1.createBundlerClient)({
        ...parameters,
        transport: defaultedTransport,
        paymasterContext: defaultedPaymasterContext,
        userOperation: defaultedUserOperation
    })
        .extend((client) => ({ ...client, mock }))
        .extend((0, bundler_1.bicoBundlerActions)())
        .extend((0, erc7579_1.erc7579Actions)())
        .extend((0, smartAccount_1.smartAccountActions)());
    return bundler_;
};
exports.createBicoBundlerClient = createBicoBundlerClient;
exports.createSmartAccountClient = exports.createBicoBundlerClient;
exports.createNexusClient = exports.createSmartAccountClient;
exports.createNexusSessionClient = exports.createSmartAccountClient;
//# sourceMappingURL=createBicoBundlerClient.js.map