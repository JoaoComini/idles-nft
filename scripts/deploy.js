require("dotenv").config()

const { CHEST_MANAGER_SEED } = process.env;

async function main() {
    const itemsCollection = await ethers.getContractFactory("ItemsCollection")
    const deployedItems = await itemsCollection.deploy()

    console.log("ItemsCollection contract deployed to address:", deployedItems.address)

    const idlesToken = await ethers.getContractFactory("IdlesToken")
    const deployedToken = await idlesToken.deploy()

    console.log("Token contract deployed to address:", deployedToken.address)

    const chestManager = await ethers.getContractFactory("ChestManager")
    const deployedManager = await chestManager.deploy(deployedItems.address, CHEST_MANAGER_SEED)

    console.log("Chest Collection contract deployed to address:", deployedManager.address)

    const store = await ethers.getContractFactory("Store")
    const deployedStore = await store.deploy(deployedToken.address, deployedManager.address, deployedItems.address)

    console.log("Store contract deployed to address:", deployedStore.address)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })