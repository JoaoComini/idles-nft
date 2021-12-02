import { useState, useEffect, useCallback } from 'react';

import { Container } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'

import { useWeb3React } from '@web3-react/core'
import { injected } from '../connectors'


function Layout() {
    const { active, activate, account, library } = useWeb3React()

    const [loaded, setLoaded] = useState(false)
    const [balance, setBalance] = useState(0);

    const getWallet = async () => {
        const isAuthorized = await injected.isAuthorized()

        setLoaded(true)

        if (isAuthorized && !active) {
            activate(injected)
        }
    };

    const getBalance = useCallback(async () => {
        library && setBalance(await library.eth.getBalance(account));
    }, [library, account]);

    const handleClick = () => {
        activate(injected);
    }

    useEffect(() => {
        getWallet();
        getBalance();
    }, [balance, getBalance]);

    return account ? (
        <Container>
            {balance}
        </Container>
    ) : (
        <Container>
            <Button onClick={handleClick}> Connect </Button>
        </Container>
    )
}

export default Layout;
