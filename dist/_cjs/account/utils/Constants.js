"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ACCOUNT_MODES = exports.EXECUTE_BATCH = exports.EXECUTE_SINGLE = exports.eip1271MagicValue = exports.PARENT_TYPEHASH = exports.ACCOUNT_DOMAIN_TYPEHASH = exports.ACCOUNT_DOMAIN_VERSION = exports.ACCOUNT_DOMAIN_NAME = exports.MODULE_TYPE_MULTI = exports.MOCK_MULTI_MODULE_ADDRESS = exports.MODULE_ENABLE_MODE_TYPE_HASH = exports.MODE_MODULE_ENABLE = exports.MODE_VALIDATION = exports.SENTINEL_ADDRESS = exports.GENERIC_FALLBACK_SELECTOR = exports.MODE_PAYLOAD = exports.UNUSED = exports.MODE_DEFAULT = exports.EXECTYPE_DELEGATE = exports.EXECTYPE_TRY = exports.EXECTYPE_DEFAULT = exports.CALLTYPE_BATCH = exports.CALLTYPE_SINGLE = exports.ERC20_ABI = exports.NATIVE_TOKEN_ALIAS = exports.ERROR_MESSAGES = exports.LargeGasLimit = exports.DefaultGasLimit = exports.ADDRESS_RESOLVER_ADDRESS = exports.PROXY_CREATION_CODE = exports.EIP1559_UNSUPPORTED_NETWORKS = exports.STARTALE_TOKEN_PAYMASTER = exports.ADDRESS_ZERO = void 0;
const viem_1 = require("viem");
exports.ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
exports.STARTALE_TOKEN_PAYMASTER = "0x00000000301515A5410e0d768aF4f53c416edf19";
exports.EIP1559_UNSUPPORTED_NETWORKS = [97, 56, 1442, 1101];
exports.PROXY_CREATION_CODE = "0x603d3d8160223d3973600966Ae45ad5BE4be08a70AD99e9cF41e6d6884B06F5155f3363d3d373d3d363d7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc545af43d6000803e6038573d6000fd5b3d6000f3";
exports.ADDRESS_RESOLVER_ADDRESS = "0x00000E81673606e07fC79CE5F1b3B26957844468";
exports.DefaultGasLimit = {
    callGasLimit: 800000n,
    verificationGasLimit: 1000000n,
    preVerificationGas: 100000n
};
exports.LargeGasLimit = {
    callGasLimit: 10000000n,
    verificationGasLimit: 15000000n,
    preVerificationGas: 1500000n
};
exports.ERROR_MESSAGES = {
    KEY_GEN_DATA_NOT_FOUND: "Key generation data is not available",
    SIGNATURE_NOT_FOUND: "Signature not found from Dan",
    FAILED_COMPUTE_ACCOUNT_ADDRESS: "Failed to compute account address. Possible reasons:\n" +
        "- The factory contract does not have the function 'computeAccountAddress'\n" +
        "- The parameters passed to the factory contract function may be invalid\n" +
        "- The provided factory address is not a contract",
    SIGNER_REQUIRED_FOR_CREATE_SESSION: "Signer is required",
    ACCOUNT_REQUIRED: "Account is required",
    MODULE_NOT_ACTIVATED: "Module not activated",
    SMART_SESSION_DATA_REQUIRED: "Data is required for using smart session module",
    MISSING_ACCOUNT_CONTRACT: 'The contract function "computeAccountAddress" returned no data ("0x")',
    INVALID_HEX: "Invalid hex, if you are targeting a number, consider using pad() and toHex() from viem: pad(toHex(BigInt(2000))",
    CONTRACT_NOT_DEPLOYED: "Address is not a contract. Make sure that the contract you are trying to use is deployed.",
    ACCOUNT_NOT_DEPLOYED: "Account has not yet been deployed",
    ACCOUNT_ALREADY_DEPLOYED: "Account already deployed",
    NO_NATIVE_TOKEN_BALANCE_DURING_DEPLOY: "Smart Account does not have sufficient funds to execute the User Operation.",
    SPENDER_REQUIRED: "spender is required for ERC20 mode",
    NO_FEE_QUOTE: "FeeQuote was not provided, please call smartAccount.getTokenFees() to get feeQuote",
    FAILED_FEE_QUOTE_FETCH: "Failed to fetch fee quote",
    CHAIN_NOT_FOUND: "Chain not found",
    NO_RECIPIENT: "Recipient is required",
    NATIVE_TOKEN_WITHDRAWAL_WITHOUT_AMOUNT: "'Amount' is required for withdrawal of native token without using a paymaster",
    MISSING_RPC_URL: "rpcUrl is required for this signer type, please provide it in the config",
    INVALID_SESSION_INDEXES: "Session indexes and transactions must be of the same length and correspond to each other",
    SIGNER_REQUIRED: "Signer is required for creating a smart account",
    UNKNOW_SESSION_ARGUMENTS: "You have not provided the necessary information to find and use a session"
};
exports.NATIVE_TOKEN_ALIAS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
exports.ERC20_ABI = [
    "function transfer(address to, uint256 value) external returns (bool)",
    "function transferFrom(address from, address to, uint256 value) external returns (bool)",
    "function approve(address spender, uint256 value) external returns (bool)",
    "function allowance(address owner, address spender) external view returns (uint256)",
    "function balanceOf(address owner) external view returns (uint256)",
    "function decimals() external view returns (uint8)"
];
exports.CALLTYPE_SINGLE = "0x00";
exports.CALLTYPE_BATCH = "0x01";
exports.EXECTYPE_DEFAULT = "0x00";
exports.EXECTYPE_TRY = "0x01";
exports.EXECTYPE_DELEGATE = "0xFF";
exports.MODE_DEFAULT = "0x00000000";
exports.UNUSED = "0x00000000";
exports.MODE_PAYLOAD = "0x00000000000000000000000000000000000000000000";
exports.GENERIC_FALLBACK_SELECTOR = "0xcb5baf0f";
exports.SENTINEL_ADDRESS = "0x0000000000000000000000000000000000000001";
exports.MODE_VALIDATION = "0x00";
exports.MODE_MODULE_ENABLE = "0x01";
exports.MODULE_ENABLE_MODE_TYPE_HASH = (0, viem_1.keccak256)((0, viem_1.toHex)("ModuleEnableMode(address module, bytes32 initDataHash)"));
exports.MOCK_MULTI_MODULE_ADDRESS = "0x9C992f91E7Cd4697B81E137007f446E826b8378b";
exports.MODULE_TYPE_MULTI = 0;
exports.ACCOUNT_DOMAIN_NAME = "Startale";
exports.ACCOUNT_DOMAIN_VERSION = "0.0.1";
exports.ACCOUNT_DOMAIN_TYPEHASH = "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)";
exports.PARENT_TYPEHASH = "TypedDataSign(Contents contents,string name,string version,uint256 chainId,address verifyingContract,bytes32 salt)Contents(bytes32 stuff)";
exports.eip1271MagicValue = "0x1626ba7e";
exports.EXECUTE_SINGLE = (0, viem_1.concat)([
    exports.CALLTYPE_SINGLE,
    exports.EXECTYPE_DEFAULT,
    exports.MODE_DEFAULT,
    exports.UNUSED,
    exports.MODE_PAYLOAD
]);
exports.EXECUTE_BATCH = (0, viem_1.concat)([
    exports.CALLTYPE_BATCH,
    exports.EXECTYPE_DEFAULT,
    exports.MODE_DEFAULT,
    exports.UNUSED,
    exports.MODE_PAYLOAD
]);
exports.ACCOUNT_MODES = {
    DEFAULT_SINGLE: (0, viem_1.concat)([
        (0, viem_1.pad)(exports.EXECTYPE_DEFAULT, { size: 1 }),
        (0, viem_1.pad)(exports.CALLTYPE_SINGLE, { size: 1 }),
        (0, viem_1.pad)(exports.UNUSED, { size: 4 }),
        (0, viem_1.pad)(exports.MODE_DEFAULT, { size: 4 }),
        (0, viem_1.pad)(exports.MODE_PAYLOAD, { size: 22 })
    ]),
    DEFAULT_BATCH: (0, viem_1.concat)([
        (0, viem_1.pad)(exports.EXECTYPE_DEFAULT, { size: 1 }),
        (0, viem_1.pad)(exports.CALLTYPE_BATCH, { size: 1 }),
        (0, viem_1.pad)(exports.UNUSED, { size: 4 }),
        (0, viem_1.pad)(exports.MODE_DEFAULT, { size: 4 }),
        (0, viem_1.pad)(exports.MODE_PAYLOAD, { size: 22 })
    ]),
    TRY_BATCH: (0, viem_1.concat)([
        (0, viem_1.pad)(exports.EXECTYPE_TRY, { size: 1 }),
        (0, viem_1.pad)(exports.CALLTYPE_BATCH, { size: 1 }),
        (0, viem_1.pad)(exports.UNUSED, { size: 4 }),
        (0, viem_1.pad)(exports.MODE_DEFAULT, { size: 4 }),
        (0, viem_1.pad)(exports.MODE_PAYLOAD, { size: 22 })
    ]),
    TRY_SINGLE: (0, viem_1.concat)([
        (0, viem_1.pad)(exports.EXECTYPE_TRY, { size: 1 }),
        (0, viem_1.pad)(exports.CALLTYPE_SINGLE, { size: 1 }),
        (0, viem_1.pad)(exports.UNUSED, { size: 4 }),
        (0, viem_1.pad)(exports.MODE_DEFAULT, { size: 4 }),
        (0, viem_1.pad)(exports.MODE_PAYLOAD, { size: 22 })
    ]),
    DELEGATE_SINGLE: (0, viem_1.concat)([
        (0, viem_1.pad)(exports.EXECTYPE_DELEGATE, { size: 1 }),
        (0, viem_1.pad)(exports.CALLTYPE_SINGLE, { size: 1 }),
        (0, viem_1.pad)(exports.UNUSED, { size: 4 }),
        (0, viem_1.pad)(exports.MODE_DEFAULT, { size: 4 }),
        (0, viem_1.pad)(exports.MODE_PAYLOAD, { size: 22 })
    ])
};
//# sourceMappingURL=Constants.js.map