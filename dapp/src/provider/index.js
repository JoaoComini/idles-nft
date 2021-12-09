import { InjectedConnector } from '@web3-react/injected-connector';
import { createAlchemyWeb3 } from '@alch/alchemy-web3';

import Web3 from 'web3';

export const injected = new InjectedConnector({ supportedNetworks: [1, 3, 4, 5, 42] });

export const web3 = process.env.NODE_ENV === 'development' 
    ? new Web3(Web3.givenProvider || 'http://127.0.0.1/8535')
    : createAlchemyWeb3(process.env.REACT_APP_ALCHEMY_URL);
