import { getEnableSessionsAction } from "@rhinestone/module-sdk";
export const toEnableSessionsCalls = async (_, parameters) => {
    const action = getEnableSessionsAction({ sessions: parameters.sessions });
    return [
        {
            to: action.target,
            value: BigInt(action.value.toString()),
            data: action.callData
        }
    ];
};
//# sourceMappingURL=toEnableSessionsCalls.js.map