const { ethers } = require("hardhat");
const { expect } = require('chai');

describe('ChestCollection', function () {
    let chestCollection;
    let itemsCollection;
    let notOwner;

    beforeEach(async function () {
        const ItemsCollection = await ethers.getContractFactory("ItemsCollection");
        itemsCollection = await ItemsCollection.deploy();

        await itemsCollection.deployed();
        await itemsCollection.addItems([0, 1, 2, 3, 4], ["0:meta", "1:meta", "2:meta", "3:meta", "4:meta"]);

        const ChestCollection = await ethers.getContractFactory("ChestCollection");
        chestCollection = await ChestCollection.deploy(itemsCollection.address);

        await chestCollection.deployed();

        [ _, notOwner ] = await ethers.getSigners();
    });

    it('should revert if a non owner tries to add chests', async function () {
        await expect(chestCollection.connect(notOwner).addChests(["Chest"], [[18, 9, 7, 3, 1]]))
            .to.be.reverted;
    });

    it('should emit ChestAdded events for each chest added', async function () {
        await expect(chestCollection.addChests(["First", "Second"], [[18, 9, 7, 3, 1], [9, 6, 3, 2, 1]]))
            .to.emit(chestCollection, "ChestAdded")
            .withArgs(0, "First", 38)
            .to.emit(chestCollection, "ChestAdded")
            .withArgs(1, "Second", 21);
    });

    it('should select a random itemId', async function () {
        await chestCollection.addChests(["Chest"], [[18, 9, 7, 3, 1]])

        const itemId = await chestCollection.open(0);
        expect(itemId.toNumber()).to.be.oneOf([0, 1, 2, 3, 4])
    });

});