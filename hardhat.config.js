/**
* @type import('hardhat/config').HardhatUserConfig
*/

require('dotenv').config();
require("@nomiclabs/hardhat-ethers");

const { ALCHEMY_API_URL, ETH_PRIVATE_ADDRESS } = process.env;

module.exports = {
    solidity: "0.8.0",
    defaultNetwork: "ropsten",
    networks: {
        hardhat: {},
        ropsten: {
            url: ALCHEMY_API_URL,
            accounts: [`0x${ETH_PRIVATE_ADDRESS}`]
        }
    },
}
