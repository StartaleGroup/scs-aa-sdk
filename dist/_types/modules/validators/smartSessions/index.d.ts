export * from "./Helpers";
export * from "./Types";
export * from "./toSmartSessionsModule";
export * from "./decorators";
export declare const smartSessionCalls: {
    readonly toDisableActionPoliciesCalls: (_: import("../..").ModularSmartAccount, parameters: {
        permissionId: import("viem").Hex;
        actionId: import("viem").Hex;
        policies: import("abitype").Address[];
    }) => Promise<import("../../..").Call[]>;
    readonly toDisableERC1271PoliciesCalls: (_: import("../..").ModularSmartAccount, parameters: {
        permissionId: import("viem").Hex;
        policies: import("abitype").Address[];
        contents: import("@rhinestone/module-sdk").ERC7739Context[];
    }) => Promise<import("../../..").Call[]>;
    readonly toDisableUserOpPoliciesCalls: (_: import("../..").ModularSmartAccount, parameters: {
        permissionId: import("viem").Hex;
        userOpPolicies: import("abitype").Address[];
    }) => Promise<import("../../..").Call[]>;
    readonly toEnableActionPoliciesCalls: (_: import("../..").ModularSmartAccount, parameters: {
        permissionId: import("viem").Hex;
        actionPolicies: import("@rhinestone/module-sdk").ActionData[];
    }) => Promise<import("../../..").Call[]>;
    readonly toEnableERC1271PoliciesCalls: (_: import("../..").ModularSmartAccount, parameters: {
        permissionId: import("viem").Hex;
        erc1271Policies: import("@rhinestone/module-sdk").ERC7739Data;
    }) => Promise<import("../../..").Call[]>;
    readonly toEnableUserOpPoliciesCalls: (_: import("../..").ModularSmartAccount, parameters: {
        permissionId: import("viem").Hex;
        userOpPolicies: import("@rhinestone/module-sdk").PolicyData[];
    }) => Promise<import("../../..").Call[]>;
    readonly toRemoveSessionCalls: (_: import("../..").ModularSmartAccount, parameters: {
        permissionId: import("viem").Hex;
    }) => Promise<import("../../..").Call[]>;
    readonly toEnableSessionsCalls: (_: import("../..").ModularSmartAccount, parameters: {
        sessions: import("@rhinestone/module-sdk").Session[];
    }) => Promise<import("../../..").Call[]>;
};
//# sourceMappingURL=index.d.ts.map