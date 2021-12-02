// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./ItemsCollection.sol";
import "./Randoms.sol";

contract ChestManager is Ownable {
    using Address for address;
    using Counters for Counters.Counter;
    using Randoms for Randoms.Random;

    event ChestUpdated(
        uint256 chestId,
        uint256[] itemsRange,
        uint256 totalWeight
    );

    event ChestOpened(
        uint256 chestId,
        uint256 itemId
    );

    uint256 totalWeight;
    uint256[] itemIds;
    uint256[] itemWeightRangeStart;
    uint256[] itemWeightRangeEnd;

    ItemsCollection private itemsCollection;
    Counters.Counter private chestIds;
    Randoms.Random private random;

    constructor(address _itemsAddress, uint64 _seed) {
        itemsCollection = ItemsCollection(_itemsAddress);
        random.seed(_seed);
    }

    function update(uint256[] memory _itemIds, uint256[] memory _rarityWeights)
        external
        onlyOwner
    {
        uint256 chestId = chestIds.current();
        chestIds.increment();

        totalWeight = calculateWeights(_itemIds, _rarityWeights);

        itemIds = _itemIds;

        emit ChestUpdated(chestId, itemIds, totalWeight);
    }

    function calculateWeights(
        uint256[] memory _itemIds,
        uint256[] memory _rarityWeights
    ) private returns (uint256) {
        uint8[] memory itemsRarity = itemsCollection.getRaritiesFor(_itemIds);

        uint256 currentWeight = 0;

        for (uint256 i = 0; i < itemsRarity.length; i++) {
            uint8 rarity = itemsRarity[i];

            uint256 currentWeightBefore = currentWeight;
            currentWeight += _rarityWeights[rarity];

            itemWeightRangeStart.push(currentWeightBefore);
            itemWeightRangeEnd.push(currentWeight - 1);
        }

        return currentWeight;
    }

    function open() external returns (uint256) {
        uint256 randomness = random.next() % (totalWeight + 1);

        for (uint256 i = 0; i < itemWeightRangeStart.length; i++) {
            uint256 rangeStart = itemWeightRangeStart[i];
            uint256 rangeEnd = itemWeightRangeEnd[i];

            if (randomness >= rangeStart && randomness <= rangeEnd) {

                emit ChestOpened(chestIds.current(), itemIds[i]);

                return itemIds[i];
            }
        }

        revert("open: couldn't find an item on this chest");
    }
}
