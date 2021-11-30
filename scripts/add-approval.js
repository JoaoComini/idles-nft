const {
    getContract,
    getTransactionCount,
    signAndSendTransaction
} = require("./utils/web3")

const ETH_PUBLIC_ADDRESS = process.env.ETH_PUBLIC_ADDRESS

const contract = require("../artifacts/contracts/IdlesToken.sol/IdlesToken.json")
const contractAddress = "0xA23CcB16C074bAdA6e52B9a86a6c66C4f709A8d5"
const storeContractAddress = "0x853CaA85da459dab4688467F2685ebB555C516e8"

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