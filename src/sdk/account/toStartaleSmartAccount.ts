import {
  type AbiParameter,
  type Account,
  type Address,
  type Chain,
  type ClientConfig,
  type Hex,
  type LocalAccount,
  type OneOf,
  type Prettify,
  type PrivateKeyAccount,
  type PublicClient,
  type RpcSchema,
  type SignAuthorizationReturnType,
  type SignableMessage,
  type Transport,
  type TypedData,
  type TypedDataDefinition,
  type UnionPartialBy,
  type WalletClient,
  concat,
  concatHex,
  createPublicClient,
  createWalletClient,
  domainSeparator,
  encodeAbiParameters,
  encodeFunctionData,
  encodePacked,
  getContract,
  isAddressEqual,
  keccak256,
  parseAbi,
  parseAbiParameters,
  publicActions,
  toBytes,
  toHex,
  validateTypedData,
  zeroAddress
} from "viem"
import {
  type SmartAccount,
  type SmartAccountImplementation,
  type UserOperation,
  entryPoint07Address,
  getUserOperationHash,
  toSmartAccount
} from "viem/account-abstraction"

import {
  ACCOUNT_FACTORY_ADDRESS,
  BOOTSTRAP_ADDRESS,
  ENTRY_POINT_ADDRESS,
  STARTALE_7702_DELEGATION_ADDRESS
} from "../constants"
// Constants
import { EntrypointAbi } from "../constants/abi"
import { toEmptyHook } from "../modules/toEmptyHook"
import type { Module } from "../modules/utils/Types"
import { toDefaultModule } from "../modules/validators/default/toDefaultModule"
import type { Validator } from "../modules/validators/toValidator"
import { getFactoryData, getInitData } from "./decorators/getFactoryData"
import { getStartaleAccountAddress } from "./decorators/getStartaleAccountAddress"
import {
  EXECUTE_BATCH,
  EXECUTE_SINGLE,
  PARENT_TYPEHASH
} from "./utils/Constants"
// Utils
import type { Call } from "./utils/Types"
import {
  type EthersWallet,
  type TypedDataWith712,
  addressEquals,
  eip712WrapHash,
  getAccountDomainStructFields,
  getTypesForEIP712Domain,
  isNullOrUndefined,
  typeToString
} from "./utils/Utils"
import { toInitData } from "./utils/toInitData"
import { type EthereumProvider, type Signer, toSigner } from "./utils/toSigner"

import {
  getCode,
  signAuthorization as signAuthorizationAction
} from "viem/actions"
import { verifyAuthorization } from "viem/utils"
import { addressToEmptyAccount } from "./utils/addressToEmptyAccount"
/**
 * Base module configuration type
 */
export type MinimalModuleConfig = {
  module: Address
  data: Hex
}

/**
 * Generic module configuration type that can be extended with additional properties
 */
export type GenericModuleConfig<
  T extends MinimalModuleConfig = MinimalModuleConfig
> = T

export type PrevalidationHookModuleConfig = GenericModuleConfig & {
  hookType: bigint
}
/**
 * Parameters for creating a Startale Smart Account
 */
export type ToStartaleSmartAccountParameters = {
  /** The blockchain network */
  chain: Chain
  /** The transport configuration */
  transport: ClientConfig["transport"]
  /** The signer account or address */
  signer: OneOf<
    | EthereumProvider
    | WalletClient<Transport, Chain | undefined, Account>
    | LocalAccount
    | EthersWallet
  >
  /** Optional index for the account */
  index?: bigint | undefined
  /** Optional account address override */
  accountAddress?: Address
  /** Optional validator modules configuration */
  validators?: Array<Validator>
  /** Optional executor modules configuration */
  executors?: Array<GenericModuleConfig>
  /** Optional prevalidation hook modules configuration */
  prevalidationHooks?: Array<PrevalidationHookModuleConfig>
  /** Optional hook module configuration */
  hook?: GenericModuleConfig
  /** Optional fallback modules configuration */
  fallbacks?: Array<GenericModuleConfig>
  /** Optional registry address */
  registryAddress?: Address
  /** Optional factory address */
  factoryAddress?: Address
  /** Optional bootstrap address */
  bootStrapAddress?: Address
  /** Optional account implementation address */
  accountImplementationAddress?: Address
  /** Optional EIP-7702 Authorization */
  eip7702Auth?: SignAuthorizationReturnType | undefined
  /** Optional EIP-7702 Account */
  eip7702Account?: Signer
} & Prettify<
  Pick<
    ClientConfig<Transport, Chain, Account, RpcSchema>,
    | "account"
    | "cacheTime"
    | "chain"
    | "key"
    | "name"
    | "pollingInterval"
    | "rpcSchema"
  >
>
/**
 * Startale Smart Account type
 */
export type StartaleSmartAccount = Prettify<
  SmartAccount<StartaleSmartAccountImplementation>
>

/**
 * Startale Smart Account Implementation
 */
export type StartaleSmartAccountImplementation = SmartAccountImplementation<
  typeof EntrypointAbi,
  "0.7",
  {
    /** Gets the counterfactual address of the account */
    getAddress: () => Promise<Address>

    /** Gets the init code for the account */
    getInitCode: () => Hex

    /** Encodes a single call for execution */
    encodeExecute: (call: Call) => Promise<Hex>

    /** Encodes a batch of calls for execution */
    encodeExecuteBatch: (calls: readonly Call[]) => Promise<Hex>

    /** Calculates the hash of a user operation */
    getUserOpHash: (userOp: UserOperation) => Hex

    /** Factory data used for account creation */
    factoryData: Hex

    /** Factory address used for account creation */
    factoryAddress: Address

    /** The signer instance */
    signer: Signer

    /** The public client instance */
    publicClient: PublicClient

    /** The wallet client instance */
    walletClient: WalletClient

    /** The blockchain network */
    chain: Chain

    // /** The account implementation address */
    accountImplementationAddress: Address

    /** Get the active module */
    getModule: () => Validator

    /** Set the active module */
    setModule: (validationModule: Module) => void

    /** EIP-7702 Authorization */
    eip7702Authorization?:
      | (() => Promise<SignAuthorizationReturnType | undefined>)
      | undefined

    // Review: We could add a method called superChargeEOA that accepts the delegation address (defaults to account implementation)
    // This could be executor = self and just making the upgrade
    // Or it only returns signed authorisation

    /** Execute the transaction to unauthorize the account */
    unDelegate: () => Promise<Hex>

    /** Check if the account is delegated to the implementation address */
    isDelegated: () => Promise<boolean>
  }
>

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
export const toStartaleSmartAccount = async (
  parameters: ToStartaleSmartAccountParameters
): Promise<StartaleSmartAccount> => {
  const {
    chain,
    transport,
    signer: _signer,
    index = 0n,
    key = "startale account",
    name = "Startale Account",
    registryAddress = zeroAddress,
    validators: customValidators,
    executors: customExecutors,
    hook: customHook,
    fallbacks: customFallbacks,
    prevalidationHooks: customPrevalidationHooks,
    accountAddress: accountAddress_,
    factoryAddress = ACCOUNT_FACTORY_ADDRESS,
    bootStrapAddress = BOOTSTRAP_ADDRESS,
    accountImplementationAddress = STARTALE_7702_DELEGATION_ADDRESS,
    eip7702Auth,
    eip7702Account
  } = parameters

  // Note: we could also accept deliberate optional flag to enable EIP-7702
  const isEip7702 = !!eip7702Account || !!eip7702Auth
  const signer = await toSigner({ signer: _signer })

  // Review
  // Has to be EOA signer who does sign the authorization.
  // Note: Might as well use signer interchangeably.
  const localAccount = eip7702Account
    ? await toSigner({
        signer: eip7702Account,
        address: eip7702Account.address
      })
    : undefined

  const walletClient = createWalletClient({
    account: signer,
    chain,
    transport,
    key,
    name
  }).extend(publicActions)
  const publicClient = createPublicClient({ chain, transport })

  const entryPointContract = getContract({
    address: ENTRY_POINT_ADDRESS,
    abi: EntrypointAbi,
    client: {
      public: publicClient,
      wallet: walletClient
    }
  })

  // Prepare default validator module
  const defaultValidator = toDefaultModule({ signer })

  // Prepare validator modules
  const validators = customValidators || []

  // The default validator should be the defaultValidator unless custom validators have been set
  let module = customValidators?.[0] || defaultValidator

  // Prepare executor modules
  const executors = customExecutors || []

  // Prepare hook module
  const hook = customHook || toEmptyHook()

  // Prepare fallback modules
  const fallbacks = customFallbacks || []

  // Generate the initialization data for the account using the init function
  const prevalidationHooks = customPrevalidationHooks || []

  const initData = getInitData({
    defaultValidator: toInitData(defaultValidator),
    validators: validators.map(toInitData),
    executors: executors.map(toInitData),
    hook: toInitData(hook),
    fallbacks: fallbacks.map(toInitData),
    registryAddress,
    bootStrapAddress,
    prevalidationHooks
  })

  // Generate the factory data with the bootstrap address and init data
  const factoryData = getFactoryData({ initData, index })

  /**
   * @description Gets the init code for the account
   * @returns The init code as a hexadecimal string
   */
  const getInitCode = () => {
    if (isEip7702) {
      return "0x"
    }
    return concatHex([factoryAddress, factoryData])
  }

  let _accountAddress: Address | undefined = accountAddress_
  /**
   * @description Gets the counterfactual address of the account
   * @returns The counterfactual address
   * @throws {Error} If unable to get the counterfactual address
   */
  const getAddress = async (): Promise<Address> => {
    // In case of EIP-7702, the account address is the EOA address. We could provide an override always.
    // Note: there may be ways to find out by checking bytecode.
    if (!isNullOrUndefined(_accountAddress)) return _accountAddress

    const addressFromFactory = await getStartaleAccountAddress({
      factoryAddress,
      index,
      initData,
      publicClient
    })

    if (!addressEquals(addressFromFactory, zeroAddress)) {
      _accountAddress = addressFromFactory
      return addressFromFactory
    }

    throw new Error("Failed to get account address")
  }

  /**
   * @description Calculates the hash of a user operation
   * @param userOp - The user operation
   * @returns The hash of the user operation
   */
  const getUserOpHash = (userOp: UserOperation): Hex =>
    getUserOperationHash({
      chainId: chain.id,
      entryPointAddress: entryPoint07Address,
      entryPointVersion: "0.7",
      userOperation: userOp
    })

  /**
   * @description Encodes a batch of calls for execution
   * @param calls - An array of calls to encode
   * @param mode - The execution mode
   * @returns The encoded calls
   */
  const encodeExecuteBatch = async (
    calls: readonly Call[],
    mode = EXECUTE_BATCH
  ): Promise<Hex> => {
    const executionAbiParams: AbiParameter = {
      type: "tuple[]",
      components: [
        { name: "target", type: "address" },
        { name: "value", type: "uint256" },
        { name: "callData", type: "bytes" }
      ]
    }

    const executions = calls.map((tx) => ({
      target: tx.to,
      callData: tx.data ?? "0x",
      value: BigInt(tx.value ?? 0n)
    }))

    const executionCalldataPrep = encodeAbiParameters(
      [executionAbiParams],
      [executions]
    )
    return encodeFunctionData({
      abi: parseAbi([
        "function execute(bytes32 mode, bytes calldata executionCalldata) external"
      ]),
      functionName: "execute",
      args: [mode, executionCalldataPrep]
    })
  }

  /**
   * @description Encodes a single call for execution
   * @param call - The call to encode
   * @param mode - The execution mode
   * @returns The encoded call
   */
  const encodeExecute = async (
    call: Call,
    mode = EXECUTE_SINGLE
  ): Promise<Hex> => {
    const executionCalldata = encodePacked(
      ["address", "uint256", "bytes"],
      [call.to as Hex, BigInt(call.value ?? 0n), (call.data ?? "0x") as Hex]
    )

    return encodeFunctionData({
      abi: parseAbi([
        "function execute(bytes32 mode, bytes calldata executionCalldata) external"
      ]),
      functionName: "execute",
      args: [mode, executionCalldata]
    })
  }

  /**
   * @description Gets the nonce for the account
   * @param parameters - Optional parameters for getting the nonce
   * @returns The nonce
   */
  const getNonce = async (parameters?: {
    key?: bigint
    validationMode?: "0x00" | "0x01" | "0x02"
    moduleAddress?: Address
  }): Promise<bigint> => {
    const TIMESTAMP_ADJUSTMENT = 16777215n
    const {
      key: key_ = 0n,
      validationMode = "0x00",
      moduleAddress = module.module
    } = parameters ?? {}
    try {
      const adjustedKey = BigInt(key_) % TIMESTAMP_ADJUSTMENT
      const key: string = concat([
        toHex(adjustedKey, { size: 3 }),
        validationMode,
        moduleAddress
      ])
      const accountAddress = await getAddress()
      return await entryPointContract.read.getNonce([
        accountAddress,
        BigInt(key)
      ])
    } catch (e) {
      return 0n
    }
  }

  /**
   * @description Checks if the account is delegated to the implementation address
   * @returns True if the account is delegated, false otherwise
   */
  async function isDelegated(): Promise<boolean> {
    const code = await publicClient.getCode({ address: signer.address })
    return (
      !!code &&
      code
        ?.toLowerCase()
        .includes(STARTALE_7702_DELEGATION_ADDRESS.substring(2).toLowerCase())
    )
  }

  /**
   * @description Get authorization data to unauthorize the account
   * @returns Hex of the transaction hash. You can wait for the receipt on this hash.
   *
   * @example
   * const undelegateTxHash = await startaleSmartAccount.unDelegate()
   */
  async function unDelegate(): Promise<Hex> {
    const deAuthorization = await walletClient.signAuthorization({
      address: zeroAddress,
      executor: "self"
    })
    return await walletClient.sendTransaction({
      to: signer.address, // any target
      data: "0xdeadbeef", // any data
      type: "eip7702",
      authorizationList: [deAuthorization]
    })
  }

  /**
   * @description Signs typed data
   * @param parameters - The typed data parameters
   * @returns The signature
   */
  async function signTypedData<
    const typedData extends TypedData | Record<string, unknown>,
    primaryType extends keyof typedData | "EIP712Domain" = keyof typedData
  >(parameters: TypedDataDefinition<typedData, primaryType>): Promise<Hex> {
    const { message, primaryType, types: _types, domain } = parameters

    if (!domain) throw new Error("Missing domain")
    if (!message) throw new Error("Missing message")

    const types = {
      EIP712Domain: getTypesForEIP712Domain({ domain }),
      ..._types
    }

    // @ts-ignore: Comes from startale parent typehash
    const messageStuff: Hex = message.stuff

    // @ts-ignore
    validateTypedData({
      domain,
      message,
      primaryType,
      types
    })

    const appDomainSeparator = domainSeparator({ domain })
    const accountDomainStructFields = await getAccountDomainStructFields(
      publicClient,
      await getAddress()
    )

    const parentStructHash = keccak256(
      encodePacked(
        ["bytes", "bytes"],
        [
          encodeAbiParameters(parseAbiParameters(["bytes32, bytes32"]), [
            keccak256(toBytes(PARENT_TYPEHASH)),
            messageStuff
          ]),
          accountDomainStructFields
        ]
      )
    )

    const wrappedTypedHash = eip712WrapHash(
      parentStructHash,
      appDomainSeparator
    )

    let signature = await module.signMessage({ raw: toBytes(wrappedTypedHash) })
    const contentsType = toBytes(typeToString(types as TypedDataWith712)[1])

    const signatureData = concatHex([
      signature,
      appDomainSeparator,
      messageStuff,
      toHex(contentsType),
      toHex(contentsType.length, { size: 2 })
    ])

    signature = encodePacked(
      ["address", "bytes"],
      [module.module, signatureData]
    )

    return signature
  }

  /**
   * @description Changes the active module for the account
   * @param module - The new module to set as active
   * @returns void
   */
  const setModule = (validationModule: Module) => {
    if (validationModule.type !== "validator") {
      throw new Error("Only validator modules are supported")
    }
    module = validationModule as Validator
  }

  // Todo: We could also implement unDelegate. and isDelegated = isEIP7702

  const signAuthorization = async () => {
    // Note: Signer would be EOA signer
    // Could also be accountAddress assuming we would have overriden the address.
    const code = await getCode(walletClient, { address: signer.address })
    // check if account has not activated 7702 with implementation address
    if (
      !code ||
      code.length === 0 ||
      !code
        .toLowerCase()
        .startsWith(
          `0xef0100${accountImplementationAddress.slice(2).toLowerCase()}`
        )
    ) {
      if (
        eip7702Auth &&
        !isAddressEqual(eip7702Auth.address, accountImplementationAddress)
      ) {
        throw new Error(
          "EIP-7702 authorization delegate address does not match account implementation address"
        )
      }

      const auth =
        eip7702Auth ??
        (await signAuthorizationAction(walletClient, {
          account: localAccount as LocalAccount,
          address: accountImplementationAddress as `0x${string}`,
          chainId: chain.id
        }))
      const verified = await verifyAuthorization({
        authorization: auth,
        address: accountAddress_ ?? (signer.address as Address)
      })
      if (!verified) {
        throw new Error("Authorization verification failed")
      }
      return auth
    }
    return undefined
  }

  return toSmartAccount({
    client: walletClient,
    entryPoint: {
      abi: EntrypointAbi,
      address: ENTRY_POINT_ADDRESS,
      version: "0.7"
    },
    authorization: isEip7702
      ? {
          account:
            (localAccount as PrivateKeyAccount) ??
            addressToEmptyAccount(accountAddress_ ?? signer.address), // Review
          address: accountImplementationAddress
        }
      : undefined,
    getAddress,
    encodeCalls: (calls: readonly Call[]): Promise<Hex> => {
      return calls.length === 1
        ? encodeExecute(calls[0])
        : encodeExecuteBatch(calls)
    },
    getFactoryArgs: async () => {
      if (isEip7702) {
        return { factory: undefined, factoryData: undefined }
      }
      return {
        factory: factoryAddress,
        factoryData
      }
    },
    getStubSignature: async (): Promise<Hex> => module.getStubSignature(),
    /**
     * @description Signs a message
     * @param params - The parameters for signing
     * @param params.message - The message to sign
     * @returns The signature
     */
    async signMessage({ message }: { message: SignableMessage }): Promise<Hex> {
      const tempSignature = await module.signMessage(message)
      return encodePacked(["address", "bytes"], [module.module, tempSignature])
    },
    signTypedData,
    eip7702Authorization: signAuthorization,
    signUserOperation: async (
      parameters: UnionPartialBy<UserOperation, "sender"> & {
        chainId?: number | undefined
      }
    ): Promise<Hex> => {
      const { chainId = publicClient.chain.id, ...userOpWithoutSender } =
        parameters
      const address = await getAddress()

      const userOperation = {
        ...userOpWithoutSender,
        sender: address
      }

      const hash = getUserOperationHash({
        chainId,
        entryPointAddress: entryPoint07Address,
        entryPointVersion: "0.7",
        userOperation
      })
      return await module.signUserOpHash(hash)
    },
    getNonce,
    extend: {
      unDelegate,
      isDelegated,
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
  })
}
