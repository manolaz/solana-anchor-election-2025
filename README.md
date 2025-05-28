# Anchor Election 2025 (aka Voting app)

## 🆕 Updated for Solana Kit, Kite, and Codama

[![CI Badge](https://github.com/solana-kite/anchor-election-2025/actions/workflows/tests.yaml/badge.svg)](https://github.com/solana-kite/anchor-election-2025/actions)

A new version of [onchain voting from the Anchor docs](https://examples.anchor-lang.com/docs/onchain-voting). 

> A decentralized onchain voting system on Solana, where users can vote on their favourite greeting

Note that like [the original](https://github.com/coral-xyz/anchor-by-example/blob/master/programs/onchain-voting/programs/onchain-voting/src/lib.rs), we do allow multiple votes!

This repo provides:

- Full compatibility with the latest Rust, Agave CLI, Node.js, Anchor, and Solana Kit.
- Clean builds with zero warnings or errors.
- Testing via npm and Node.js, avoiding third-party package managers or test runners.

## Versions

Verify your local environment with:

```bash
bash show-versions.sh
```

This repository was tested with:

```
OS:
  MacOS 15.4.1
Solana CLI:
  solana-cli 2.1.21 (src:8a085eeb; feat:1416569292, client:Agave)
Anchor:
  anchor-cli 0.31.1
Node:
  v22.14.0
Rust:
  rustc 1.86.0 (05f9846f8 2025-03-31)
build-sbf version:
  solana-cargo-build-sbf 2.1.21
```

Using different versions may cause compatibility issues.

## Usage

1. Clone the repository:

   ```bash
   git clone https://github.com/mikemaccana/anchor-election-2025.git
   cd anchor-election-2025
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run tests:

   ```bash
   # RUSTUP_TOOLCHAIN is needed for consistent builds per
   # https://solana.stackexchange.com/questions/21664/why-is-the-same-commit-of-an-anchor-repo-giving-different-results-when-run-at-di
   # TODO: remove when no longer necessary
   RUSTUP_TOOLCHAIN=nightly-2025-04-16 anchor test
   ```

4. Deploy the program:
   ```bash
   anchor deploy
   ```


## Changelog and Credits

See the [CHANGELOG](CHANGELOG.md) for updates and contributor credits.
