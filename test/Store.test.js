const { ethers } = require("hardhat");
const { expect } = require('chai');

describe('Store', function () {
    let chestManager;
    let itemsCollection;
    let idlesToken;
    let store;

    let buyer;
    let owner;

    beforeEach(async function () {
        [owner, buyer] = await ethers.getSigners();

        const ItemsCollection = await ethers.getContractFactory("ItemsCollection");
        itemsCollection = await ItemsCollection.deploy();

        await itemsCollection.deployed();
        await itemsCollection.addItems([0, 1, 2, 3, 4], ["0:meta", "1:meta", "2:meta", "3:meta", "4:meta"]);

        const ChestManager = await ethers.getContractFactory("ChestManager");
        chestManager = await ChestManager.deploy(itemsCollection.address, 1);

        await chestManager.deployed();
        await chestManager.update([0, 1, 2, 3, 4], [9, 6, 3, 2, 1]);

        const IdlesToken = await ethers.getContractFactory("IdlesToken");
        idlesToken = await IdlesToken.deploy();

        const Store = await ethers.getContractFactory("Store");
        store = await Store.deploy(idlesToken.address, chestManager.address, itemsCollection.address);
        await store.deployed();

        await itemsCollection.addMinters([store.address]);
        await idlesToken.connect(buyer).approve(store.address, '115792089237316195423570985008687907853269984665640564039457584007913129639935');
    });

    it('should not allow buying a chest if the sender does not have funds', async function () {
        await expect(store.connect(buyer).buyChest()).to.be.reverted;
    });

    it('should buy a chest, transfer the amount to the owner, and mint the item', async function () {
        await idlesToken.transfer(buyer.address, ethers.utils.parseEther("50"));

        await store.connect(buyer).buyChest();

        expect(await idlesToken.balanceOf(owner.address)).to.be.eql(ethers.utils.parseEther("1000000000"));
        expect(await itemsCollection.balanceOf(buyer.address)).to.be.equal(1);
    });

});