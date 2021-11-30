const {
    getContract,
    getTransactionCount,
    signAndSendTransaction
} = require("./utils/web3")

const ETH_PUBLIC_ADDRESS = process.env.ETH_PUBLIC_ADDRESS

const contract = require("../artifacts/contracts/ItemsCollection.sol/ItemsCollection.json")
const contractAddress = "0xfa4A9FEF3E0a198c8AAa1B9d3a7AAF77378021F0"

const contractAbi = getContract(contract.abi, contractAddress)

const items = [
    {
        rarity: 0,
        metadata: "a url",
    },
    {
        rarity: 1,
        metadata: "a url",
    },
    {
        rarity: 2,
        metadata: "a url",
    },
    {
        rarity: 3,
        metadata: "a url",
    },
    {
        rarity: 4,
        metadata: "a url",
    }
]

async function addItems() {
    const nonce = await getTransactionCount();

    const transaction = {
        from: ETH_PUBLIC_ADDRESS,
        to: contractAddress,
        nonce: nonce,
        gas: 500000,
        data: contractAbi.methods.addItems(items).encodeABI(),
    }

    await signAndSendTransaction(transaction)
}

addItems()