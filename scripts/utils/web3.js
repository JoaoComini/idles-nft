require("dotenv").config()

const ALCHEMY_API_URL = process.env.ALCHEMY_API_URL
const ETH_PRIVATE_ADDRESS = process.env.ETH_PRIVATE_ADDRESS
const ETH_PUBLIC_ADDRESS = process.env.ETH_PUBLIC_ADDRESS

const { createAlchemyWeb3 } = require("@alch/alchemy-web3")
const web3 = createAlchemyWeb3(ALCHEMY_API_URL)

function getContract(abi, address) {
    return new web3.eth.Contract(abi, address)
}

async function signAndSendTransaction(transaction) {
    try {
        const signedTransaction = await web3.eth.accounts.signTransaction(transaction, ETH_PRIVATE_ADDRESS)
        web3.eth.sendSignedTransaction(signedTransaction.rawTransaction, handleTransactionResponse)
    } catch (error) {
        console.log(" Promise failed:", error)
    }
}

function handleTransactionResponse(error, hash) {
    if (! error) {
        console.log(
            "The hash of your transaction is: ",
            hash,
            "\nCheck Alchemy's Mempool to view the status of your transaction!"
        )
    } else {
        console.log(
            "Something went wrong when submitting your transaction:",
            error
        )
    }
}

async function getTransactionCount() {
    return await web3.eth.getTransactionCount(ETH_PUBLIC_ADDRESS, "latest")
}

module.exports = {
    getContract,
    getTransactionCount,
    signAndSendTransaction
}