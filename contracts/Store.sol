// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./IdlesToken.sol";
import "./ChestManager.sol";
import "./ItemsCollection.sol";

contract Store is Ownable {
    using Address for address;

    uint256 public constant CHEST_VALUE = 50 * 10**18;

    IdlesToken private token;
    ChestManager private chestManager;
    ItemsCollection private itemsCollection;

    constructor(address _tokenAddress, address _chestAddress, address _itemsAddress) {
        token = IdlesToken(_tokenAddress);
        chestManager = ChestManager(_chestAddress);
        itemsCollection = ItemsCollection(_itemsAddress);
    }

    function buyChest() external {
        address sender = _msgSender();
        require(token.balanceOf(sender) >= CHEST_VALUE, "buyChest: sender doesn't have enough tokens");

        uint256 itemId = chestManager.open();

        token.transferFrom(sender, owner(), CHEST_VALUE);

        itemsCollection.mintItem(sender, itemId);
    }

}
