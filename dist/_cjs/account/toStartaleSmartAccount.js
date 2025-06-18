"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toStartaleSmartAccount = void 0;
const viem_1 = require("viem");
const account_abstraction_1 = require("viem/account-abstraction");
const constants_1 = require("../constants/index.js");
const abi_1 = require("../constants/abi/index.js");
const toEmptyHook_1 = require("../modules/toEmptyHook.js");
const toDefaultModule_1 = require("../modules/validators/default/toDefaultModule.js");
const getFactoryData_1 = require("./decorators/getFactoryData.js");
const getStartaleAccountAddress_1 = require("./decorators/getStartaleAccountAddress.js");
const Constants_1 = require("./utils/Constants.js");
const Utils_1 = require("./utils/Utils.js");
const toInitData_1 = require("./utils/toInitData.js");
const toSigner_1 = require("./utils/toSigner.js");
const actions_1 = require("viem/actions");
const utils_1 = require("viem/utils");
const addressToEmptyAccount_1 = require("./utils/addressToEmptyAccount.js");
const toStartaleSmartAccount = async (parameters) => {
    const { chain, transport, signer: _signer, index = 0n, key = "startale account", name = "Startale Account", registryAddress = viem_1.zeroAddress, validators: customValidators, executors: customExecutors, hook: customHook, fallbacks: customFallbacks, prevalidationHooks: customPrevalidationHooks, accountAddress: accountAddress_, factoryAddress = constants_1.ACCOUNT_FACTORY_ADDRESS, bootStrapAddress = constants_1.BOOTSTRAP_ADDRESS, accountImplementationAddress = constants_1.STARTALE_7702_DELEGATION_ADDRESS, eip7702Auth, eip7702Account, } = parameters;
    const isEip7702 = !!eip7702Account || !!eip7702Auth;
    const signer = await (0, toSigner_1.toSigner)({ signer: _signer });
    const localAccount = eip7702Account
        ? await (0, toSigner_1.toSigner)({ signer: eip7702Account, address: eip7702Account.address })
        : undefined;
    const walletClient = (0, viem_1.createWalletClient)({
        account: signer,
        chain,
        transport,
        key,
        name
    }).extend(viem_1.publicActions);
    const publicClient = (0, viem_1.createPublicClient)({ chain, transport });
    const entryPointContract = (0, viem_1.getContract)({
        address: constants_1.ENTRY_POINT_ADDRESS,
        abi: abi_1.EntrypointAbi,
        client: {
            public: publicClient,
            wallet: walletClient
        }
    });
    const defaultValidator = (0, toDefaultModule_1.toDefaultModule)({ signer });
    const validators = customValidators || [];
    let module = customValidators?.[0] || defaultValidator;
    const executors = customExecutors || [];
    const hook = customHook || (0, toEmptyHook_1.toEmptyHook)();
    const fallbacks = customFallbacks || [];
    const prevalidationHooks = customPrevalidationHooks || [];
    const initData = (0, getFactoryData_1.getInitData)({
        defaultValidator: (0, toInitData_1.toInitData)(defaultValidator),
        validators: validators.map(toInitData_1.toInitData),
        executors: executors.map(toInitData_1.toInitData),
        hook: (0, toInitData_1.toInitData)(hook),
        fallbacks: fallbacks.map(toInitData_1.toInitData),
        registryAddress,
        bootStrapAddress,
        prevalidationHooks
    });
    const factoryData = (0, getFactoryData_1.getFactoryData)({ initData, index });
    const getInitCode = () => {
        if (isEip7702) {
            return "0x";
        }
        return (0, viem_1.concatHex)([factoryAddress, factoryData]);
    };
    let _accountAddress = accountAddress_;
    const getAddress = async () => {
        if (!(0, Utils_1.isNullOrUndefined)(_accountAddress))
            return _accountAddress;
        const addressFromFactory = await (0, getStartaleAccountAddress_1.getStartaleAccountAddress)({
            factoryAddress,
            index,
            initData,
            publicClient
        });
        if (!(0, Utils_1.addressEquals)(addressFromFactory, viem_1.zeroAddress)) {
            _accountAddress = addressFromFactory;
            return addressFromFactory;
        }
        throw new Error("Failed to get account address");
    };
    const getUserOpHash = (userOp) => (0, account_abstraction_1.getUserOperationHash)({
        chainId: chain.id,
        entryPointAddress: account_abstraction_1.entryPoint07Address,
        entryPointVersion: "0.7",
        userOperation: userOp
    });
    const encodeExecuteBatch = async (calls, mode = Constants_1.EXECUTE_BATCH) => {
        const executionAbiParams = {
            type: "tuple[]",
            components: [
                { name: "target", type: "address" },
                { name: "value", type: "uint256" },
                { name: "callData", type: "bytes" }
            ]
        };
        const executions = calls.map((tx) => ({
            target: tx.to,
            callData: tx.data ?? "0x",
            value: BigInt(tx.value ?? 0n)
        }));
        const executionCalldataPrep = (0, viem_1.encodeAbiParameters)([executionAbiParams], [executions]);
        return (0, viem_1.encodeFunctionData)({
            abi: (0, viem_1.parseAbi)([
                "function execute(bytes32 mode, bytes calldata executionCalldata) external"
            ]),
            functionName: "execute",
            args: [mode, executionCalldataPrep]
        });
    };
    const encodeExecute = async (call, mode = Constants_1.EXECUTE_SINGLE) => {
        const executionCalldata = (0, viem_1.encodePacked)(["address", "uint256", "bytes"], [call.to, BigInt(call.value ?? 0n), (call.data ?? "0x")]);
        return (0, viem_1.encodeFunctionData)({
            abi: (0, viem_1.parseAbi)([
                "function execute(bytes32 mode, bytes calldata executionCalldata) external"
            ]),
            functionName: "execute",
            args: [mode, executionCalldata]
        });
    };
    const getNonce = async (parameters) => {
        const TIMESTAMP_ADJUSTMENT = 16777215n;
        const { key: key_ = 0n, validationMode = "0x00", moduleAddress = module.module } = parameters ?? {};
        try {
            const adjustedKey = BigInt(key_) % TIMESTAMP_ADJUSTMENT;
            const key = (0, viem_1.concat)([
                (0, viem_1.toHex)(adjustedKey, { size: 3 }),
                validationMode,
                moduleAddress
            ]);
            const accountAddress = await getAddress();
            return await entryPointContract.read.getNonce([
                accountAddress,
                BigInt(key)
            ]);
        }
        catch (e) {
            return 0n;
        }
    };
    async function signTypedData(parameters) {
        const { message, primaryType, types: _types, domain } = parameters;
        if (!domain)
            throw new Error("Missing domain");
        if (!message)
            throw new Error("Missing message");
        const types = {
            EIP712Domain: (0, Utils_1.getTypesForEIP712Domain)({ domain }),
            ..._types
        };
        const messageStuff = message.stuff;
        (0, viem_1.validateTypedData)({
            domain,
            message,
            primaryType,
            types
        });
        const appDomainSeparator = (0, viem_1.domainSeparator)({ domain });
        const accountDomainStructFields = await (0, Utils_1.getAccountDomainStructFields)(publicClient, await getAddress());
        const parentStructHash = (0, viem_1.keccak256)((0, viem_1.encodePacked)(["bytes", "bytes"], [
            (0, viem_1.encodeAbiParameters)((0, viem_1.parseAbiParameters)(["bytes32, bytes32"]), [
                (0, viem_1.keccak256)((0, viem_1.toBytes)(Constants_1.PARENT_TYPEHASH)),
                messageStuff
            ]),
            accountDomainStructFields
        ]));
        const wrappedTypedHash = (0, Utils_1.eip712WrapHash)(parentStructHash, appDomainSeparator);
        let signature = await module.signMessage({ raw: (0, viem_1.toBytes)(wrappedTypedHash) });
        const contentsType = (0, viem_1.toBytes)((0, Utils_1.typeToString)(types)[1]);
        const signatureData = (0, viem_1.concatHex)([
            signature,
            appDomainSeparator,
            messageStuff,
            (0, viem_1.toHex)(contentsType),
            (0, viem_1.toHex)(contentsType.length, { size: 2 })
        ]);
        signature = (0, viem_1.encodePacked)(["address", "bytes"], [module.module, signatureData]);
        return signature;
    }
    const setModule = (validationModule) => {
        if (validationModule.type !== "validator") {
            throw new Error("Only validator modules are supported");
        }
        module = validationModule;
    };
    const signAuthorization = async () => {
        const code = await (0, actions_1.getCode)(walletClient, { address: signer.address });
        console.log("code", code);
        if (!code ||
            code.length === 0 ||
            !code
                .toLowerCase()
                .startsWith(`0xef0100${accountImplementationAddress.slice(2).toLowerCase()}`)) {
            if (eip7702Auth &&
                !(0, viem_1.isAddressEqual)(eip7702Auth.address, accountImplementationAddress)) {
                throw new Error("EIP-7702 authorization delegate address does not match account implementation address");
            }
            const auth = eip7702Auth ??
                (await (0, actions_1.signAuthorization)(walletClient, {
                    account: localAccount,
                    address: accountImplementationAddress,
                    chainId: chain.id
                }));
            const verified = await (0, utils_1.verifyAuthorization)({
                authorization: auth,
                address: accountAddress_ ?? signer.address
            });
            console.log("verified", verified);
            console.log("ever here?");
            if (!verified) {
                throw new Error("Authorization verification failed");
            }
            return auth;
        }
        return undefined;
    };
    return (0, account_abstraction_1.toSmartAccount)({
        client: walletClient,
        entryPoint: {
            abi: abi_1.EntrypointAbi,
            address: constants_1.ENTRY_POINT_ADDRESS,
            version: "0.7"
        },
        authorization: isEip7702
            ? {
                account: localAccount ??
                    (0, addressToEmptyAccount_1.addressToEmptyAccount)(accountAddress_ ?? signer.address),
                address: accountImplementationAddress
            }
            : undefined,
        getAddress,
        encodeCalls: (calls) => {
            return calls.length === 1
                ? encodeExecute(calls[0])
                : encodeExecuteBatch(calls);
        },
        getFactoryArgs: async () => {
            if (isEip7702) {
                return { factory: undefined, factoryData: undefined };
            }
            return {
                factory: factoryAddress,
                factoryData
            };
        },
        getStubSignature: async () => module.getStubSignature(),
        async signMessage({ message }) {
            const tempSignature = await module.signMessage(message);
            return (0, viem_1.encodePacked)(["address", "bytes"], [module.module, tempSignature]);
        },
        signTypedData,
        eip7702Authorization: signAuthorization,
        signUserOperation: async (parameters) => {
            const { chainId = publicClient.chain.id, ...userOpWithoutSender } = parameters;
            const address = await getAddress();
            const userOperation = {
                ...userOpWithoutSender,
                sender: address
            };
            const hash = (0, account_abstraction_1.getUserOperationHash)({
                chainId,
                entryPointAddress: account_abstraction_1.entryPoint07Address,
                entryPointVersion: "0.7",
                userOperation
            });
            return await module.signUserOpHash(hash);
        },
        getNonce,
        extend: {
            entryPointAddress: account_abstraction_1.entryPoint07Address,
            getAddress,
            getInitCode,
            encodeExecute,
            encodeExecuteBatch,
            getUserOpHash,
            factoryData,
            factoryAddress,
            accountImplementationAddress,
            registryAddress,
            signer,
            walletClient,
            publicClient,
            chain,
            setModule,
            getModule: () => module
        }
    });
};
exports.toStartaleSmartAccount = toStartaleSmartAccount;
//# sourceMappingURL=toStartaleSmartAccount.js.map