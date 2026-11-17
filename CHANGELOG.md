# @startale-scs/aa-sdk

## 1.3.0

### Features

- `toStartaleSmartAccount` takes a new `personalSignMode` option (#51). The default, `"eip191"`, is unchanged. With `"erc7739"`, `signMessage` signs the ERC-7739 `PersonalSign` digest bound to the account's EIP-712 domain, so message signatures are domain-separated from user operation signatures and verify on-chain through ERC-1271. We recommend `"erc7739"` for messages that come from dapps. It is planned to become the default in 2.0.0.
- `guardPaymaster` and `UserOperationTamperedError` are exported, so apps that use plain viem clients can apply the same paymaster response check (#49).

### Fixes

- A paymaster response, or the `estimateFeesPerGas` hook, that changes a signed field of the user operation (`sender`, `nonce`, `callData`, `factory`, `factoryData`, `initCode`, `chainId`, `authorization`) now throws `UserOperationTamperedError` before signing. `signUserOperation` always signs for the account's own chain (#49).
- `signTypedData` works for accounts that are not deployed yet. An undeployed account's EIP-712 domain is read from the implementation its factory deploys (#51).
- `installModules` passes each module's `initData`, and `uninstallModule` sends `deInitData` instead of `initData` (#52).
- `uninstallModule` and `uninstallModules` support executors, fallbacks and hooks, not only validators. `uninstallFallback` now calls the account's `uninstallModule`. Several modules from the same list can be uninstalled in one user operation (#58).

### Behaviour changes

- `uninstallModules` now encodes `(prev, deInitData)` for validators and executors itself, as `uninstallModule` does. Pass only the module's own `deInitData`. If you encoded `(prev, data)` yourself, it is now encoded twice: the module is still removed, but its `onUninstall` receives the wrong data.
- A fallback's `deInitData` must start with the 4-byte selector the handler was installed for. Shorter data is rejected before sending.
