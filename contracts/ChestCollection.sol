// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./ItemsCollection.sol";

contract ChestCollection is Ownable {
    using Address for address;

    event ChestAdded(uint256 chestId, string name, uint256 totalWeight);

    string[] chestsName;
    uint256[] chestsTotalWeight;
    mapping(uint256 => uint256[]) chestItemWeightRangeStart;
    mapping(uint256 => uint256[]) chestItemWeightRangeEnd;

    ItemsCollection private itemsCollection;

    constructor(address _itemsAddress) {
        itemsCollection = ItemsCollection(_itemsAddress);
    }

    function addChests(
        string[] memory _chestsName,
        uint256[][] memory _chestsRarityWeights
    ) external onlyOwner {
        require(
            _chestsName.length > 0,
            "addChests: names length should be greater than 0"
        );
        require(
            _chestsRarityWeights.length > 0,
            "addChests: rarity weights length should be greater than 0"
        );
        require(
            _chestsName.length == _chestsRarityWeights.length,
            "addChests: names and rarity weights should have the same length"
        );

        for (uint256 i = 0; i < _chestsName.length; i++) {
            string memory name = _chestsName[i];
            uint256[] memory rarityWeights = _chestsRarityWeights[i];

            uint256 chestId = chestsName.length;

            uint256 totalWeight = calculateWeights(rarityWeights, chestId);

            chestsName.push(name);
            chestsTotalWeight.push(totalWeight);

            emit ChestAdded(chestId, name, totalWeight);
        }
    }

    function calculateWeights(uint256[] memory _rarityWeights, uint256 _chestId)
        private
        returns (uint256)
    {
        require(
            _rarityWeights.length == 5,
            "calculateTotalWeight: invalid rarity weights, it should have a length of 5"
        );

        uint256 totalWeight = 0;

        uint8[] memory itemsRarity = itemsCollection.getItemsRarity();

        for (uint256 i = 0; i < itemsRarity.length; i++) {
            uint8 rarity = itemsRarity[i];

            uint256 totalWeightBefore = totalWeight;
            totalWeight += _rarityWeights[rarity];

            chestItemWeightRangeStart[_chestId].push(totalWeightBefore);
            chestItemWeightRangeEnd[_chestId].push(totalWeight - 1);
        }

        return totalWeight;
    }

    function open(uint256 _chestId) external view returns (uint256) {
        require(_chestId < chestsName.length, "openFor: chest doens't exists");

        uint256 random = randomNumber() % chestsTotalWeight[_chestId];

        uint256[] memory rangeStart = chestItemWeightRangeStart[_chestId];
        uint256[] memory rangeEnd = chestItemWeightRangeEnd[_chestId];

        for (uint256 i = 0; i < rangeStart.length; i++) {
            if (random >= rangeStart[i] && random <= rangeEnd[i]) {
                return i;
            }
        }

        revert("open: couldn't find an item on this chest");
    }

    // TODO: Substitute for a real random function (prob ChainLink)
    function randomNumber() private pure returns (uint256) {
        return 1400;
    }
}
