# Startale's scs-aa-sdk 🚀

[![License MIT](https://img.shields.io/badge/License-MIT-blue?&style=flat)](./LICENSE)
[![npm version](https://img.shields.io/npm/v/@startale/scs-aa-sdk.svg)](https://www.npmjs.com/package/@startale/scs-aa-sdk)
[![npm downloads](https://img.shields.io/npm/dm/@startale/scs-aa-sdk.svg)](https://www.npmjs.com/package/@startale/scs-aa-sdk)

A powerful toolkit for building decentralized applications (dApps) with **ERC4337 Account Abstraction** and **Smart Accounts**. This SDK is based on Biconomy's abstractjs sdk and enhanced for Startale's ecosystem.

## 📚 Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Features](#features)
- [Documentation](#documentation)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)

## 🚀 Installation

```bash
npm install @startale/scs-aa-sdk
# or
yarn add @startale/scs-aa-sdk
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

For detailed documentation, please visit our [documentation site](https://docs.startale.com/scs-aa-sdk).

## 🎯 Examples

Check out our [examples directory](./examples) for complete implementation examples.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

Built with ❤️ by [Startale Labs](https://startale.com)


