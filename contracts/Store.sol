// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./IdlesToken.sol";
import "./ChestCollection.sol";

contract Store is Ownable {
    using Address for address;

    uint256 public constant CHEST_VALUE = 50 * 10**18;

    IdlesToken private token;
    ChestCollection private chest;

    constructor(address _tokenAddress, address _chestAddress) {
        token = IdlesToken(_tokenAddress);
        chest = ChestCollection(_chestAddress);
    }

    function buyChest(uint256 _chestId) external {
        address sender = _msgSender();

        require(token.balanceOf(sender) >= CHEST_VALUE, "buyChest: sender doesn't have enough tokens");

        token.transferFrom(sender, owner(), CHEST_VALUE);

        chest.openFor(sender, _chestId);
    }
}
