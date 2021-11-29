const { 
    getContract,
    getTransactionCount,
    signAndSendTransaction 
} = require("./utils/web3")

const ETH_PUBLIC_ADDRESS = process.env.ETH_PUBLIC_ADDRESS

const contract = require("../artifacts/contracts/Store.sol/Store.json")
const contractAddress = "0x9b39eEA144b572a9eDfB31f787B51e6aed67a6cd"

const contractAbi = getContract(contract.abi, contractAddress)

async function buyChest() {
    const nonce = await getTransactionCount();

    const transaction = {
        from: ETH_PUBLIC_ADDRESS,
        to: contractAddress,
        nonce: nonce,
        gas: 500000,
        data: contractAbi.methods.buyChest().encodeABI(),
    }

    await signAndSendTransaction(transaction)
}

buyChest()