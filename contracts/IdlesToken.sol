// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract IdlesToken is ERC20 {
    uint256 constant public TOTAL_SUPPLY = 10 ** 9;

    constructor() ERC20("Idles Token", "IDLE") {
        _mint(_msgSender(), TOTAL_SUPPLY * decimals());
    }
}
