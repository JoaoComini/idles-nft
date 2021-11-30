const {
    getContract,
    getTransactionCount,
    signAndSendTransaction
} = require("./utils/web3")

const {
    IDLE_TOKEN_ADDRESS,
    STORE_ADDRESS
} = require("./utils/addresses")

const ETH_PUBLIC_ADDRESS = process.env.ETH_PUBLIC_ADDRESS

const contract = require("../artifacts/contracts/IdlesToken.sol/IdlesToken.json")

const contractAbi = getContract(contract.abi, IDLE_TOKEN_ADDRESS)

async function addApproval() {
    const nonce = await getTransactionCount();

    const approvalAmount = '115792089237316195423570985008687907853269984665640564039457584007913129639935'

    const transaction = {
        from: ETH_PUBLIC_ADDRESS,
        to: IDLE_TOKEN_ADDRESS,
        nonce: nonce,
        gas: 500000,
        data: contractAbi.methods.approve(STORE_ADDRESS, approvalAmount).encodeABI(),
    }

    await signAndSendTransaction(transaction)
}

addApproval()