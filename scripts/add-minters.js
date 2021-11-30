const { 
    getContract,
    getTransactionCount,
    signAndSendTransaction 
} = require("./utils/web3")

const ETH_PUBLIC_ADDRESS = process.env.ETH_PUBLIC_ADDRESS

const contract = require("../artifacts/contracts/ItemsCollection.sol/ItemsCollection.json")
const contractAddress = "0xfa4A9FEF3E0a198c8AAa1B9d3a7AAF77378021F0"
const chestContractAddress = "0x464b80d187ABe36E82f12697126a18f33384C2fF"

const contractAbi = getContract(contract.abi, contractAddress)

async function addMinters() {
    const nonce = await getTransactionCount();

    const transaction = {
        from: ETH_PUBLIC_ADDRESS,
        to: contractAddress,
        nonce: nonce,
        gas: 500000,
        data: contractAbi.methods.addMinters([chestContractAddress]).encodeABI(),
    }

    await signAndSendTransaction(transaction)
}

addMinters()