async function main() {
    // const idlesItems = await ethers.getContractFactory("IdlesItems")
    // const deployedItems = await idlesItems.deploy()

    // console.log("Items contract deployed to address:", deployedItems.address)

    // const idlesToken = await ethers.getContractFactory("IdlesToken")
    // const deployedToken = await idlesToken.deploy()

    // console.log("Token contract deployed to address:", deployedToken.address)

    const store = await ethers.getContractFactory("Store")
    const deployedStore = await store.deploy(deployedToken.address)

    console.log("Store contract deployed to address:", deployedStore.address)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })