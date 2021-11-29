// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract IdlesItems is ERC721, Ownable {
    constructor() ERC721("Idles", "IDLE") { }

    uint8 constant public SUPPLY_ID_BITS = 216;
    uint40 constant public MAX_ITEM_ID = type(uint40).max;
    uint216 constant public MAX_TOKEN_ID = type(uint216).max;

    struct Item {
        string name;
        string description;
        string slot;

        uint rarity;
        uint256 supply;

        string attributes;
    }

    Item[] public items;

    mapping(address => bool) minters;

    modifier onlyMintersOrOwner() {
        require(minters[_msgSender()] || owner() == _msgSender());
        _;
    }

    function addMinters(address[] calldata _minters) external onlyOwner {
        for (uint256 i = 0; i < _minters.length; i++) {
            address minter = _minters[i];

            require(minters[minter] != true);

            minters[minter] = true;
        }
    }

    function addItems(Item[] calldata _items) external onlyOwner {
        require(_items.length > 0);

        for (uint256 i = 0; i < _items.length; i++) {
            Item memory item = _items[i];

            require(item.rarity >= 0 && item.rarity <= 5);
            require(bytes(item.attributes).length > 0);
            
            items.push(item);
        }
    }

    function mintToken(address _beneficiary, uint256 _itemId) public onlyMintersOrOwner returns (uint256) {
        require(_itemId < items.length);

        Item storage item = items[_itemId];
        uint256 newSupply = item.supply + 1;

        uint256 tokenId = encodeTokenId(_itemId, newSupply);

        item.supply = newSupply;

        super._safeMint(_beneficiary, tokenId);

        return tokenId;
    }

    function encodeTokenId(uint256 _itemId, uint256 _supply) public pure returns (uint256 id) {
        require(_itemId <= MAX_ITEM_ID);
        require(_supply <= MAX_TOKEN_ID);

        assembly {
            id := or(shl(SUPPLY_ID_BITS, _itemId), _supply)
        }
    }
}
