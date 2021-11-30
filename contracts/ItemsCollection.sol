// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract ItemsCollection is ERC721, Ownable {
    using Address for address;

    constructor() ERC721("Idles", "IDLE") {}

    struct ItemParam {
        uint256 rarity;
        string metadata;
    }

    struct Item {
        uint256 rarity;
        uint256 supply;
        string metadata;
    }

    event MinterAdded(address minter);
    event ItemAdded(uint256 itemId, uint256 rarity, string metadata);
    event ItemMinted(address beneficiary, uint256 itemId, uint256 newSupply);

    uint8 public constant SUPPLY_ID_BITS = 216;
    uint40 public constant MAX_ITEM_ID = type(uint40).max;
    uint216 public constant MAX_TOKEN_ID = type(uint216).max;

    Item[] private items;

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

            emit MinterAdded(minter);
        }
    }

    function addItems(ItemParam[] calldata _items) external onlyOwner {
        require(_items.length > 0);

        for (uint256 i = 0; i < _items.length; i++) {
            ItemParam memory param = _items[i];

            require(bytes(param.metadata).length > 0);
            require(param.rarity >= 0 && param.rarity <= 4);

            items.push(
                Item({
                    rarity: param.rarity,
                    supply: 0,
                    metadata: param.metadata
                })
            );

            emit ItemAdded(items.length - 1, param.rarity, param.metadata);
        }
    }

    function mintItem(address _beneficiary, uint256 _itemId)
        public
        onlyMintersOrOwner
        returns (uint256)
    {
        require(_itemId < items.length, "mintToken: item doesn't exists");

        Item storage item = items[_itemId];
        uint256 newSupply = item.supply + 1;

        uint256 tokenId = encodeTokenId(_itemId, newSupply);

        item.supply = newSupply;

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

    function getItemCount() external view returns (uint256) {
        return items.length;
    }

    function getRarityForItem(uint256 _itemId) external view returns (uint256) {
        return items[_itemId].rarity;
    }

    //TODO: Override tokenURI method
}
