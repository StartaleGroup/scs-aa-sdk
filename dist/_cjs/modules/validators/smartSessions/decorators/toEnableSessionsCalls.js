"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toEnableSessionsCalls = void 0;
const module_sdk_1 = require("@rhinestone/module-sdk");
const toEnableSessionsCalls = async (_, parameters) => {
    const action = (0, module_sdk_1.getEnableSessionsAction)({ sessions: parameters.sessions });
    return [
        {
            to: action.target,
            value: BigInt(action.value.toString()),
            data: action.callData
        }
    ];
};
exports.toEnableSessionsCalls = toEnableSessionsCalls;
//# sourceMappingURL=toEnableSessionsCalls.js.map