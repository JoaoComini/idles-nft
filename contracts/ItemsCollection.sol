// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract ItemsCollection is ERC721, Ownable {
    using Address for address;

    event ItemAdded(uint256 itemId, uint256 rarity, string metadata);
    event ItemMinted(address beneficiary, uint256 itemId, uint256 newSupply);

    uint8 public constant SUPPLY_BITS = 216;
    uint40 public constant MAX_ITEM_ID = type(uint40).max;
    uint216 public constant MAX_SUPPLY = type(uint216).max;

    uint8[] itemsRarity;
    uint256[] itemsSupply;
    string[] itemsMetadata;

    mapping(address => bool) minters;

    constructor() ERC721("Idles", "IDLE") {}

    modifier onlyMinters() {
        require(
            minters[_msgSender()],
            "onlyMinters: only allowed addresses can mint a new item"
        );
        _;
    }

    function addMinters(address[] memory _minters) external onlyOwner {
        for (uint256 i = 0; i < _minters.length; i++) {
            address minter = _minters[i];
            minters[minter] = true;
        }
    }

    function addItems(
        uint8[] memory _itemsRarity,
        string[] memory _itemsMetadata
    ) external onlyOwner {
        require(
            _itemsRarity.length > 0,
            "addItems: rarities length should be greater than 0"
        );
        require(
            _itemsMetadata.length > 0,
            "addItems: tokenURIs length should be greater than 0"
        );
        require(
            _itemsRarity.length == _itemsMetadata.length,
            "addItems: rarities and tokenURIs should have the same length"
        );

        for (uint256 i = 0; i < _itemsRarity.length; i++) {
            uint8 rarity = _itemsRarity[i];
            string memory metadata = _itemsMetadata[i];

            require(
                rarity >= 0 && rarity <= 4,
                "addItems: invalidy rarity, it should be between 0 and 4, inclusive"
            );
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
        require(_supply <= MAX_SUPPLY);

        assembly {
            id := or(shl(SUPPLY_BITS, _itemId), _supply)
        }
    }

    function getRaritiesFor(uint256[] memory _itemIds)
        external
        view
        returns (uint8[] memory)
    {
        uint8[] memory slicedItemsRarity = new uint8[](_itemIds.length);

        for (uint256 i = 0; i < slicedItemsRarity.length; i++) {
            uint256 itemId = _itemIds[i];

            require(
                _itemExists(itemId),
                "getRaritiesFor: getting rarity of a item that does not exists"
            );

            slicedItemsRarity[i] = itemsRarity[itemId];
        }

        return slicedItemsRarity;
    }

    function tokenURI(uint256 _tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _itemExists(_tokenId),
            "tokenURI: item metadata does not exists"
        );

        (uint256 itemId, ) = decodeTokenId(_tokenId);

        return itemsMetadata[itemId];
    }

    function _itemExists(uint256 _itemId) internal view returns (bool) {
        return bytes(itemsMetadata[_itemId]).length > 0;
    }

    function decodeTokenId(uint256 _id)
        public
        pure
        returns (uint256 itemId, uint256 supply)
    {
        uint256 mask = MAX_SUPPLY;

        assembly {
            itemId := shr(SUPPLY_BITS, _id)
            supply := and(mask, _id)
        }
    }
}
