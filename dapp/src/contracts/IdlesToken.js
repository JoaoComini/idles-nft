import contract from '../abis/IdlesToken.json'
import { web3 } from '../provider'

export const idlesToken = new web3.eth.Contract(
    contract.abi,
    process.env.REACT_APP_IDLES_TOKEN_ADDRESS,
    {
        from: web3.eth.defaultAccount
    }
);
