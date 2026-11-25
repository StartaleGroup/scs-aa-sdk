---
"@startale-scs/aa-sdk": patch
---

With viem 2.57.18+, restore the gas limits of single-phase sponsorship (`calculateGasLimits: true`) and the `UserOperationTamperedError` check on `createSCSPaymasterClient` responses. The check runs on the full paymaster response; only the paymaster fields (plus the single-phase gas limits, as bigint) are returned, and fee fields are never taken from the paymaster.
