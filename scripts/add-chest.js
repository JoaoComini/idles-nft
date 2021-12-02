const {
    getContract,
    getTransactionCount,
    signAndSendTransaction
} = require("./utils/web3")

const {
    CHEST_COLLECTION_ADDRESS
} = require("./utils/addresses")

const ETH_PUBLIC_ADDRESS = process.env.ETH_PUBLIC_ADDRESS

const contract = require("../artifacts/contracts/ChestManager.sol/ChestManager.json")
const contractAbi = getContract(contract.abi, CHEST_COLLECTION_ADDRESS)

const itemIds = [0, 1, 2, 3, 4]
const rarityWeights = [120, 20, 6, 3, 1]

async function update() {
    const nonce = await getTransactionCount();

    const transaction = {
        from: ETH_PUBLIC_ADDRESS,
        to: CHEST_COLLECTION_ADDRESS,
        nonce: nonce,
        gas: 500000,
        data: contractAbi.methods.update(itemIds, rarityWeights).encodeABI(),
    }

    await signAndSendTransaction(transaction)
}

update()