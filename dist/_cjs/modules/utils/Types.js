"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moduleTypeIds = exports.SafeHookType = void 0;
var SafeHookType;
(function (SafeHookType) {
    SafeHookType[SafeHookType["GLOBAL"] = 0] = "GLOBAL";
    SafeHookType[SafeHookType["SIG"] = 1] = "SIG";
})(SafeHookType || (exports.SafeHookType = SafeHookType = {}));
exports.moduleTypeIds = {
    validator: 1,
    executor: 2,
    fallback: 3,
    hook: 4
};
//# sourceMappingURL=Types.js.map