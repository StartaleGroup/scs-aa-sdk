import { type ActionData, type ERC7739Data, type PolicyData, getEnableSessionDetails } from "@rhinestone/module-sdk";
import { type Address, type Chain, type Client, type Hex, type Prettify, type RequiredBy, type Transport } from "viem";
import type { ModularSmartAccount } from "../../../utils/Types";
export type PrettifiedSession = {
    sessionValidator?: Address;
    sessionValidatorInitData?: Hex;
    salt?: Hex;
    permitERC4337Paymaster?: boolean;
    actions: ActionData[];
    chainId?: bigint;
    userOpPolicies?: PolicyData[];
    erc7739Policies?: ERC7739Data;
};
export type RequiredSessionParams = RequiredBy<Partial<PrettifiedSession>, "actions">;
export type GrantPermissionParameters<TModularSmartAccount extends ModularSmartAccount | undefined> = Prettify<RequiredSessionParams & {
    /** Granter Address */
    redeemer: Address;
} & {
    account?: TModularSmartAccount;
}>;
export type GrantPermissionResponse = Prettify<Omit<Awaited<ReturnType<typeof getEnableSessionDetails>>, "permissionEnableHash">>;
export declare function grantPermission<TModularSmartAccount extends ModularSmartAccount | undefined>(nexusClient: Client<Transport, Chain | undefined, TModularSmartAccount>, parameters: GrantPermissionParameters<TModularSmartAccount>): Promise<GrantPermissionResponse>;
//# sourceMappingURL=grantPermission.d.ts.map