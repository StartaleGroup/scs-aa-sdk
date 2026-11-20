---
"@startale-scs/aa-sdk": patch
---

Keep the full paymaster response with viem 2.57.18+, which drops everything but the paymaster fields. Restores the gas limits of single-phase sponsorship (`calculateGasLimits: true`) and the `UserOperationTamperedError` check on `createSCSPaymasterClient` responses.
