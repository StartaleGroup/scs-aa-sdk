"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomHex = void 0;
const generateRandomHex = () => {
    const hexChars = "0123456789abcdef";
    let result = "";
    for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * hexChars.length);
        result += hexChars[randomIndex];
    }
    return result;
};
exports.generateRandomHex = generateRandomHex;
//# sourceMappingURL=Uid.js.map