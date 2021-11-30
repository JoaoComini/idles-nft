const {
    getContract,
    getTransactionCount,
    signAndSendTransaction
} = require("./utils/web3")

const {
    ITEMS_COLLECTION_ADDRESS,
    CHEST_COLLECTION_ADDRESS
} = require("./utils/addresses")

const ETH_PUBLIC_ADDRESS = process.env.ETH_PUBLIC_ADDRESS

const contract = require("../artifacts/contracts/ItemsCollection.sol/ItemsCollection.json")
const contractAbi = getContract(contract.abi, ITEMS_COLLECTION_ADDRESS)

async function addMinters() {
    const nonce = await getTransactionCount();

    const transaction = {
        from: ETH_PUBLIC_ADDRESS,
        to: ITEMS_COLLECTION_ADDRESS,
        nonce: nonce,
        gas: 500000,
        data: contractAbi.methods.addMinters([CHEST_COLLECTION_ADDRESS]).encodeABI(),
    }

    await signAndSendTransaction(transaction)
}

addMinters()