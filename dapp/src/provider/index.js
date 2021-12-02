import { InjectedConnector } from '@web3-react/injected-connector'
import { createAlchemyWeb3 } from '@alch/alchemy-web3'

export const injected = new InjectedConnector({ supportedNetworks: [1, 3, 4, 5, 42] })
export const web3 = createAlchemyWeb3(process.env.REACT_APP_ALCHEMY_URL)
