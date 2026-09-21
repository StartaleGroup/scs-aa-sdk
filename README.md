# Startale's scs-aa-sdk 🚀

[![License MIT](https://img.shields.io/badge/License-MIT-blue?&style=flat)](./LICENSE)
[![npm version](https://img.shields.io/npm/v/@startale-scs/aa-sdk.svg)](https://www.npmjs.com/package/@startale-scs/aa-sdk)
[![npm downloads](https://img.shields.io/npm/dm/@startale-scs/aa-sdk.svg)](https://www.npmjs.com/package/@startale-scs/aa-sdk)

A powerful toolkit for building decentralized applications (dApps) with **ERC4337 Account Abstraction** and **Smart Accounts**. This SDK is based on Biconomy's abstractjs sdk and enhanced for Startale's ecosystem.

## 📚 Table of Contents

- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Features](#-features)
- [Documentation](#-documentation)
- [Examples](#-examples)
- [Development](#-development)
- [License](#-license)

## 🚀 Installation

```bash
npm install @startale-scs/aa-sdk
# or
yarn add @startale-scs/aa-sdk
```

## ⚡ Quick Start

```typescript
import { createSCSPaymasterClient, createSmartAccountClient, toStartaleSmartAccount } from "@startale-scs/aa-sdk";

// Initialize your smart account and client
const smartAccountClient = createSmartAccountClient({
      account: await toStartaleSmartAccount({ 
            signer: signer, 
            chain: chain,
            transport: http(),
            index: BigInt(2132)
            }),
      transport: http(bundlerUrl),
      client: publicClient,
})

```

## ✨ Features

- 🔐 **Account Abstraction**: Full support for ERC4337 Account Abstraction
- 💡 **Smart Account Management**: Easy creation and management of smart accounts
- 🔄 **Transaction Batching**: Bundle multiple transactions into a single operation
- 🔌 **Modular Design**: Flexible and extensible architecture
- 🌐 **Cross-Chain Support**: Compatible with multiple EVM chains

## 📖 Documentation

For detailed documentation, please visit our [documentation site](https://docs.startale.com/docs/account-abstraction).

## 🎯 Examples

Check out our [quickstart](https://github.com/StartaleGroup/scs-aa-quickstart) for Node.js CLI examples.

## 🔧 Development

Use Node.js 24.x and the pnpm version pinned in `package.json`.

### Build and test

```bash
pnpm install --frozen-lockfile
pnpm build       # CommonJS, ESM and TypeScript declarations in dist/
pnpm test        # run the suite once
pnpm lint
```

Use `pnpm dev` for build watch mode, `pnpm test:watch` for test watch mode, and `pnpm coverage` for coverage. Re-run `pnpm build` to refresh declarations after watch-mode changes.

Integration tests need `.env` configuration: `PRIVATE_KEY`, `PRIVATE_KEY_TWO`, `TESTNET_CHAIN_ID` and `BUNDLER_URL`; paymaster tests also need `PAYMASTER_URL`. The HTTP client test setup requires `MAINNET_CHAIN_ID`. See the [network setup](./src/test/testUtils.ts) for details. Tests can submit transactions and need test funds or sponsorship; local Anvil provisioning is currently disabled. `pnpm playground` enables the live-testnet playground.

### Test the local SDK with quickstart

Pack the SDK, then install it in a [scs-aa-quickstart](https://github.com/StartaleGroup/scs-aa-quickstart) checkout using the same shell. Before running the example, configure the quickstart's `.env` with `MINATO_BUNDLER_URL`, `PAYMASTER_SERVICE_URL`, `OWNER_PRIVATE_KEY`, `COUNTER_CONTRACT_ADDRESS` and `PAYMASTER_ID`. Use a test signer, a deployed Minato counter and an applicable sponsorship policy.

```bash
# SDK repository: prepack builds dist/ automatically.
pnpm pack
SDK_TARBALL="$PWD/startale-scs-aa-sdk-$(node -p 'require("./package.json").version').tgz"

# Replace this path with your quickstart checkout.
cd /absolute/path/to/scs-aa-quickstart
npm install --no-save "$SDK_TARBALL"
npm exec -- ts-node src/startale-minato/demo_basic_userop.ts
```

Confirm the printed receipt has `success: true`; the example also exits with code zero after caught errors.

### Release

With npm publish access, prepare an unused version (`patch`, `minor` or `major` as appropriate):

```bash
npm version patch --no-git-tag-version
pnpm install --lockfile-only
```

Review the version changes, run the checks above, and pack and test that version in quickstart. Publish the exact tested tarball:

```bash
npm publish "$SDK_TARBALL" --access public --tag latest --dry-run
# After checking the dry-run output:
npm publish "$SDK_TARBALL" --access public --tag latest
```

Changesets is not configured in this repository. Avoid `changeset:release:canary`: its cleanup includes destructive Git reset, clean and tag-deletion commands.

## Dependencies

- **@rhinestone/module-sdk** (not @rhinestone/sdk): This SDK uses `@rhinestone/module-sdk` as a peer dependency for Smart Sessions and related module utilities (policy getters, session actions, validator/executor helpers, etc.). We support `^0.2.8`, `^0.3.0`, and `^0.4.0`. If your lockfile shows a deprecation notice for 0.3.x, use `@rhinestone/module-sdk@^0.4.0` (or add it as a direct dependency). We have **not** migrated to `@rhinestone/sdk` because that package does not expose a compatible API for the module-sdk utilities we rely on (e.g. `getTimeFramePolicy`, `getSudoPolicy`, `getRemoveSessionAction`, `getSmartSessionsValidator`, and re-exports). When Rhinestone provides a compatible API in `@rhinestone/sdk`, we will consider migrating.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

Built with ❤️ by [Startale Group](https://startale.com)
