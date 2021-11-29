// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./IdlesToken.sol";
import "./IdlesItems.sol";

contract Store is Ownable {
    using Address for address;

    uint256 constant public COMMON_CHEST_VALUE = 10 ** 18;

    IdlesToken private token;
    IdlesItems private items;

    constructor(address _tokenAddress, address _itemsAddress) {
        token = IdlesToken(_tokenAddress);
        items = IdlesItems(_itemsAddress);
    }
    
    function buyChest() public {
        address sender = _msgSender();

        require(token.balanceOf(sender) >= COMMON_CHEST_VALUE);

        token.transferFrom(sender, owner(), COMMON_CHEST_VALUE);

        items.mintToken(sender, 0);
    }
}
