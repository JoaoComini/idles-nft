// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Address.sol";

import "./ItemsCollection.sol";

contract ChestCollection {
    using Address for address;

    struct ChestParam {
        string name;
        uint256[] rarityWeights;
    }

    struct ItemWeightRange {
        uint256 from;
        uint256 to;
    }

    struct Chest {
        string name;
        uint256 totalWeight;
    }

    event ChestAdded(uint256 chestId, string name, uint256 totalWeight);
    event ItemRangeSet(uint256 chestId, uint256 itemId, uint256 from, uint256 to);
    event ChestOpened(address opener, uint256 chestId, uint256 itemId);
    
    Chest[] private chests;
    mapping(uint256 => ItemWeightRange[]) chestItemWeightRanges;

    ItemsCollection private items;

    constructor(address _itemsAddress) {
        items = ItemsCollection(_itemsAddress);
    }

    function addChests(ChestParam[] memory _chests) external {
        for (uint256 i = 0; i < _chests.length; i++) {
            ChestParam memory param = _chests[i];

            uint256 totalWeight = calculateTotalWeight(param, chests.length);

            chests.push(
                Chest({
                    name: param.name,
                    totalWeight: totalWeight
                })
            );

            emit ChestAdded(chests.length - 1, param.name, totalWeight);
        }
    }

    function calculateTotalWeight(ChestParam memory _chest, uint256 _chestId) private returns (uint256) {
        require(_chest.rarityWeights.length == 5, "calculateTotalWeight: invalid rarityWeights");

        uint256 itemCount = items.getItemCount();
        uint256 totalWeight = 0;

        for (uint256 i = 0; i < itemCount; i++) {
            uint256 rarity = items.getRarityForItem(i);

            uint256 totalWeightBefore = totalWeight;
            totalWeight += _chest.rarityWeights[rarity];

            chestItemWeightRanges[_chestId].push(
                ItemWeightRange({
                    from: totalWeightBefore,
                    to: totalWeight
                })
            );

            emit ItemRangeSet(_chestId, i, totalWeightBefore, totalWeight);
        }

        return totalWeight;
    }
    
    function openFor(address _opener, uint256 _chestId) external {
        require(_chestId < chests.length, "openFor: chest doens't exists");

        Chest memory chest = chests[_chestId];

        uint256 random = randomNumber() % chest.totalWeight;

        ItemWeightRange[] memory ranges = chestItemWeightRanges[_chestId];

        for (uint256 i = 0; i < ranges.length; i++) {
            if (random >= ranges[i].from && random < ranges[i].to) {
                items.mintItem(_opener, i);

                emit ChestOpened(_opener, _chestId, i);

                return;
            }
        }

        require(false, "openFor: shouldn't reach here");
    }

    function randomNumber() private pure returns (uint256) {
        return 1450;
    }
}
