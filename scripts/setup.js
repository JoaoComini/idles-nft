const {
    ITEMS_COLLECTION_ADDRESS,
    CHEST_MANAGER_ADDRESS,
    STORE_ADDRESS
} = require("./utils/addresses");

async function main() {
    const itemsCollectionFactory = await ethers.getContractFactory("ItemsCollection");
    const itemsCollection = await itemsCollectionFactory.attach(ITEMS_COLLECTION_ADDRESS);

    const itemsRarity = [0, 1, 2, 3 ,4];
    const itemsMetadata = ["url", "url", "url", "url" ,"url"];

    await itemsCollection.addItems(itemsRarity, itemsMetadata);
    await itemsCollection.addMinters([STORE_ADDRESS]);

    const chestManagerFactory = await ethers.getContractFactory("ChestManager");
    const chestManager = await chestManagerFactory.attach(CHEST_MANAGER_ADDRESS);

    const itemIds = [0, 1, 2, 3, 4];
    const rarityWeights = [120, 20, 6, 3, 1];

    await chestManager.update(itemIds, rarityWeights);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })