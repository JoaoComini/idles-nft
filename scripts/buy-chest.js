const { 
    getContract,
    getTransactionCount,
    signAndSendTransaction 
} = require("./utils/web3")

const ETH_PUBLIC_ADDRESS = process.env.ETH_PUBLIC_ADDRESS

const contract = require("../artifacts/contracts/Store.sol/Store.json")
const contractAddress = "0x853CaA85da459dab4688467F2685ebB555C516e8"

const contractAbi = getContract(contract.abi, contractAddress)

async function buyChest() {
    const nonce = await getTransactionCount();

    const transaction = {
        from: ETH_PUBLIC_ADDRESS,
        to: contractAddress,
        nonce: nonce,
        gas: 500000,
        data: contractAbi.methods.buyChest(0).encodeABI(),
    }

    await signAndSendTransaction(transaction)
}

buyChest()