import contract from '../abis/Store.json'
import { web3 } from '../provider'

export const store = new web3.eth.Contract(
    contract.abi,
    process.env.REACT_APP_STORE_ADDRESS
);
