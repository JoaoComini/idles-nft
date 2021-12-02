import './App.css';

import { ChakraProvider } from '@chakra-ui/react';
import Layout from './components/Layout';

import { useWeb3React } from '@web3-react/core';

import Home from './components/Home';
import Game from './components/Game';

function App() {
    const { account } = useWeb3React();

    return (
        <ChakraProvider>
            <Layout>
                {account ? <Game /> : <Home />}
            </Layout>
        </ChakraProvider>
    );
}

export default App;
