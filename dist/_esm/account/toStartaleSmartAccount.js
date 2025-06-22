import { concat, concatHex, createPublicClient, createWalletClient, domainSeparator, encodeAbiParameters, encodeFunctionData, encodePacked, getContract, isAddressEqual, keccak256, parseAbi, parseAbiParameters, publicActions, toBytes, toHex, validateTypedData, zeroAddress } from "viem";
import { entryPoint07Address, getUserOperationHash, toSmartAccount } from "viem/account-abstraction";
import { ENTRY_POINT_ADDRESS, ACCOUNT_FACTORY_ADDRESS, BOOTSTRAP_ADDRESS, STARTALE_7702_DELEGATION_ADDRESS } from "../constants/index.js";
// Constants
import { EntrypointAbi } from "../constants/abi/index.js";
import { toEmptyHook } from "../modules/toEmptyHook.js";
import { toDefaultModule } from "../modules/validators/default/toDefaultModule.js";
import { getFactoryData, getInitData } from "./decorators/getFactoryData.js";
import { getStartaleAccountAddress } from "./decorators/getStartaleAccountAddress.js";
import { EXECUTE_BATCH, EXECUTE_SINGLE, PARENT_TYPEHASH } from "./utils/Constants.js";
import { addressEquals, eip712WrapHash, getAccountDomainStructFields, getTypesForEIP712Domain, isNullOrUndefined, typeToString } from "./utils/Utils.js";
import { toInitData } from "./utils/toInitData.js";
import { toSigner } from "./utils/toSigner.js";
import { getCode, signAuthorization as signAuthorizationAction } from "viem/actions";
import { verifyAuthorization } from "viem/utils";
import { addressToEmptyAccount } from "./utils/addressToEmptyAccount.js";
/**
 * @description Create a Startale Smart Account.
 *
 * @param parameters - {@link ToStartaleSmartAccountParameters}
 * @returns Startale Smart Account. {@link StartaleSmartAccount}
 *
 * @example
 * import { toStartaleAccount } from '@startale-scs/aa-sdk'
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
    const { chain, transport, signer: _signer, index = 0n, key = "startale account", name = "Startale Account", registryAddress = zeroAddress, validators: customValidators, executors: customExecutors, hook: customHook, fallbacks: customFallbacks, prevalidationHooks: customPrevalidationHooks, accountAddress: accountAddress_, factoryAddress = ACCOUNT_FACTORY_ADDRESS, bootStrapAddress = BOOTSTRAP_ADDRESS, accountImplementationAddress = STARTALE_7702_DELEGATION_ADDRESS, eip7702Auth, eip7702Account, } = parameters;
    const isEip7702 = !!eip7702Account || !!eip7702Auth;
    const signer = await toSigner({ signer: _signer });
    // Review
    // Has to be EOA signer who does sign the authorization.
    // Note: Might as well use signer interchangeably.
    const localAccount = eip7702Account
        ? await toSigner({ signer: eip7702Account, address: eip7702Account.address })
        : undefined;
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
    const getInitCode = () => {
        if (isEip7702) {
            return "0x";
        }
        return concatHex([factoryAddress, factoryData]);
    };
    let _accountAddress = accountAddress_;
    /**
     * @description Gets the counterfactual address of the account
     * @returns The counterfactual address
     * @throws {Error} If unable to get the counterfactual address
     */
    const getAddress = async () => {
        // In case of EIP-7702, the account address is the EOA address. We could provide an override always.
        // Note: there may be ways to find out by checking bytecode.
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
     * @description Checks if the account is delegated to the implementation address
     * @returns True if the account is delegated, false otherwise
     */
    async function isDelegated() {
        const code = await publicClient.getCode({ address: signer.address });
        return (!!code &&
            code
                ?.toLowerCase()
                .includes(STARTALE_7702_DELEGATION_ADDRESS.substring(2).toLowerCase()));
    }
    /**
     * @description Get authorization data to unauthorize the account
     * @returns Hex of the transaction hash
     *
     * @example
     * const eip7702Auth = await nexusAccount.unDelegate()
     */
    async function unDelegate() {
        const deAuthorization = await walletClient.signAuthorization({
            address: zeroAddress,
            executor: "self"
        });
        return await walletClient.sendTransaction({
            to: signer.address, // any target
            data: "0xdeadbeef", // any data
            type: "eip7702",
            authorizationList: [deAuthorization]
        });
    }
    /**
     * @description Get authorization data for the EOA to Nexus Account
     * @param forMee - Whether to return the authorization data formatted for MEE. Defaults to false.
     * @param delegatedContract - The contract address to delegate the authorization to. Defaults to the implementation address.
     *
     * @example
     * const eip7702Auth = await nexusAccount.toDelegation() // Returns MeeAuthorization
     */
    async function eip7702DelegateTo(delegatedContract) {
        const contractAddress = delegatedContract || accountImplementationAddress;
        const authorization = await walletClient.signAuthorization({
            contractAddress
        });
        return authorization;
    }
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
    // Todo: We could also implement unDelegate. and isDelegated = isEIP7702
    const signAuthorization = async () => {
        // Note: Signer would be EOA signer
        // Could also be accountAddress assuming we would have overriden the address.
        const code = await getCode(walletClient, { address: signer.address });
        // check if account has not activated 7702 with implementation address
        if (!code ||
            code.length === 0 ||
            !code
                .toLowerCase()
                .startsWith(`0xef0100${accountImplementationAddress.slice(2).toLowerCase()}`)) {
            if (eip7702Auth &&
                !isAddressEqual(eip7702Auth.address, accountImplementationAddress)) {
                throw new Error("EIP-7702 authorization delegate address does not match account implementation address");
            }
            const auth = eip7702Auth ??
                (await signAuthorizationAction(walletClient, {
                    account: localAccount,
                    address: accountImplementationAddress,
                    chainId: chain.id
                }));
            const verified = await verifyAuthorization({
                authorization: auth,
                address: accountAddress_ ?? signer.address
            });
            if (!verified) {
                throw new Error("Authorization verification failed");
            }
            return auth;
        }
        return undefined;
    };
    return toSmartAccount({
        client: walletClient,
        entryPoint: {
            abi: EntrypointAbi,
            address: ENTRY_POINT_ADDRESS,
            version: "0.7"
        },
        authorization: isEip7702
            ? {
                account: localAccount ??
                    addressToEmptyAccount(accountAddress_ ?? signer.address), // Review
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
        eip7702Authorization: signAuthorization,
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
            unDelegate,
            isDelegated,
            eip7702DelegateTo,
            entryPointAddress: entryPoint07Address,
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
//# sourceMappingURL=toStartaleSmartAccount.js.map