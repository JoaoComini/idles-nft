const { ethers } = require("hardhat");
const { expect } = require('chai');

describe('ChestManager', function () {
    let chestManager;
    let itemsCollection;
    let notOwner;

    beforeEach(async function () {
        const ItemsCollection = await ethers.getContractFactory("ItemsCollection");
        itemsCollection = await ItemsCollection.deploy();

        await itemsCollection.deployed();
        await itemsCollection.addItems([0, 1, 2, 3, 4], ["0:meta", "1:meta", "2:meta", "3:meta", "4:meta"]);

        const ChestManager = await ethers.getContractFactory("ChestManager");
        chestManager = await ChestManager.deploy(itemsCollection.address, 1);

        await chestManager.deployed();

        [_, notOwner] = await ethers.getSigners();
    });

    it('should revert if a non owner tries to update the chest', async function () {
        await expect(chestManager.connect(notOwner).update([0, 4]))
            .to.be.reverted;
    });

    it('should emit ChestUpdated event when it is updated', async function () {
        await expect(chestManager.update([0, 1, 2, 3, 4], [100, 40, 20, 5, 1]))
            .to.emit(chestManager, "ChestUpdated")
            .withArgs(0, [0, 1, 2, 3, 4], 166);
    });

    it('should select a random itemId', async function () {
        await chestManager.update([0, 4], [100, 40, 20, 5, 1])

        await expect(chestManager.open())
            .to.emit(chestManager, "ChestOpened")
    });

});