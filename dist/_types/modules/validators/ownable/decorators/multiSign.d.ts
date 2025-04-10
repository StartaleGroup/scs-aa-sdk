import type { Chain, Client, Hex, Transport } from "viem";
import { type UserOperation } from "viem/account-abstraction";
import type { ModularSmartAccount } from "../../../utils/Types";
export type MultiSignParameters<TModularSmartAccount> = {
    signatures: Hex[];
    userOp: UserOperation<"0.7", bigint>;
} & {
    account?: TModularSmartAccount;
};
export declare function multiSign<TModularSmartAccount extends ModularSmartAccount | undefined>(client: Client<Transport, Chain | undefined, TModularSmartAccount>, parameters: MultiSignParameters<TModularSmartAccount>): Promise<Hex>;
//# sourceMappingURL=multiSign.d.ts.map