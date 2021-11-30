const {
    getContract,
    getTransactionCount,
    signAndSendTransaction
} = require("./utils/web3")

const ETH_PUBLIC_ADDRESS = process.env.ETH_PUBLIC_ADDRESS

const contract = require("../artifacts/contracts/ChestCollection.sol/ChestCollection.json")
const contractAddress = "0x464b80d187ABe36E82f12697126a18f33384C2fF"

const contractAbi = getContract(contract.abi, contractAddress)

const chests = [
    {
        name: "Chest",
        rarityWeights: [1000, 300, 100, 50, 1]
    }
]

async function addChests() {
    const nonce = await getTransactionCount();

    const transaction = {
        from: ETH_PUBLIC_ADDRESS,
        to: contractAddress,
        nonce: nonce,
        gas: 500000,
        data: contractAbi.methods.addChests(chests).encodeABI(),
    }

    await signAndSendTransaction(transaction)
}

addChests()