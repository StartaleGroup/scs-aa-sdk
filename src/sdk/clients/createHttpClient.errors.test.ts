import { encodeErrorResult } from "viem"
import { afterEach, describe, expect, test, vi } from "vitest"
import { createHttpClient } from "./createHttpClient"

describe("createHttpClient error messages", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test("preserves the decoded AA23 reason without ABI header bytes", async () => {
    const revertData = encodeErrorResult({
      abi: [
        {
          type: "error",
          name: "Error",
          inputs: [{ name: "message", type: "string" }]
        }
      ],
      errorName: "Error",
      args: ["ERC20: transfer amount exceeds balance"]
    })
    const fetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          errors: [`errorArgs=[0,"AA23 reverted","${revertData}"]`]
        }),
        { status: 400 }
      )
    )
    vi.stubGlobal("fetch", fetch)

    await expect(
      createHttpClient("https://offline.invalid").request({ path: "simulate" })
    ).rejects.toThrow(/^ERC20: transfer amount exceeds balance$/)
    expect(fetch).toHaveBeenCalledOnce()
  })
})
