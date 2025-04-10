import { addOwner } from "./addOwner.js";
import { getAddOwnerTx, toAddOwnerCalls } from "./getAddOwnerTx.js";
import { getOwners } from "./getOwners.js";
import { getRemoveOwnerTx, toRemoveOwnerCalls } from "./getRemoveOwnerTx.js";
import { getSetThresholdTx, toSetThresholdCalls } from "./getSetThresholdTx.js";
import { getThreshold } from "./getThreshold.js";
import { multiSign } from "./multiSign.js";
import { prepareForMultiSign } from "./prepareForMultiSign.js";
import { removeOwner } from "./removeOwner.js";
import { setThreshold } from "./setThreshold.js";
export function ownableActions() {
    return (client) => {
        return {
            prepareForMultiSign: async (args) => {
                return await prepareForMultiSign(client, args);
            },
            multiSign: async (args) => {
                return await multiSign(client, args);
            },
            getThreshold: (args) => {
                return getThreshold(client, args);
            },
            getAddOwnerTx: (args) => {
                return getAddOwnerTx(client, args);
            },
            getOwners: (args) => {
                return getOwners(client, args);
            },
            getSetThresholdTx: (args) => {
                return getSetThresholdTx(client, args);
            },
            getRemoveOwnerTx: (args) => {
                return getRemoveOwnerTx(client, args);
            },
            addOwner: (args) => {
                return addOwner(client, args);
            },
            removeOwner: (args) => {
                return removeOwner(client, args);
            },
            setThreshold: (args) => {
                return setThreshold(client, args);
            }
        };
    };
}
export const ownableCalls = {
    toAddOwnerCalls,
    toSetThresholdCalls,
    toRemoveOwnerCalls
};
export const ownableReads = {
    toGetOwnersReads: getOwners,
    toGetThresholdReads: getThreshold
};
export { prepareForMultiSign, multiSign, addOwner, removeOwner, setThreshold, getOwners, getThreshold, getAddOwnerTx, getRemoveOwnerTx, getSetThresholdTx };
//# sourceMappingURL=index.js.map