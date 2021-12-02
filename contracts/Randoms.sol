// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

library Randoms {

    struct Random {
        uint64 state;
    }

    function seed(Random storage _self, uint64 _seed) internal {
        _self.state = _seed;
    }

    function next(Random storage _self) internal returns (uint64) {
        require(_self.state > 0, "next: seed should not be 0");

        uint64 result = 0;

        for (uint256 i = 0; i < 64; i++) {
            result = shiftLeft(result, 1) | (_self.state & 1);

            uint64 newBit = (_self.state ^ shiftRight(_self.state, 1) ^ shiftRight(_self.state, 3) ^ shiftRight(_self.state, 4)) & 1;
            _self.state = (shiftRight(_self.state, 1) | shiftLeft(newBit, 63));
        }

        return result;
    }

    function shiftRight(uint64 _number, uint64 _bits) internal pure returns (uint64) {
        unchecked {
            return _number / (uint64(2) ** _bits);
        }
    }

    function shiftLeft(uint64 _number, uint64 _bits) internal pure returns (uint64) {
        unchecked {
            return _number * (uint64(2) ** _bits);
        }
    }
}