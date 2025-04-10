"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllowance = exports.safeMultiplier = exports.getTenderlyDetails = exports.playgroundTrue = exports.inProduction = exports.getAccountDomainStructFields = exports.eip712WrapHash = exports.getAccountMeta = exports.wrapSignatureWith6492 = exports.addressEquals = exports.isValidRpcUrl = exports.isNullOrUndefined = void 0;
exports.percentage = percentage;
exports.convertToFactor = convertToFactor;
exports.makeInstallDataAndHash = makeInstallDataAndHash;
exports._hashTypedData = _hashTypedData;
exports.getTypesForEIP712Domain = getTypesForEIP712Domain;
exports.typeToString = typeToString;
exports.bigIntReplacer = bigIntReplacer;
exports.numberTo3Bytes = numberTo3Bytes;
exports.toHexString = toHexString;
exports.parseRequestArguments = parseRequestArguments;
const viem_1 = require("viem");
const Constants_1 = require("../../account/utils/Constants.js");
const abi_1 = require("../../constants/abi/index.js");
const Types_1 = require("../../modules/utils/Types.js");
const isNullOrUndefined = (value) => {
    return value === null || value === undefined;
};
exports.isNullOrUndefined = isNullOrUndefined;
const isValidRpcUrl = (url) => {
    const regex = /^(http:\/\/|wss:\/\/|https:\/\/).*/;
    return regex.test(url);
};
exports.isValidRpcUrl = isValidRpcUrl;
const addressEquals = (a, b) => !!a && !!b && a?.toLowerCase() === b.toLowerCase();
exports.addressEquals = addressEquals;
const wrapSignatureWith6492 = ({ factoryAddress, factoryCalldata, signature }) => {
    return (0, viem_1.concat)([
        (0, viem_1.encodeAbiParameters)((0, viem_1.parseAbiParameters)("address, bytes, bytes"), [
            factoryAddress,
            factoryCalldata,
            signature
        ]),
        "0x6492649264926492649264926492649264926492649264926492649264926492"
    ]);
};
exports.wrapSignatureWith6492 = wrapSignatureWith6492;
function percentage(partialValue, totalValue) {
    return (100 * partialValue) / totalValue;
}
function convertToFactor(percentage) {
    if (percentage) {
        if (percentage < 1 || percentage > 100) {
            throw new Error("The percentage value should be between 1 and 100.");
        }
        const factor = percentage / 100 + 1;
        return factor;
    }
    return 1;
}
function makeInstallDataAndHash(accountOwner, modules, domainName = Constants_1.ACCOUNT_DOMAIN_NAME, domainVersion = Constants_1.ACCOUNT_DOMAIN_VERSION) {
    const types = modules.map((module) => BigInt(Types_1.moduleTypeIds[module.type]));
    const initDatas = modules.map((module) => (0, viem_1.toHex)((0, viem_1.concat)([(0, viem_1.toBytes)(BigInt(Types_1.moduleTypeIds[module.type])), module.config])));
    const multiInstallData = (0, viem_1.encodeAbiParameters)([{ type: "uint256[]" }, { type: "bytes[]" }], [types, initDatas]);
    const structHash = (0, viem_1.keccak256)((0, viem_1.encodeAbiParameters)([{ type: "bytes32" }, { type: "address" }, { type: "bytes32" }], [
        Constants_1.MODULE_ENABLE_MODE_TYPE_HASH,
        Constants_1.MOCK_MULTI_MODULE_ADDRESS,
        (0, viem_1.keccak256)(multiInstallData)
    ]));
    const hashToSign = _hashTypedData(structHash, domainName, domainVersion, accountOwner);
    return [multiInstallData, hashToSign];
}
function _hashTypedData(structHash, name, version, verifyingContract) {
    const DOMAIN_SEPARATOR = (0, viem_1.keccak256)((0, viem_1.encodeAbiParameters)([
        { type: "bytes32" },
        { type: "bytes32" },
        { type: "bytes32" },
        { type: "address" }
    ], [
        (0, viem_1.keccak256)((0, viem_1.stringToBytes)(Constants_1.ACCOUNT_DOMAIN_TYPEHASH)),
        (0, viem_1.keccak256)((0, viem_1.stringToBytes)(name)),
        (0, viem_1.keccak256)((0, viem_1.stringToBytes)(version)),
        verifyingContract
    ]));
    return (0, viem_1.keccak256)((0, viem_1.concat)([
        (0, viem_1.stringToBytes)("\x19\x01"),
        (0, viem_1.hexToBytes)(DOMAIN_SEPARATOR),
        (0, viem_1.hexToBytes)(structHash)
    ]));
}
function getTypesForEIP712Domain({ domain }) {
    return [
        typeof domain?.name === "string" && { name: "name", type: "string" },
        domain?.version && { name: "version", type: "string" },
        typeof domain?.chainId === "number" && {
            name: "chainId",
            type: "uint256"
        },
        domain?.verifyingContract && {
            name: "verifyingContract",
            type: "address"
        },
        domain?.salt && { name: "salt", type: "bytes32" }
    ].filter(Boolean);
}
const getAccountMeta = async (client, accountAddress) => {
    try {
        const domain = await client.request({
            method: "eth_call",
            params: [
                {
                    to: accountAddress,
                    data: (0, viem_1.encodeFunctionData)({
                        abi: abi_1.EIP1271Abi,
                        functionName: "eip712Domain"
                    })
                },
                "latest"
            ]
        });
        if (domain !== "0x") {
            const decoded = (0, viem_1.decodeFunctionResult)({
                abi: abi_1.EIP1271Abi,
                functionName: "eip712Domain",
                data: domain
            });
            return {
                name: decoded?.[1],
                version: decoded?.[2],
                chainId: decoded?.[3]
            };
        }
    }
    catch (error) { }
    return {
        name: Constants_1.ACCOUNT_DOMAIN_NAME,
        version: Constants_1.ACCOUNT_DOMAIN_VERSION,
        chainId: client.chain
            ? BigInt(client.chain.id)
            : BigInt(await client.extend(viem_1.publicActions).getChainId())
    };
};
exports.getAccountMeta = getAccountMeta;
const eip712WrapHash = (typedHash, appDomainSeparator) => (0, viem_1.keccak256)((0, viem_1.concat)(["0x1901", appDomainSeparator, typedHash]));
exports.eip712WrapHash = eip712WrapHash;
function typeToString(typeDef) {
    return Object.entries(typeDef).map(([key, fields]) => {
        const fieldStrings = (fields ?? [])
            .map((field) => `${field.type} ${field.name}`)
            .join(",");
        return `${key}(${fieldStrings})`;
    });
}
function bigIntReplacer(_key, value) {
    return typeof value === "bigint" ? value.toString() : value;
}
function numberTo3Bytes(key) {
    const buffer = new Uint8Array(3);
    buffer[0] = Number((key >> 16n) & 0xffn);
    buffer[1] = Number((key >> 8n) & 0xffn);
    buffer[2] = Number(key & 0xffn);
    return buffer;
}
function toHexString(byteArray) {
    return Array.from(byteArray)
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
}
const getAccountDomainStructFields = async (publicClient, accountAddress) => {
    const accountDomainStructFields = (await publicClient.readContract({
        address: accountAddress,
        abi: (0, viem_1.parseAbi)([
            "function eip712Domain() public view returns (bytes1 fields, string memory name, string memory version, uint256 chainId, address verifyingContract, bytes32 salt, uint256[] memory extensions)"
        ]),
        functionName: "eip712Domain"
    }));
    const [, name, version, chainId, verifyingContract, salt] = accountDomainStructFields;
    const params = (0, viem_1.parseAbiParameters)([
        "bytes32",
        "bytes32",
        "uint256",
        "address",
        "bytes32"
    ]);
    return (0, viem_1.encodeAbiParameters)(params, [
        (0, viem_1.keccak256)((0, viem_1.toBytes)(name)),
        (0, viem_1.keccak256)((0, viem_1.toBytes)(version)),
        chainId,
        verifyingContract,
        salt
    ]);
};
exports.getAccountDomainStructFields = getAccountDomainStructFields;
const inProduction = () => {
    try {
        return process?.env?.environment === "production";
    }
    catch (e) {
        return true;
    }
};
exports.inProduction = inProduction;
const playgroundTrue = () => {
    try {
        return process?.env?.RUN_PLAYGROUND === "true";
    }
    catch (e) {
        return false;
    }
};
exports.playgroundTrue = playgroundTrue;
const getTenderlyDetails = () => {
    try {
        const accountSlug = process?.env?.TENDERLY_ACCOUNT_SLUG;
        const projectSlug = process?.env?.TENDERLY_PROJECT_SLUG;
        const apiKey = process?.env?.TENDERLY_API_KEY;
        if (!accountSlug || !projectSlug || !apiKey) {
            return null;
        }
        return {
            accountSlug,
            projectSlug,
            apiKey
        };
    }
    catch (e) {
        return null;
    }
};
exports.getTenderlyDetails = getTenderlyDetails;
const safeMultiplier = (bI, multiplier) => BigInt(Math.round(Number(bI) * multiplier));
exports.safeMultiplier = safeMultiplier;
const getAllowance = async (client, owner, tokenAddress, grantee = Constants_1.BICONOMY_TOKEN_PAYMASTER) => {
    const approval = await client.readContract({
        address: tokenAddress,
        abi: viem_1.erc20Abi,
        functionName: "allowance",
        args: [owner, grantee]
    });
    return approval;
};
exports.getAllowance = getAllowance;
function parseRequestArguments(input) {
    const fieldsToOmit = [
        "callGasLimit",
        "preVerificationGas",
        "maxFeePerGas",
        "maxPriorityFeePerGas",
        "paymasterAndData",
        "verificationGasLimit"
    ];
    const argsString = input.slice(1).join("");
    const lines = argsString.split("\n").filter((line) => line.trim());
    const result = lines.reduce((acc, line) => {
        const [key, value] = line.split(":").map((s) => s.trim());
        const cleanKey = key.trim();
        const cleanValue = value.replace("gwei", "").trim();
        if (fieldsToOmit.includes(cleanKey)) {
            return acc;
        }
        acc[cleanKey] = cleanValue;
        return acc;
    }, {});
    return result;
}
//# sourceMappingURL=Utils.js.map