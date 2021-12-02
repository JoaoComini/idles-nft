/**
* @type import('hardhat/config').HardhatUserConfig
*/

require('dotenv').config();
require("@nomiclabs/hardhat-waffle");

const { ALCHEMY_API_URL, ETH_PRIVATE_ADDRESS } = process.env;

module.exports = {
    solidity: "0.8.0",
    settings: {},
    networks: {
        hardhat: {},
        kovan: {
            url: ALCHEMY_API_URL,
            accounts: [`0x${ETH_PRIVATE_ADDRESS}`]
        }
    },
}
