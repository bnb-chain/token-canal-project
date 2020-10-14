# Token Canal Project
Project Token Canal is a new initiative, similar to many existing ‘wrapped coins’ in the crypto community, Binance.com, the largest crypto token vault and exchange, will stand to issue and bind more token assets on Binance Chain, Binance Smart Chain and Ethereum, and guarantee the conversion from and to the original tokens with our own credibility and infrastructure.

For example, Binance.com will support BTC, BTC BEP2, and BTC BEP20 deposits and withdrawals, as they are virtually the same token on multiple networks. Moreover, other convenient methods to facilitate conversion of these tokens outside of Binance.com will be introduced later, as Project Token Canal will be composed of several facilitations to enable the one-stop ecosystem. After some discussion, all current validators of Binance Chain have also agreed to support listing tokens via Project Token Canal to provide more options to Binance DEX users.

## Contracts

1. BinancePeggyTokenFactory.sol. It is a factory contract to help deploy `AdminUpgradeabilityProxy` and init the contract.
2. AdminUpgradeabilityProxy.sol. It is an upgradable proxy contract with admin, and delegate request to it's implementation contract.
3. BinancePeggyToken.sol. It is the implementation contract of Binance Peg token.

## Pause & Unpause

Owner of `AdminUpgradeabilityProxy` can pause the contract by invoke `pause` to disable `transfer`, `transferFrom` and so on.

## Transfer Ownership

1. The current owner call `transferOwnership` method to claim a new address as the `pendingOwner`.
2. The `pendingOwner` call `claimOwnership` to get the ownership.

## Upgrade
1. Pause the contract first.
2. deploy the new implementation contract.
3. The `admin` of `AdminUpgradeabilityProxy` invoke `upgradeTo` to upgrade to latest implementation.

## Install dependency

```shell script
npm install
```

## Run unittests

Start ganache:
```shell script
npm run testrpc
```

Run unittests:
```shell script
npm run truffle:test
```

## Flatten

```shell script
npm run flatten
```

## Coverage

```shell script
npm run coverage
```