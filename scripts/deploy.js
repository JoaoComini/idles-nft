async function main() {
    const itemsCollection = await ethers.getContractFactory("ItemsCollection")
    const deployedItems = await itemsCollection.deploy()

    console.log("ItemsCollection contract deployed to address:", deployedItems.address)

    const idlesToken = await ethers.getContractFactory("IdlesToken")
    const deployedToken = await idlesToken.deploy()

    console.log("Token contract deployed to address:", deployedToken.address)

    const chestCollection = await ethers.getContractFactory("ChestCollection")
    const deployedChests = await chestCollection.deploy(deployedItems.address)

    console.log("Chest Collection contract deployed to address:", deployedChests.address)

    const store = await ethers.getContractFactory("Store")
    const deployedStore = await store.deploy(deployedToken.address, deployedChests.address)

    console.log("Store contract deployed to address:", deployedStore.address)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })