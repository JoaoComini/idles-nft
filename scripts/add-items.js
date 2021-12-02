const {
    getContract,
    getTransactionCount,
    signAndSendTransaction
} = require("./utils/web3")

const {
    ITEMS_COLLECTION_ADDRESS
} = require("./utils/addresses")

const ETH_PUBLIC_ADDRESS = process.env.ETH_PUBLIC_ADDRESS

const contract = require("../artifacts/contracts/ItemsCollection.sol/ItemsCollection.json")
const contractAbi = getContract(contract.abi, ITEMS_COLLECTION_ADDRESS)

const itemsRarity = [0, 1, 2, 3 ,4]
const itemsMetadata = ["url", "url", "url", "url" ,"url"]

async function addItems() {
    const nonce = await getTransactionCount();

    const transaction = {
        from: ETH_PUBLIC_ADDRESS,
        to: ITEMS_COLLECTION_ADDRESS,
        nonce: nonce,
        gas: 500000,
        data: contractAbi.methods.addItems(itemsRarity, itemsMetadata).encodeABI(),
    }

    await signAndSendTransaction(transaction)
}

addItems()