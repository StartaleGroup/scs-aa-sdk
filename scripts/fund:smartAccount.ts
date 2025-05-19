import dotenv from "dotenv"
import {
  http,
  type Address,
  createPublicClient,
  createWalletClient,
  encodeFunctionData,
  formatEther,
  formatUnits,
  parseEther,
  parseUnits,
  publicActions
} from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { toStartaleSmartAccount } from "../src/sdk/account"
import { getChain } from "../src/sdk/account/utils/getChain"
import { TokenWithPermitAbi } from "../src/sdk/constants"

// Soneium Minato address as placeholder
const usdcAddress = "0xfF0CBFbA43a1Ce2B8d72B2f3121558BcBd4B03a6"

dotenv.config()

// Configuration
const NATIVE_TOKEN_AMOUNT = parseEther("0.0005")
const USDC_TOKEN_AMOUNT = parseUnits("3", 6)
const ACCOUNT_INDEX = 0n
const ACCOUNT_INDEX_ONE = 1n

async function main() {
  // Get chain IDs from command line arguments
  const chainIds = process.argv
    .slice(2)
    .map((arg) => Number.parseInt(arg))
    .filter((id) => !Number.isNaN(id))

  if (chainIds.length === 0) {
    console.error(
      "Please provide at least one chain ID as a command line argument"
    )
    console.error("Example: bun run fund:smartAccount 10 420 84531")
    process.exit(1)
  }

  // Get environment variables
  const { PRIVATE_KEY } = getEnvVars()
  const account = privateKeyToAccount(PRIVATE_KEY)

  console.log("\n=== Master Account ===")
  console.log(`Address: ${account.address}`)

  // Process each chain ID
  for (const chainId of chainIds) {
    // Two account will be available from now. For collision issues in tests, use a fallback account with index one
    // Default: Index zero will be used for most of the tests
    await processChain(chainId, account, ACCOUNT_INDEX)
    await processChain(chainId, account, ACCOUNT_INDEX_ONE)
  }
}

async function processChain(
  chainId: number,
  account: ReturnType<typeof privateKeyToAccount>,
  accountIndex: bigint
) {
  try {
    const chain = getChain(chainId)
    console.log(`\n=== Processing Chain: ${chain.name} (${chainId}) ===`)

    // Create the smart account for this chain
    const smartAccount = await toStartaleSmartAccount({
      chain,
      signer: account,
      transport: http(),
      index: accountIndex
    })

    const smartAccountAddress = await smartAccount.getAddress()
    console.log(`Smart Account Address: ${smartAccountAddress}`)

    // Check account balances
    const [accountNativeBalance, accountUsdcBalance] = await getBalances(
      { chainId, tokenAddress: usdcAddress },
      smartAccountAddress
    )

    console.log(
      `Smart Account Native Token Balance: ${formatEther(accountNativeBalance)} ETH`
    )
    if (usdcAddress) {
      console.log(
        `Smart Account USDC Balance: ${formatUnits(accountUsdcBalance, 6)} USDC`
      )
    }

    // Create wallet client for this chain
    const walletClient = createWalletClient({
      account,
      transport: http(),
      chain
    }).extend(publicActions)

    // Fund with native token if needed
    if (accountNativeBalance < NATIVE_TOKEN_AMOUNT) {
        console.log(
          `Funding smart account with native token on ${chain.name}...`
        )
       const nativeTx = await walletClient.sendTransaction({
         to: smartAccountAddress,
         value: NATIVE_TOKEN_AMOUNT
        })

        const nativeTxReceipt = await walletClient.waitForTransactionReceipt({
          hash: nativeTx
        })
        console.log(`Native Transaction: ${nativeTxReceipt.transactionHash}`)
    } else {
      console.log(
        `Smart account already has sufficient native token on ${chain.name}`
      )
    }

    console.log(`\n✅ Completed processing for ${chain.name} (${chainId})`)
  } catch (error) {
    console.error(`❌ Error processing chain ${chainId}:`, error)
  }
}

/**
 * Checks if a chain ID belongs to a testnet
 */
function isTestnetChain(chainId: number): boolean {
  // List of common testnet chain IDs
  const testnetChains = [
    5, // Goerli
    420, // Optimism Goerli
    80001, // Polygon Mumbai
    84531, // Base Goerli
    84532, // Base Sepolia
    421613, // Arbitrum Goerli
    421614, // Arbitrum Sepolia
    11155111 // Sepolia
  ]
  return testnetChains.includes(Number(chainId))
}

/**
 * Get token balances for an address on a specific chain
 */
const getBalances = async (
  params: {
    chainId: number
    tokenAddress: Address
  },
  address: Address
): Promise<[bigint, bigint]> => {
  const chain = getChain(params.chainId)
  const publicClient = createPublicClient({ transport: http(), chain })

  // Get native token balance
  const nativeBalance = await publicClient.getBalance({
    address: address
  })

  // Get USDC balance if token address is available
  let tokenBalance = 0n
  if (params.tokenAddress) {
    try {
      tokenBalance = await publicClient.readContract({
        address: params.tokenAddress,
        abi: TokenWithPermitAbi,
        functionName: "balanceOf",
        args: [address]
      })
    } catch (error) {
      console.warn(
        `Failed to get token balance for ${params.tokenAddress} on chain ${params.chainId}`
      )
    }
  }

  return [nativeBalance, tokenBalance]
}

/**
 * Get environment variables
 */
const getEnvVars = () => {
  const PRIVATE_KEY = process.env.PRIVATE_KEY
  if (!PRIVATE_KEY) {
    throw new Error("PRIVATE_KEY is not set in environment variables")
  }
  return {
    PRIVATE_KEY: (PRIVATE_KEY.startsWith("0x")
      ? PRIVATE_KEY
      : `0x${PRIVATE_KEY}`) as `0x${string}`
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Fatal error:", error)
    process.exit(1)
  })
