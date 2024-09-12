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
forge create --rpc-url https://devnet.galadriel.com/ --gas-price 1000000000 --gas-limit 3000000 --private-key <your_private_key> src/ChatSearchAI.sol:ChatSearchAI --constructor-args <ORACLE_ADDRESS> <RAG_CID>
```

- ORACLE_ADDRESS is mandatoray and can be the oracle address: `0x0352b37E5680E324E804B5A6e1AddF0A064E201D` (this is the non TEE dev oracle from galadriel)
- RAG_CID is the CID of the RAG you deployed in the [RAG README](./smart-search/utils/rag-tools/README.md) and can be setted later with a query with the function `setKnowledgeBase()`.


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