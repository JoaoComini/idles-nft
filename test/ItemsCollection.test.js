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

    it('should return the item metadata', async function () {
        await contract.addItems([0], ["metadata"]);

        expect(await contract.tokenURI(0)).to.be.equal("metadata");
    });

    it('should revert if the item metadata does not exists', async function () {
        await contract.addItems([0], ["metadata"]);

        await expect(contract.tokenURI(1)).to.be.reverted;
    });

    it('should add items correctly', async function () {
        await expect(contract.addItems([3, 3, 3], ["0:meta", "1:meta", "2:meta"]))
            .to.emit(contract, "ItemAdded")
            .withArgs(0, 3, "0:meta")
            .to.emit(contract, "ItemAdded")
            .withArgs(1, 3, "1:meta")
            .to.emit(contract, "ItemAdded")
            .withArgs(2, 3, "2:meta");

        expect(await contract.getRaritiesFor([0, 1, 2])).to.be.eql([3, 3, 3]);
    });

});