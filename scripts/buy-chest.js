const {
    getContract,
    getTransactionCount,
    signAndSendTransaction
} = require("./utils/web3")

const {
    STORE_ADDRESS
} = require("./utils/addresses")

const ETH_PUBLIC_ADDRESS = process.env.ETH_PUBLIC_ADDRESS

const contract = require("../artifacts/contracts/Store.sol/Store.json")
const contractAbi = getContract(contract.abi, STORE_ADDRESS)

async function buyChest() {
    const nonce = await getTransactionCount();

    const transaction = {
        from: ETH_PUBLIC_ADDRESS,
        to: STORE_ADDRESS,
        nonce: nonce,
        gas: 500000,
        data: contractAbi.methods.buyChest(0).encodeABI(),
    }

    await signAndSendTransaction(transaction)
}

buyChest()