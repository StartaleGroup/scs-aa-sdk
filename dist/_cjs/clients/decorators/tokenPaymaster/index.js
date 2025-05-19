"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scsTokenPaymasterActions = void 0;
const getSupportedTokens_1 = require("./getSupportedTokens.js");
const getTokenPaymasterQuotes_1 = require("./getTokenPaymasterQuotes.js");
const scsTokenPaymasterActions = () => (client) => ({
    getTokenPaymasterQuotes: async (parameters) => (0, getTokenPaymasterQuotes_1.getTokenPaymasterQuotes)(client, parameters),
    getSupportedTokens: async (client) => (0, getSupportedTokens_1.getSupportedTokens)(client)
});
exports.scsTokenPaymasterActions = scsTokenPaymasterActions;
//# sourceMappingURL=index.js.map