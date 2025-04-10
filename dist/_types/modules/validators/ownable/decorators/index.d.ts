import type { Address, Chain, Client, Hash, Hex, Transport } from "viem";
import type { Call } from "../../../../account/utils/Types";
import type { ModularSmartAccount } from "../../../utils/Types";
import { type AddOwnerParameters, addOwner } from "./addOwner";
import { getAddOwnerTx } from "./getAddOwnerTx";
import { type GetOwnersParameters, getOwners } from "./getOwners";
import { type GetRemoveOwnerTxParameters, getRemoveOwnerTx } from "./getRemoveOwnerTx";
import { type GetSetThresholdTxParameters, getSetThresholdTx } from "./getSetThresholdTx";
import { type GetThresholdParameters, getThreshold } from "./getThreshold";
import { type MultiSignParameters, multiSign } from "./multiSign";
import { type PrepareForMultiSignParameters, type PrepareForMultiSignPayload, prepareForMultiSign } from "./prepareForMultiSign";
import { type RemoveOwnerParameters, removeOwner } from "./removeOwner";
import { type SetThresholdParameters, setThreshold } from "./setThreshold";
export type OwnableActions<TModularSmartAccount extends ModularSmartAccount | undefined> = {
    getRemoveOwnerTx: (args: GetRemoveOwnerTxParameters<TModularSmartAccount>) => Promise<Call>;
    addOwner: (args: AddOwnerParameters<TModularSmartAccount>) => Promise<Hash>;
    removeOwner: (args: RemoveOwnerParameters<TModularSmartAccount>) => Promise<Hash>;
    setThreshold: (args: SetThresholdParameters<TModularSmartAccount>) => Promise<Hash>;
    getOwners: (args?: GetOwnersParameters<TModularSmartAccount>) => Promise<Address[]>;
    getSetThresholdTx: (args: GetSetThresholdTxParameters<TModularSmartAccount>) => Promise<Call>;
    getAddOwnerTx: (args: AddOwnerParameters<TModularSmartAccount>) => Promise<Call>;
    getThreshold: (args?: GetThresholdParameters<TModularSmartAccount>) => Promise<number>;
    multiSign: (args: MultiSignParameters<TModularSmartAccount>) => Promise<Hex>;
    prepareForMultiSign: (args: PrepareForMultiSignParameters<TModularSmartAccount>) => Promise<PrepareForMultiSignPayload>;
};
export declare function ownableActions(): <TModularSmartAccount extends ModularSmartAccount | undefined>(client: Client<Transport, Chain | undefined, TModularSmartAccount>) => OwnableActions<TModularSmartAccount>;
export declare const ownableCalls: {
    readonly toAddOwnerCalls: (account: ModularSmartAccount, parameters: import("./getAddOwnerTx").GetAddOwnerTxParameters<ModularSmartAccount | undefined>) => Promise<Call[]>;
    readonly toSetThresholdCalls: (account: ModularSmartAccount, parameters: GetSetThresholdTxParameters<ModularSmartAccount | undefined>) => Promise<Call[]>;
    readonly toRemoveOwnerCalls: (account: ModularSmartAccount, parameters: GetRemoveOwnerTxParameters<ModularSmartAccount | undefined>) => Promise<Call[]>;
};
export declare const ownableReads: {
    readonly toGetOwnersReads: typeof getOwners;
    readonly toGetThresholdReads: typeof getThreshold;
};
export { prepareForMultiSign, multiSign, addOwner, removeOwner, setThreshold, getOwners, getThreshold, getAddOwnerTx, getRemoveOwnerTx, getSetThresholdTx };
//# sourceMappingURL=index.d.ts.map