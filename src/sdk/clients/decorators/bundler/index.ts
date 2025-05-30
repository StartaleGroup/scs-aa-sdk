import type { Chain, Client, Prettify, Transport } from "viem"
import type {
  WaitForUserOperationReceiptParameters,
  WaitForUserOperationReceiptReturnType
} from "viem/account-abstraction"
import {
  type UserOperationGasPriceWithBigIntAsHex,
  type GetGasFeeValuesReturnType,
  getGasFeeValues
} from "./getGasFeeValues"
import {
  type GetUserOperationStatusParameters,
  type GetUserOperationStatusReturnType,
  getUserOperationStatus
} from "./getUserOperationStatus"
import { waitForConfirmedUserOperationReceipt } from "./waitForConfirmedUserOperationReceipt"
import { waitForUserOperationReceipt } from "./waitForUserOperationReceipt"

export type MiscRpcSchema = [
  {
    Method: "biconomy_getGasFeeValues" | "pimlico_getUserOperationGasPrice"
    Parameters: []
    ReturnType: UserOperationGasPriceWithBigIntAsHex
  },
  {
    Method: "rundler_maxPriorityFeePerGas"
    Parameters: []
    ReturnType: any // todo: add type
  },
  {
    Method: "eth_getBlockByNumber"
    Parameters: [string, boolean]
    ReturnType: any // todo: add type
  },
  {
    Method: "biconomy_getUserOperationStatus"
    Parameters: [string]
    ReturnType: GetUserOperationStatusReturnType
  }
]

export type SCSActions = {
  /**
   * Returns the live gas prices that you can use to send a user operation.
   *
   * @returns slow, standard & fast values for maxFeePerGas & maxPriorityFeePerGas {@link GetGasFeeValuesReturnType}
   *
   * @example
   *
   * import { createClient } from "viem"
   * import { scsBundlerActions } from "@startale-scs/aa-sdk"
   *
   * const bundlerClient = createClient({
   *      chain: goerli,
   *      transport: http("http://soneium-minato.bundler.scs.startale.com?apikey=<YOUR_API_KEY>")
   * }).extend(scsBundlerActions())
   *
   * await bundlerClient.getGasFeeValues()
   */
  getGasFeeValues: () => Promise<Prettify<GetGasFeeValuesReturnType>>
  /**
   * Returns the status of a user operation.
   * @param params - {@link GetUserOperationStatusParameters}
   * @returns The user operation status. {@link GetUserOperationStatusReturnType}
   */
  getUserOperationStatus: (
    parameters: GetUserOperationStatusParameters
  ) => Promise<GetUserOperationStatusReturnType>
  /**
   * Waits for a transaction receipt to be confirmed.
   * @param params - {@link WaitForConfirmedUserOperationReceiptParameters}
   * @returns The transaction receipt. {@link WaitForConfirmedUserOperationReceiptReturnType}
   */
  waitForConfirmedUserOperationReceipt: (
    params: GetUserOperationStatusParameters
  ) => Promise<WaitForUserOperationReceiptReturnType>
  /**
   * Waits for a transaction receipt to be confirmed.
   * @param params - {@link WaitForUserOperationReceiptParameters}
   * @returns The transaction receipt. {@link WaitForUserOperationReceiptReturnType}
   */
  waitForUserOperationReceipt: (
    params: WaitForUserOperationReceiptParameters
  ) => Promise<WaitForUserOperationReceiptReturnType>
}

export const scsBundlerActions =
  () =>
  <
    TTransport extends Transport,
    TChain extends Chain | undefined = Chain | undefined
  >(
    client: Client<TTransport, TChain>
  ): SCSActions => ({
    getGasFeeValues: async () => getGasFeeValues(client),
    getUserOperationStatus: async (
      parameters: GetUserOperationStatusParameters
    ) => getUserOperationStatus(client, parameters),
    waitForConfirmedUserOperationReceipt: async (
      parameters: GetUserOperationStatusParameters
    ) => waitForConfirmedUserOperationReceipt(client, parameters),
    waitForUserOperationReceipt: async (
      parameters: WaitForUserOperationReceiptParameters
    ) => waitForUserOperationReceipt(client, parameters)
  })
