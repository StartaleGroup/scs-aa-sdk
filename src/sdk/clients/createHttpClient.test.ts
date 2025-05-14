import type { Chain, LocalAccount, Transport } from "viem"
import { beforeAll, describe, expect, test } from "vitest"
import { getTestChainConfig, toNetwork } from "../../test/testSetup"
import type { NetworkConfig } from "../../test/testUtils"
import createHttpClient from "./createHttpClient"

describe("mee.createHttpClient", async () => {
  let network: NetworkConfig
  let eoaAccount: LocalAccount

  let paymentChain: Chain
  let targetChain: Chain
  let transports: Transport[]

  beforeAll(async () => {
    network = await toNetwork("MAINNET_FROM_ENV_VARS")
    ;[[paymentChain, targetChain], transports] = getTestChainConfig(network)

    eoaAccount = network.account!
  })

  test("should instantiate a client", async () => {
    const httpClient = createHttpClient("http://google.com")

    expect(httpClient).toBeDefined()
    expect(httpClient.request).toBeDefined()
    expect(Object.keys(httpClient)).toContain("request")
    expect(Object.keys(httpClient)).not.toContain("account")
    expect(Object.keys(httpClient)).not.toContain("getQuote")
  })
})
