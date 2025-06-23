import type { Chain, Client, Prettify, Transport } from "viem";
import type { WaitForUserOperationReceiptParameters, WaitForUserOperationReceiptReturnType } from "viem/account-abstraction";
import { type GetGasFeeValuesReturnType, type UserOperationGasPriceWithBigIntAsHex } from "./getGasFeeValues";
import { type GetUserOperationStatusParameters, type GetUserOperationStatusReturnType } from "./getUserOperationStatus";
export type MiscRpcSchema = [
    {
        Method: "biconomy_getGasFeeValues" | "pimlico_getUserOperationGasPrice";
        Parameters: [];
        ReturnType: UserOperationGasPriceWithBigIntAsHex;
    },
    {
        Method: "rundler_maxPriorityFeePerGas";
        Parameters: [];
        ReturnType: any;
    },
    {
        Method: "biconomy_getUserOperationStatus";
        Parameters: [string];
        ReturnType: GetUserOperationStatusReturnType;
    }
];
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
    getGasFeeValues: () => Promise<Prettify<GetGasFeeValuesReturnType>>;
    /**
     * Returns the status of a user operation.
     * @param params - {@link GetUserOperationStatusParameters}
     * @returns The user operation status. {@link GetUserOperationStatusReturnType}
     */
    getUserOperationStatus: (parameters: GetUserOperationStatusParameters) => Promise<GetUserOperationStatusReturnType>;
    /**
     * Waits for a transaction receipt to be confirmed.
     * @param params - {@link WaitForConfirmedUserOperationReceiptParameters}
     * @returns The transaction receipt. {@link WaitForConfirmedUserOperationReceiptReturnType}
     */
    waitForConfirmedUserOperationReceipt: (params: GetUserOperationStatusParameters) => Promise<WaitForUserOperationReceiptReturnType>;
    /**
     * Waits for a transaction receipt to be confirmed.
     * @param params - {@link WaitForUserOperationReceiptParameters}
     * @returns The transaction receipt. {@link WaitForUserOperationReceiptReturnType}
     */
    waitForUserOperationReceipt: (params: WaitForUserOperationReceiptParameters) => Promise<WaitForUserOperationReceiptReturnType>;
};
export declare const scsBundlerActions: () => <TTransport extends Transport, TChain extends Chain | undefined = Chain | undefined>(client: Client<TTransport, TChain>) => SCSActions;
//# sourceMappingURL=index.d.ts.map