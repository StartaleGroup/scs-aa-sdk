export declare const AccountImplementationAbi: readonly [{
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "anEntryPoint";
        readonly type: "address";
    }, {
        readonly internalType: "address";
        readonly name: "defaultValidator";
        readonly type: "address";
    }, {
        readonly internalType: "bytes";
        readonly name: "initData";
        readonly type: "bytes";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "constructor";
}, {
    readonly inputs: readonly [];
    readonly name: "AccountAccessUnauthorized";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "AccountAlreadyInitialized";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "AccountInitializationFailed";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "AccountNotInitialized";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "CanNotRemoveLastValidator";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "DefaultValidatorAlreadyInstalled";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "ERC7702AccountCannotBeUpgradedThisWay";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "EmergencyTimeLockNotExpired";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "EmergencyUninstallSigError";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "EnableModeSigError";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "EntryPointCanNotBeZero";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "ExecutionFailed";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes4";
        readonly name: "selector";
        readonly type: "bytes4";
    }];
    readonly name: "FallbackAlreadyInstalledForSelector";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "FallbackCallTypeInvalid";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "FallbackHandlerUninstallFailed";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes4";
        readonly name: "selector";
        readonly type: "bytes4";
    }];
    readonly name: "FallbackNotInstalledForSelector";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "FallbackSelectorForbidden";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "currentHook";
        readonly type: "address";
    }];
    readonly name: "HookAlreadyInstalled";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "HookPostCheckFailed";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "ImplementationIsNotAContract";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "InnerCallFailed";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "hookType";
        readonly type: "uint256";
    }];
    readonly name: "InvalidHookType";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "InvalidImplementationAddress";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "InvalidInitData";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "InvalidInput";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "module";
        readonly type: "address";
    }];
    readonly name: "InvalidModule";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "moduleTypeId";
        readonly type: "uint256";
    }];
    readonly name: "InvalidModuleTypeId";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "InvalidNonce";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "LinkedList_AlreadyInitialized";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "entry";
        readonly type: "address";
    }];
    readonly name: "LinkedList_EntryAlreadyInList";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "entry";
        readonly type: "address";
    }];
    readonly name: "LinkedList_InvalidEntry";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "LinkedList_InvalidPage";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "MismatchModuleTypeId";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes4";
        readonly name: "selector";
        readonly type: "bytes4";
    }];
    readonly name: "MissingFallbackHandler";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "ModuleAddressCanNotBeZero";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "moduleTypeId";
        readonly type: "uint256";
    }, {
        readonly internalType: "address";
        readonly name: "module";
        readonly type: "address";
    }];
    readonly name: "ModuleAlreadyInstalled";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "moduleTypeId";
        readonly type: "uint256";
    }, {
        readonly internalType: "address";
        readonly name: "module";
        readonly type: "address";
    }];
    readonly name: "ModuleNotInstalled";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "NoValidatorInstalled";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "currentPreValidationHook";
        readonly type: "address";
    }];
    readonly name: "PrevalidationHookAlreadyInstalled";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "UnauthorizedCallContext";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "operator";
        readonly type: "address";
    }];
    readonly name: "UnauthorizedOperation";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "CallType";
        readonly name: "callType";
        readonly type: "bytes1";
    }];
    readonly name: "UnsupportedCallType";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "ExecType";
        readonly name: "execType";
        readonly type: "bytes1";
    }];
    readonly name: "UnsupportedExecType";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "moduleTypeId";
        readonly type: "uint256";
    }];
    readonly name: "UnsupportedModuleType";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "UpgradeFailed";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "module";
        readonly type: "address";
    }];
    readonly name: "ValidatorNotInstalled";
    readonly type: "error";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "hook";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "timestamp";
        readonly type: "uint256";
    }];
    readonly name: "EmergencyHookUninstallRequest";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "hook";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "timestamp";
        readonly type: "uint256";
    }];
    readonly name: "EmergencyHookUninstallRequestReset";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "moduleTypeId";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "module";
        readonly type: "address";
    }];
    readonly name: "ModuleInstalled";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "moduleTypeId";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "module";
        readonly type: "address";
    }];
    readonly name: "ModuleUninstalled";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: false;
        readonly internalType: "bytes";
        readonly name: "callData";
        readonly type: "bytes";
    }, {
        readonly indexed: false;
        readonly internalType: "bytes";
        readonly name: "result";
        readonly type: "bytes";
    }];
    readonly name: "TryDelegateCallUnsuccessful";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: false;
        readonly internalType: "bytes";
        readonly name: "callData";
        readonly type: "bytes";
    }, {
        readonly indexed: false;
        readonly internalType: "bytes";
        readonly name: "result";
        readonly type: "bytes";
    }];
    readonly name: "TryExecuteUnsuccessful";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "implementation";
        readonly type: "address";
    }];
    readonly name: "Upgraded";
    readonly type: "event";
}, {
    readonly stateMutability: "payable";
    readonly type: "fallback";
}, {
    readonly inputs: readonly [];
    readonly name: "accountId";
    readonly outputs: readonly [{
        readonly internalType: "string";
        readonly name: "";
        readonly type: "string";
    }];
    readonly stateMutability: "pure";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "addDeposit";
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "hash";
        readonly type: "bytes32";
    }, {
        readonly internalType: "bytes";
        readonly name: "signature";
        readonly type: "bytes";
    }];
    readonly name: "checkERC7739Support";
    readonly outputs: readonly [{
        readonly internalType: "bytes4";
        readonly name: "";
        readonly type: "bytes4";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "eip712Domain";
    readonly outputs: readonly [{
        readonly internalType: "bytes1";
        readonly name: "fields";
        readonly type: "bytes1";
    }, {
        readonly internalType: "string";
        readonly name: "name";
        readonly type: "string";
    }, {
        readonly internalType: "string";
        readonly name: "version";
        readonly type: "string";
    }, {
        readonly internalType: "uint256";
        readonly name: "chainId";
        readonly type: "uint256";
    }, {
        readonly internalType: "address";
        readonly name: "verifyingContract";
        readonly type: "address";
    }, {
        readonly internalType: "bytes32";
        readonly name: "salt";
        readonly type: "bytes32";
    }, {
        readonly internalType: "uint256[]";
        readonly name: "extensions";
        readonly type: "uint256[]";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly components: readonly [{
            readonly internalType: "address";
            readonly name: "hook";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "hookType";
            readonly type: "uint256";
        }, {
            readonly internalType: "bytes";
            readonly name: "deInitData";
            readonly type: "bytes";
        }, {
            readonly internalType: "uint256";
            readonly name: "nonce";
            readonly type: "uint256";
        }];
        readonly internalType: "struct EmergencyUninstall";
        readonly name: "data";
        readonly type: "tuple";
    }, {
        readonly internalType: "bytes";
        readonly name: "signature";
        readonly type: "bytes";
    }];
    readonly name: "emergencyUninstallHook";
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "entryPoint";
    readonly outputs: readonly [{
        readonly internalType: "address";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "ExecutionMode";
        readonly name: "mode";
        readonly type: "bytes32";
    }, {
        readonly internalType: "bytes";
        readonly name: "executionCalldata";
        readonly type: "bytes";
    }];
    readonly name: "execute";
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "ExecutionMode";
        readonly name: "mode";
        readonly type: "bytes32";
    }, {
        readonly internalType: "bytes";
        readonly name: "executionCalldata";
        readonly type: "bytes";
    }];
    readonly name: "executeFromExecutor";
    readonly outputs: readonly [{
        readonly internalType: "bytes[]";
        readonly name: "returnData";
        readonly type: "bytes[]";
    }];
    readonly stateMutability: "payable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly components: readonly [{
            readonly internalType: "address";
            readonly name: "sender";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "nonce";
            readonly type: "uint256";
        }, {
            readonly internalType: "bytes";
            readonly name: "initCode";
            readonly type: "bytes";
        }, {
            readonly internalType: "bytes";
            readonly name: "callData";
            readonly type: "bytes";
        }, {
            readonly internalType: "bytes32";
            readonly name: "accountGasLimits";
            readonly type: "bytes32";
        }, {
            readonly internalType: "uint256";
            readonly name: "preVerificationGas";
            readonly type: "uint256";
        }, {
            readonly internalType: "bytes32";
            readonly name: "gasFees";
            readonly type: "bytes32";
        }, {
            readonly internalType: "bytes";
            readonly name: "paymasterAndData";
            readonly type: "bytes";
        }, {
            readonly internalType: "bytes";
            readonly name: "signature";
            readonly type: "bytes";
        }];
        readonly internalType: "struct PackedUserOperation";
        readonly name: "userOp";
        readonly type: "tuple";
    }, {
        readonly internalType: "bytes32";
        readonly name: "";
        readonly type: "bytes32";
    }];
    readonly name: "executeUserOp";
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "getActiveHook";
    readonly outputs: readonly [{
        readonly internalType: "address";
        readonly name: "hook";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "getDeposit";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "result";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "cursor";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "size";
        readonly type: "uint256";
    }];
    readonly name: "getExecutorsPaginated";
    readonly outputs: readonly [{
        readonly internalType: "address[]";
        readonly name: "array";
        readonly type: "address[]";
    }, {
        readonly internalType: "address";
        readonly name: "next";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes4";
        readonly name: "selector";
        readonly type: "bytes4";
    }];
    readonly name: "getFallbackHandlerBySelector";
    readonly outputs: readonly [{
        readonly internalType: "CallType";
        readonly name: "";
        readonly type: "bytes1";
    }, {
        readonly internalType: "address";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "getImplementation";
    readonly outputs: readonly [{
        readonly internalType: "address";
        readonly name: "implementation";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "cursor";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "size";
        readonly type: "uint256";
    }];
    readonly name: "getValidatorsPaginated";
    readonly outputs: readonly [{
        readonly internalType: "address[]";
        readonly name: "array";
        readonly type: "address[]";
    }, {
        readonly internalType: "address";
        readonly name: "next";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "initData";
        readonly type: "bytes";
    }];
    readonly name: "initializeAccount";
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "moduleTypeId";
        readonly type: "uint256";
    }, {
        readonly internalType: "address";
        readonly name: "module";
        readonly type: "address";
    }, {
        readonly internalType: "bytes";
        readonly name: "initData";
        readonly type: "bytes";
    }];
    readonly name: "installModule";
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "isInitialized";
    readonly outputs: readonly [{
        readonly internalType: "bool";
        readonly name: "";
        readonly type: "bool";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "moduleTypeId";
        readonly type: "uint256";
    }, {
        readonly internalType: "address";
        readonly name: "module";
        readonly type: "address";
    }, {
        readonly internalType: "bytes";
        readonly name: "additionalContext";
        readonly type: "bytes";
    }];
    readonly name: "isModuleInstalled";
    readonly outputs: readonly [{
        readonly internalType: "bool";
        readonly name: "";
        readonly type: "bool";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "hash";
        readonly type: "bytes32";
    }, {
        readonly internalType: "bytes";
        readonly name: "signature";
        readonly type: "bytes";
    }];
    readonly name: "isValidSignature";
    readonly outputs: readonly [{
        readonly internalType: "bytes4";
        readonly name: "";
        readonly type: "bytes4";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint192";
        readonly name: "key";
        readonly type: "uint192";
    }];
    readonly name: "nonce";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "proxiableUUID";
    readonly outputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "";
        readonly type: "bytes32";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "ExecutionMode";
        readonly name: "mode";
        readonly type: "bytes32";
    }];
    readonly name: "supportsExecutionMode";
    readonly outputs: readonly [{
        readonly internalType: "bool";
        readonly name: "isSupported";
        readonly type: "bool";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "moduleTypeId";
        readonly type: "uint256";
    }];
    readonly name: "supportsModule";
    readonly outputs: readonly [{
        readonly internalType: "bool";
        readonly name: "";
        readonly type: "bool";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "moduleTypeId";
        readonly type: "uint256";
    }, {
        readonly internalType: "address";
        readonly name: "module";
        readonly type: "address";
    }, {
        readonly internalType: "bytes";
        readonly name: "deInitData";
        readonly type: "bytes";
    }];
    readonly name: "uninstallModule";
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "newImplementation";
        readonly type: "address";
    }, {
        readonly internalType: "bytes";
        readonly name: "data";
        readonly type: "bytes";
    }];
    readonly name: "upgradeToAndCall";
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly components: readonly [{
            readonly internalType: "address";
            readonly name: "sender";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "nonce";
            readonly type: "uint256";
        }, {
            readonly internalType: "bytes";
            readonly name: "initCode";
            readonly type: "bytes";
        }, {
            readonly internalType: "bytes";
            readonly name: "callData";
            readonly type: "bytes";
        }, {
            readonly internalType: "bytes32";
            readonly name: "accountGasLimits";
            readonly type: "bytes32";
        }, {
            readonly internalType: "uint256";
            readonly name: "preVerificationGas";
            readonly type: "uint256";
        }, {
            readonly internalType: "bytes32";
            readonly name: "gasFees";
            readonly type: "bytes32";
        }, {
            readonly internalType: "bytes";
            readonly name: "paymasterAndData";
            readonly type: "bytes";
        }, {
            readonly internalType: "bytes";
            readonly name: "signature";
            readonly type: "bytes";
        }];
        readonly internalType: "struct PackedUserOperation";
        readonly name: "op";
        readonly type: "tuple";
    }, {
        readonly internalType: "bytes32";
        readonly name: "userOpHash";
        readonly type: "bytes32";
    }, {
        readonly internalType: "uint256";
        readonly name: "missingAccountFunds";
        readonly type: "uint256";
    }];
    readonly name: "validateUserOp";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "validationData";
        readonly type: "uint256";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "to";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "amount";
        readonly type: "uint256";
    }];
    readonly name: "withdrawDepositTo";
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
    readonly type: "function";
}, {
    readonly stateMutability: "payable";
    readonly type: "receive";
}];
//# sourceMappingURL=AccountImplementationAbi.d.ts.map