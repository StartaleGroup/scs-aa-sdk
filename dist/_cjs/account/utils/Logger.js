"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const Helpers_1 = require("./Helpers.js");
class Logger {
    static log(message, value = "") {
        const timestamp = new Date().toISOString();
        const logMessage = `\x1b[35m[${timestamp}]\x1b[0m \x1b[36m${message}\x1b[0m:`;
        if (Logger.isDebug) {
            console.log(logMessage, value === undefined ? "" : value);
        }
    }
    static warn(message, value = "") {
        const timestamp = new Date().toISOString();
        const warnMessage = `\x1b[35m[${timestamp}]\x1b[0m \x1b[33mWARN\x1b[0m: \x1b[36m${message}\x1b[0m`;
        if (Logger.isDebug) {
            console.warn(warnMessage, value === undefined ? "" : value);
        }
    }
    static error(message, value = "") {
        const timestamp = new Date().toISOString();
        const errorMessage = `\x1b[35m[${timestamp}]\x1b[0m \x1b[31mERROR\x1b[0m: \x1b[36m${message}\x1b[0m`;
        if (Logger.isDebug) {
            console.error(errorMessage, value === undefined ? "" : value);
        }
    }
}
exports.Logger = Logger;
Object.defineProperty(Logger, "isDebug", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (0, Helpers_1.isDebugging)()
});
//# sourceMappingURL=Logger.js.map