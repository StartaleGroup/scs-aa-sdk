"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSetThresholdTx = exports.getRemoveOwnerTx = exports.getAddOwnerTx = exports.getThreshold = exports.getOwners = exports.setThreshold = exports.removeOwner = exports.addOwner = exports.multiSign = exports.prepareForMultiSign = exports.ownableReads = exports.ownableCalls = void 0;
exports.ownableActions = ownableActions;
const addOwner_1 = require("./addOwner.js");
Object.defineProperty(exports, "addOwner", { enumerable: true, get: function () { return addOwner_1.addOwner; } });
const getAddOwnerTx_1 = require("./getAddOwnerTx.js");
Object.defineProperty(exports, "getAddOwnerTx", { enumerable: true, get: function () { return getAddOwnerTx_1.getAddOwnerTx; } });
const getOwners_1 = require("./getOwners.js");
Object.defineProperty(exports, "getOwners", { enumerable: true, get: function () { return getOwners_1.getOwners; } });
const getRemoveOwnerTx_1 = require("./getRemoveOwnerTx.js");
Object.defineProperty(exports, "getRemoveOwnerTx", { enumerable: true, get: function () { return getRemoveOwnerTx_1.getRemoveOwnerTx; } });
const getSetThresholdTx_1 = require("./getSetThresholdTx.js");
Object.defineProperty(exports, "getSetThresholdTx", { enumerable: true, get: function () { return getSetThresholdTx_1.getSetThresholdTx; } });
const getThreshold_1 = require("./getThreshold.js");
Object.defineProperty(exports, "getThreshold", { enumerable: true, get: function () { return getThreshold_1.getThreshold; } });
const multiSign_1 = require("./multiSign.js");
Object.defineProperty(exports, "multiSign", { enumerable: true, get: function () { return multiSign_1.multiSign; } });
const prepareForMultiSign_1 = require("./prepareForMultiSign.js");
Object.defineProperty(exports, "prepareForMultiSign", { enumerable: true, get: function () { return prepareForMultiSign_1.prepareForMultiSign; } });
const removeOwner_1 = require("./removeOwner.js");
Object.defineProperty(exports, "removeOwner", { enumerable: true, get: function () { return removeOwner_1.removeOwner; } });
const setThreshold_1 = require("./setThreshold.js");
Object.defineProperty(exports, "setThreshold", { enumerable: true, get: function () { return setThreshold_1.setThreshold; } });
function ownableActions() {
    return (client) => {
        return {
            prepareForMultiSign: async (args) => {
                return await (0, prepareForMultiSign_1.prepareForMultiSign)(client, args);
            },
            multiSign: async (args) => {
                return await (0, multiSign_1.multiSign)(client, args);
            },
            getThreshold: (args) => {
                return (0, getThreshold_1.getThreshold)(client, args);
            },
            getAddOwnerTx: (args) => {
                return (0, getAddOwnerTx_1.getAddOwnerTx)(client, args);
            },
            getOwners: (args) => {
                return (0, getOwners_1.getOwners)(client, args);
            },
            getSetThresholdTx: (args) => {
                return (0, getSetThresholdTx_1.getSetThresholdTx)(client, args);
            },
            getRemoveOwnerTx: (args) => {
                return (0, getRemoveOwnerTx_1.getRemoveOwnerTx)(client, args);
            },
            addOwner: (args) => {
                return (0, addOwner_1.addOwner)(client, args);
            },
            removeOwner: (args) => {
                return (0, removeOwner_1.removeOwner)(client, args);
            },
            setThreshold: (args) => {
                return (0, setThreshold_1.setThreshold)(client, args);
            }
        };
    };
}
exports.ownableCalls = {
    toAddOwnerCalls: getAddOwnerTx_1.toAddOwnerCalls,
    toSetThresholdCalls: getSetThresholdTx_1.toSetThresholdCalls,
    toRemoveOwnerCalls: getRemoveOwnerTx_1.toRemoveOwnerCalls
};
exports.ownableReads = {
    toGetOwnersReads: getOwners_1.getOwners,
    toGetThresholdReads: getThreshold_1.getThreshold
};
//# sourceMappingURL=index.js.map