const { 
    getContract,
    getTransactionCount,
    signAndSendTransaction 
} = require("./utils/web3")

const ETH_PUBLIC_ADDRESS = process.env.ETH_PUBLIC_ADDRESS

const contract = require("../artifacts/contracts/IdlesItems.sol/IdlesItems.json")
const contractAddress = "0x6444CFE6daAd8699A35A94d783F2310700706545"

const contractAbi = getContract(contract.abi, contractAddress)

const items = [
    {
        name: "Great Sword",
        description: "A great sword.",
        slot: "2h",
        rarity: 0,
        supply: 0,
        attributes: "dmg:10|atkspeed:1"
    }
]

async function addItems() {
    const nonce = await getTransactionCount();

    const transaction = {
        from: ETH_PUBLIC_ADDRESS,
        to: contractAddress,
        nonce: nonce,
        gas: 500000,
        data: contractAbi.methods.addItems(items).encodeABI(),
    }

    await signAndSendTransaction(transaction)
}

addItems()