import type {
  Account,
  Address,
  Chain,
  PublicClient,
  RpcSchema,
  SignAuthorizationReturnType,
  Transport,
  WalletClient
} from "viem"
import { STARTALE_7702_DELEGATION_ADDRESS } from "../../constants"

export const isEip7702 = async (
  publicClient: PublicClient,
  address: Address
) => {
  const code = await publicClient.getCode({ address })
  return (
    !!code &&
    code
      ?.toLowerCase()
      .includes(STARTALE_7702_DELEGATION_ADDRESS.substring(2).toLowerCase())
  )
}

export const getEip7702Authorization = async (
  walletClient: WalletClient<Transport, Chain | undefined, Account, RpcSchema>,
  delegationAddress?: Address
): Promise<SignAuthorizationReturnType> => {
  const contractAddress = delegationAddress || STARTALE_7702_DELEGATION_ADDRESS
  const authorization = await walletClient.signAuthorization({
    address: contractAddress
  })
  return authorization
}
