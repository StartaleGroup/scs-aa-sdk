import { concat, concatHex, createPublicClient, createWalletClient, domainSeparator, encodeAbiParameters, encodeFunctionData, encodePacked, getContract, keccak256, parseAbi, parseAbiParameters, publicActions, toBytes, toHex, validateTypedData, zeroAddress } from "viem";
import { entryPoint07Address, getUserOperationHash, toSmartAccount } from "viem/account-abstraction";
import { ENTRY_POINT_ADDRESS, ACCOUNT_FACTORY_ADDRESS, BOOTSTRAP_ADDRESS } from "../constants/index.js";
// Constants
import { EntrypointAbi } from "../constants/abi/index.js";
import { COMPOSABILITY_MODULE_ABI } from "../constants/abi/ComposabilityAbi.js";
import { toEmptyHook } from "../modules/toEmptyHook.js";
import { toDefaultModule } from "../modules/validators/default/toDefaultModule.js";
import { getFactoryData, getInitData } from "./decorators/getFactoryData.js";
import { getStartaleAccountAddress } from "./decorators/getStartaleAccountAddress.js";
import { EXECUTE_BATCH, EXECUTE_SINGLE, PARENT_TYPEHASH } from "./utils/Constants.js";
import { addressEquals, eip712WrapHash, getAccountDomainStructFields, getTypesForEIP712Domain, isNullOrUndefined, typeToString } from "./utils/Utils.js";
import { toInitData } from "./utils/toInitData.js";
import { toSigner } from "./utils/toSigner.js";
/**
 * @description Create a Startale Smart Account.
 *
 * @param parameters - {@link ToStartaleSmartAccountParameters}
 * @returns Startale Smart Account. {@link StartaleSmartAccount}
 *
 * @example
 * import { toStartaleAccount } from '@startale-scs/test-sdk'
 * import { createWalletClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 *
 * const account = await toStartaleAccount({
 *   chain: mainnet,
 *   transport: http(),
 *   signer: '0x...',
 * })
 */
export const toStartaleSmartAccount = async (parameters) => {
    const { chain, transport, signer: _signer, index = 0n, key = "startale account", name = "Startale Account", registryAddress = zeroAddress, validators: customValidators, executors: customExecutors, hook: customHook, fallbacks: customFallbacks, prevalidationHooks: customPrevalidationHooks, accountAddress: accountAddress_, factoryAddress = ACCOUNT_FACTORY_ADDRESS, bootStrapAddress = BOOTSTRAP_ADDRESS } = parameters;
    const signer = await toSigner({ signer: _signer });
    const walletClient = createWalletClient({
        account: signer,
        chain,
        transport,
        key,
        name
    }).extend(publicActions);
    const publicClient = createPublicClient({ chain, transport });
    const entryPointContract = getContract({
        address: ENTRY_POINT_ADDRESS,
        abi: EntrypointAbi,
        client: {
            public: publicClient,
            wallet: walletClient
        }
    });
    // Prepare default validator module
    const defaultValidator = toDefaultModule({ signer });
    // Prepare validator modules
    const validators = customValidators || [];
    // The default validator should be the defaultValidator unless custom validators have been set
    let module = customValidators?.[0] || defaultValidator;
    // Prepare executor modules
    const executors = customExecutors || [];
    // Prepare hook module
    const hook = customHook || toEmptyHook();
    // Prepare fallback modules
    const fallbacks = customFallbacks || [];
    // Generate the initialization data for the account using the init function
    const prevalidationHooks = customPrevalidationHooks || [];
    const initData = getInitData({
        defaultValidator: toInitData(defaultValidator),
        validators: validators.map(toInitData),
        executors: executors.map(toInitData),
        hook: toInitData(hook),
        fallbacks: fallbacks.map(toInitData),
        registryAddress,
        bootStrapAddress,
        prevalidationHooks
    });
    // Generate the factory data with the bootstrap address and init data
    const factoryData = getFactoryData({ initData, index });
    /**
     * @description Gets the init code for the account
     * @returns The init code as a hexadecimal string
     */
    const getInitCode = () => concatHex([factoryAddress, factoryData]);
    let _accountAddress = accountAddress_;
    /**
     * @description Gets the counterfactual address of the account
     * @returns The counterfactual address
     * @throws {Error} If unable to get the counterfactual address
     */
    const getAddress = async () => {
        if (!isNullOrUndefined(_accountAddress))
            return _accountAddress;
        const addressFromFactory = await getStartaleAccountAddress({
            factoryAddress,
            index,
            initData,
            publicClient
        });
        if (!addressEquals(addressFromFactory, zeroAddress)) {
            _accountAddress = addressFromFactory;
            return addressFromFactory;
        }
        throw new Error("Failed to get account address");
    };
    /**
     * @description Calculates the hash of a user operation
     * @param userOp - The user operation
     * @returns The hash of the user operation
     */
    const getUserOpHash = (userOp) => getUserOperationHash({
        chainId: chain.id,
        entryPointAddress: entryPoint07Address,
        entryPointVersion: "0.7",
        userOperation: userOp
    });
    /**
     * @description Encodes a batch of calls for execution
     * @param calls - An array of calls to encode
     * @param mode - The execution mode
     * @returns The encoded calls
     */
    const encodeExecuteBatch = async (calls, mode = EXECUTE_BATCH) => {
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
        const executionCalldataPrep = encodeAbiParameters([executionAbiParams], [executions]);
        return encodeFunctionData({
            abi: parseAbi([
                "function execute(bytes32 mode, bytes calldata executionCalldata) external"
            ]),
            functionName: "execute",
            args: [mode, executionCalldataPrep]
        });
    };
    /**
     * @description Encodes a single call for execution
     * @param call - The call to encode
     * @param mode - The execution mode
     * @returns The encoded call
     */
    const encodeExecute = async (call, mode = EXECUTE_SINGLE) => {
        const executionCalldata = encodePacked(["address", "uint256", "bytes"], [call.to, BigInt(call.value ?? 0n), (call.data ?? "0x")]);
        return encodeFunctionData({
            abi: parseAbi([
                "function execute(bytes32 mode, bytes calldata executionCalldata) external"
            ]),
            functionName: "execute",
            args: [mode, executionCalldata]
        });
    };
    /**
     * @description Encodes a composable calls for execution
     * @param call - The calls to encode
     * @returns The encoded composable compatible call
     */
    const encodeExecuteComposable = async (calls) => {
        const composableCalls = calls.map((call) => {
            return {
                to: call.to,
                value: call.value,
                functionSig: call.functionSig,
                inputParams: call.inputParams,
                outputParams: call.outputParams
            };
        });
        return encodeFunctionData({
            abi: COMPOSABILITY_MODULE_ABI,
            functionName: "executeComposable", // Function selector in Composability feature which executes the composable calls.
            args: [composableCalls] // Multiple composable calls can be batched here.
        });
    };
    /**
     * @description Gets the nonce for the account
     * @param parameters - Optional parameters for getting the nonce
     * @returns The nonce
     */
    const getNonce = async (parameters) => {
        const TIMESTAMP_ADJUSTMENT = 16777215n;
        const { key: key_ = 0n, validationMode = "0x00", moduleAddress = module.module } = parameters ?? {};
        try {
            const adjustedKey = BigInt(key_) % TIMESTAMP_ADJUSTMENT;
            const key = concat([
                toHex(adjustedKey, { size: 3 }),
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
    /**
     * @description Signs typed data
     * @param parameters - The typed data parameters
     * @returns The signature
     */
    async function signTypedData(parameters) {
        const { message, primaryType, types: _types, domain } = parameters;
        if (!domain)
            throw new Error("Missing domain");
        if (!message)
            throw new Error("Missing message");
        const types = {
            EIP712Domain: getTypesForEIP712Domain({ domain }),
            ..._types
        };
        // @ts-ignore: Comes from startale parent typehash
        const messageStuff = message.stuff;
        // @ts-ignore
        validateTypedData({
            domain,
            message,
            primaryType,
            types
        });
        const appDomainSeparator = domainSeparator({ domain });
        const accountDomainStructFields = await getAccountDomainStructFields(publicClient, await getAddress());
        const parentStructHash = keccak256(encodePacked(["bytes", "bytes"], [
            encodeAbiParameters(parseAbiParameters(["bytes32, bytes32"]), [
                keccak256(toBytes(PARENT_TYPEHASH)),
                messageStuff
            ]),
            accountDomainStructFields
        ]));
        const wrappedTypedHash = eip712WrapHash(parentStructHash, appDomainSeparator);
        let signature = await module.signMessage({ raw: toBytes(wrappedTypedHash) });
        const contentsType = toBytes(typeToString(types)[1]);
        const signatureData = concatHex([
            signature,
            appDomainSeparator,
            messageStuff,
            toHex(contentsType),
            toHex(contentsType.length, { size: 2 })
        ]);
        signature = encodePacked(["address", "bytes"], [module.module, signatureData]);
        return signature;
    }
    /**
     * @description Changes the active module for the account
     * @param module - The new module to set as active
     * @returns void
     */
    const setModule = (validationModule) => {
        if (validationModule.type !== "validator") {
            throw new Error("Only validator modules are supported");
        }
        module = validationModule;
    };
    return toSmartAccount({
        client: walletClient,
        entryPoint: {
            abi: EntrypointAbi,
            address: ENTRY_POINT_ADDRESS,
            version: "0.7"
        },
        getAddress,
        encodeCalls: (calls) => {
            return calls.length === 1
                ? encodeExecute(calls[0])
                : encodeExecuteBatch(calls);
        },
        getFactoryArgs: async () => ({
            factory: factoryAddress,
            factoryData
        }),
        getStubSignature: async () => module.getStubSignature(),
        /**
         * @description Signs a message
         * @param params - The parameters for signing
         * @param params.message - The message to sign
         * @returns The signature
         */
        async signMessage({ message }) {
            const tempSignature = await module.signMessage(message);
            return encodePacked(["address", "bytes"], [module.module, tempSignature]);
        },
        signTypedData,
        signUserOperation: async (parameters) => {
            const { chainId = publicClient.chain.id, ...userOpWithoutSender } = parameters;
            const address = await getAddress();
            const userOperation = {
                ...userOpWithoutSender,
                sender: address
            };
            const hash = getUserOperationHash({
                chainId,
                entryPointAddress: entryPoint07Address,
                entryPointVersion: "0.7",
                userOperation
            });
            return await module.signUserOpHash(hash);
        },
        getNonce,
        extend: {
            entryPointAddress: entryPoint07Address,
            getAddress,
            getInitCode,
            encodeExecute,
            encodeExecuteBatch,
            encodeExecuteComposable,
            getUserOpHash,
            factoryData,
            factoryAddress,
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
//# sourceMappingURL=toStartaleSmartAccount.js.map