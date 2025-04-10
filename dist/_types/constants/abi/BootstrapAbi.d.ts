export declare const BootstrapAbi: readonly [{
    readonly inputs: readonly [{
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
    readonly name: "CanNotRemoveLastValidator";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "DefaultValidatorAlreadyInstalled";
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
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "hookType";
        readonly type: "uint256";
    }];
    readonly name: "InvalidHookType";
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
    readonly stateMutability: "payable";
    readonly type: "fallback";
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
        readonly components: readonly [{
            readonly internalType: "address";
            readonly name: "module";
            readonly type: "address";
        }, {
            readonly internalType: "bytes";
            readonly name: "data";
            readonly type: "bytes";
        }];
        readonly internalType: "struct BootstrapConfig[]";
        readonly name: "validators";
        readonly type: "tuple[]";
    }, {
        readonly components: readonly [{
            readonly internalType: "address";
            readonly name: "module";
            readonly type: "address";
        }, {
            readonly internalType: "bytes";
            readonly name: "data";
            readonly type: "bytes";
        }];
        readonly internalType: "struct BootstrapConfig[]";
        readonly name: "executors";
        readonly type: "tuple[]";
    }, {
        readonly components: readonly [{
            readonly internalType: "address";
            readonly name: "module";
            readonly type: "address";
        }, {
            readonly internalType: "bytes";
            readonly name: "data";
            readonly type: "bytes";
        }];
        readonly internalType: "struct BootstrapConfig";
        readonly name: "hook";
        readonly type: "tuple";
    }, {
        readonly components: readonly [{
            readonly internalType: "address";
            readonly name: "module";
            readonly type: "address";
        }, {
            readonly internalType: "bytes";
            readonly name: "data";
            readonly type: "bytes";
        }];
        readonly internalType: "struct BootstrapConfig[]";
        readonly name: "fallbacks";
        readonly type: "tuple[]";
    }, {
        readonly components: readonly [{
            readonly internalType: "uint256";
            readonly name: "hookType";
            readonly type: "uint256";
        }, {
            readonly internalType: "address";
            readonly name: "module";
            readonly type: "address";
        }, {
            readonly internalType: "bytes";
            readonly name: "data";
            readonly type: "bytes";
        }];
        readonly internalType: "struct BootstrapPreValidationHookConfig[]";
        readonly name: "preValidationHooks";
        readonly type: "tuple[]";
    }];
    readonly name: "init";
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly components: readonly [{
            readonly internalType: "address";
            readonly name: "module";
            readonly type: "address";
        }, {
            readonly internalType: "bytes";
            readonly name: "data";
            readonly type: "bytes";
        }];
        readonly internalType: "struct BootstrapConfig[]";
        readonly name: "validators";
        readonly type: "tuple[]";
    }, {
        readonly components: readonly [{
            readonly internalType: "address";
            readonly name: "module";
            readonly type: "address";
        }, {
            readonly internalType: "bytes";
            readonly name: "data";
            readonly type: "bytes";
        }];
        readonly internalType: "struct BootstrapConfig";
        readonly name: "hook";
        readonly type: "tuple";
    }];
    readonly name: "initScoped";
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "data";
        readonly type: "bytes";
    }];
    readonly name: "initWithDefaultValidator";
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "defaultValidatorInitData";
        readonly type: "bytes";
    }, {
        readonly components: readonly [{
            readonly internalType: "address";
            readonly name: "module";
            readonly type: "address";
        }, {
            readonly internalType: "bytes";
            readonly name: "data";
            readonly type: "bytes";
        }];
        readonly internalType: "struct BootstrapConfig[]";
        readonly name: "validators";
        readonly type: "tuple[]";
    }, {
        readonly components: readonly [{
            readonly internalType: "address";
            readonly name: "module";
            readonly type: "address";
        }, {
            readonly internalType: "bytes";
            readonly name: "data";
            readonly type: "bytes";
        }];
        readonly internalType: "struct BootstrapConfig[]";
        readonly name: "executors";
        readonly type: "tuple[]";
    }, {
        readonly components: readonly [{
            readonly internalType: "address";
            readonly name: "module";
            readonly type: "address";
        }, {
            readonly internalType: "bytes";
            readonly name: "data";
            readonly type: "bytes";
        }];
        readonly internalType: "struct BootstrapConfig";
        readonly name: "hook";
        readonly type: "tuple";
    }, {
        readonly components: readonly [{
            readonly internalType: "address";
            readonly name: "module";
            readonly type: "address";
        }, {
            readonly internalType: "bytes";
            readonly name: "data";
            readonly type: "bytes";
        }];
        readonly internalType: "struct BootstrapConfig[]";
        readonly name: "fallbacks";
        readonly type: "tuple[]";
    }, {
        readonly components: readonly [{
            readonly internalType: "uint256";
            readonly name: "hookType";
            readonly type: "uint256";
        }, {
            readonly internalType: "address";
            readonly name: "module";
            readonly type: "address";
        }, {
            readonly internalType: "bytes";
            readonly name: "data";
            readonly type: "bytes";
        }];
        readonly internalType: "struct BootstrapPreValidationHookConfig[]";
        readonly name: "preValidationHooks";
        readonly type: "tuple[]";
    }];
    readonly name: "initWithDefaultValidatorAndOtherModules";
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "validator";
        readonly type: "address";
    }, {
        readonly internalType: "bytes";
        readonly name: "data";
        readonly type: "bytes";
    }];
    readonly name: "initWithSingleValidator";
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
    readonly type: "function";
}, {
    readonly stateMutability: "payable";
    readonly type: "receive";
}];
//# sourceMappingURL=BootstrapAbi.d.ts.map