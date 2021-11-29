const { 
    getContract,
    getTransactionCount,
    signAndSendTransaction 
} = require("./utils/web3")

const ETH_PUBLIC_ADDRESS = process.env.ETH_PUBLIC_ADDRESS

const contract = require("../artifacts/contracts/IdlesToken.sol/IdlesToken.json")
const contractAddress = "0x1e5e591C12192d7cca7A1B7F69730b4D133337d0"
const storeContractAddress = "0x9b39eEA144b572a9eDfB31f787B51e6aed67a6cd"

const contractAbi = getContract(contract.abi, contractAddress)

async function addApproval() {
    const nonce = await getTransactionCount();

    const approvalAmount = '115792089237316195423570985008687907853269984665640564039457584007913129639935'

    const transaction = {
        from: ETH_PUBLIC_ADDRESS,
        to: contractAddress,
        nonce: nonce,
        gas: 500000,
        data: contractAbi.methods.approve(storeContractAddress, approvalAmount).encodeABI(),
    }

    await signAndSendTransaction(transaction)
}

addApproval()