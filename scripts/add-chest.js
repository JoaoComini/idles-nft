const {
    getContract,
    getTransactionCount,
    signAndSendTransaction
} = require("./utils/web3")

const {
    CHEST_COLLECTION_ADDRESS
} = require("./utils/addresses")

const ETH_PUBLIC_ADDRESS = process.env.ETH_PUBLIC_ADDRESS

const contract = require("../artifacts/contracts/ChestCollection.sol/ChestCollection.json")
const contractAbi = getContract(contract.abi, CHEST_COLLECTION_ADDRESS)

const chestNames = ["Common"]
const chestRarityWeights = [
    [1000, 300, 100, 50, 1]
]

async function addChests() {
    const nonce = await getTransactionCount();

    const transaction = {
        from: ETH_PUBLIC_ADDRESS,
        to: CHEST_COLLECTION_ADDRESS,
        nonce: nonce,
        gas: 500000,
        data: contractAbi.methods.addChests(chestNames, chestRarityWeights).encodeABI(),
    }

    await signAndSendTransaction(transaction)
}

addChests()