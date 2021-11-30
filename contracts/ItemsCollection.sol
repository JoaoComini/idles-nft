// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract ItemsCollection is ERC721, Ownable {
    using Address for address;

    event ItemAdded(uint256 itemId, uint256 rarity, string metadata);
    event ItemMinted(address beneficiary, uint256 itemId, uint256 newSupply);

    uint8 public constant SUPPLY_ID_BITS = 216;
    uint40 public constant MAX_ITEM_ID = type(uint40).max;
    uint216 public constant MAX_TOKEN_ID = type(uint216).max;

    uint256[] itemsRarity;
    uint256[] itemsSupply;
    string[] itemsMetadata;

    mapping(address => bool) minters;

    constructor() ERC721("Idles", "IDLE") { }

    modifier onlyMinters() {
        require(minters[_msgSender()]);
        _;
    }

    function addMinters(address[] memory _minters) external onlyOwner {
        for (uint256 i = 0; i < _minters.length; i++) {
            address minter = _minters[i];
            minters[minter] = true;
        }
    }

    function addItems(uint256[] memory _itemsRarity, string[] memory _itemsMetadata) external onlyOwner {
        require(_itemsRarity.length > 0, "addItems: rarities length should be greater than 0");
        require(_itemsMetadata.length > 0, "addItems: tokenURIs length should be greater than 0");
        require(_itemsRarity.length == _itemsMetadata.length, "addItems: rarities and tokenURIs should have the same length");

        for (uint256 i = 0; i < _itemsRarity.length; i++) {
            uint256 rarity = _itemsRarity[i];
            string memory metadata = _itemsMetadata[i];

            require(rarity >= 0 && rarity <= 4, "addItems: invalidy rarity, it should be between 0 and 4, inclusive");
            require(bytes(metadata).length > 0);

            uint256 itemId = itemsRarity.length;

            itemsRarity.push(rarity);
            itemsSupply.push(0);
            itemsMetadata.push(metadata);

            emit ItemAdded(itemId, rarity, metadata);
        }
    }

    function mintItem(address _beneficiary, uint256 _itemId)
        public
        onlyMinters
        returns (uint256)
    {
        require(_itemId < itemsSupply.length, "mintToken: item doesn't exists");

        uint256 newSupply = itemsSupply[_itemId] + 1;

        uint256 tokenId = encodeTokenId(_itemId, newSupply);

        itemsSupply[_itemId] = newSupply;

        super._safeMint(_beneficiary, tokenId);

        emit ItemMinted(_beneficiary, _itemId, newSupply);

        return tokenId;
    }

    function encodeTokenId(uint256 _itemId, uint256 _supply)
        internal
        pure
        returns (uint256 id)
    {
        require(_itemId <= MAX_ITEM_ID);
        require(_supply <= MAX_TOKEN_ID);

        assembly {
            id := or(shl(SUPPLY_ID_BITS, _itemId), _supply)
        }
    }

    function getItemsRarity() external view returns (uint256[] memory) {
        return itemsRarity;
    }

    //TODO: Override tokenURI method
}
