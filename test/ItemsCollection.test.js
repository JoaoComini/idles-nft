const { ethers } = require("hardhat");
const { expect } = require('chai');

describe('ItemsCollection', function () {
    let owner;
    let minter;
    let contract;

    beforeEach(async function () {
        const ItemsCollection = await ethers.getContractFactory("ItemsCollection");

        contract = await ItemsCollection.deploy();

        await contract.deployed();

        [owner, minter] = await ethers.getSigners();
    });

    it('should not allow minting from a non allowed address', async function () {
        await expect(contract.mintItem(owner.address, 0)).to.be.reverted;
    });

    it('should allow minting from an allowed address', async function () {
        await contract.addItems([0], ["metadata"]);
        await contract.addMinters([minter.address]);

        await expect(contract.connect(minter).mintItem(owner.address, 0))
            .to.emit(contract, "ItemMinted")
            .withArgs(owner.address, 0, 1);

        expect(await contract.balanceOf(owner.address)).to.be.equal(1);
    });

    it('should add items correctly', async function () {
        await expect(contract.addItems([0, 1, 2], ["0:meta", "1:meta", "2:meta"]))
            .to.emit(contract, "ItemAdded")
            .withArgs(0, 0, "0:meta")
            .to.emit(contract, "ItemAdded")
            .withArgs(1, 1, "1:meta")
            .to.emit(contract, "ItemAdded")
            .withArgs(2, 2, "2:meta");

        expect(await contract.getItemsRarity()).to.be.eql([0, 1, 2]);
    });

});