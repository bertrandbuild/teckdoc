# Trading Bro contracts

Deployed on galadriel devnet: 0x7D2b35E1943007F50d45E5c10F60C7F9DA6eE4E8 with dev oracle : 0x0352b37E5680E324E804B5A6e1AddF0A064E201D

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Deploy

```shell
forge create --rpc-url https://devnet.galadriel.com/ --gas-price 1000000000 --gas-limit 3000000 --private-key <your_private_key> src/ChatSearchAI.sol:ChatSearchAI --constructor-args 0x0352b37E5680E324E804B5A6e1AddF0A064E201D <RAG ADDRESS>
```

### Generate ABIs

```shell
forge inspect <contract name> abi
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```