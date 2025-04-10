"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.grantPermission = exports.usePermission = void 0;
exports.smartSessionActions = smartSessionActions;
const grantPermission_1 = require("./grantPermission.js");
Object.defineProperty(exports, "grantPermission", { enumerable: true, get: function () { return grantPermission_1.grantPermission; } });
const usePermission_1 = require("./usePermission.js");
Object.defineProperty(exports, "usePermission", { enumerable: true, get: function () { return usePermission_1.usePermission; } });
function smartSessionActions() {
    return (client) => ({
        usePermission: (args) => (0, usePermission_1.usePermission)(client, args),
        grantPermission: (args) => (0, grantPermission_1.grantPermission)(client, args)
    });
}
//# sourceMappingURL=index.js.map