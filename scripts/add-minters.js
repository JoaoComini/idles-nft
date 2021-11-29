const { 
    getContract,
    getTransactionCount,
    signAndSendTransaction 
} = require("./utils/web3")

const ETH_PUBLIC_ADDRESS = process.env.ETH_PUBLIC_ADDRESS

const contract = require("../artifacts/contracts/IdlesItems.sol/IdlesItems.json")
const contractAddress = "0x97420DA211D3889AC2AF9D6f65eCCe17d659d972"
const storeContractAddress = "0x9b39eEA144b572a9eDfB31f787B51e6aed67a6cd"

const contractAbi = getContract(contract.abi, contractAddress)

async function addMinters() {
    const nonce = await getTransactionCount();

    const transaction = {
        from: ETH_PUBLIC_ADDRESS,
        to: contractAddress,
        nonce: nonce,
        gas: 500000,
        data: contractAbi.methods.addMinters([storeContractAddress]).encodeABI(),
    }

    await signAndSendTransaction(transaction)
}

addMinters()