import { useEffect, useState, useCallback } from 'react';

import { Box, Text } from '@chakra-ui/react'
import { useWeb3React } from '@web3-react/core';

import { idlesToken } from '../contracts/IdlesToken';

function Game() {
    const { account, library } = useWeb3React()

    const [balance, setBalance] = useState(0);

    const getBalance = useCallback(async () => {
        console.log(await idlesToken.methods.balanceOf(account).call());
        setBalance(await idlesToken.methods.balanceOf(account));
    }, [account, library.eth]);

    useEffect(() => {
        getBalance();
    }, [balance, getBalance])

    const formatedBalance = () => {
        return library.utils.fromWei(balance.toString())
    };

    return (
        <Box>
            <Text color="white" fontSize="md">
                {formatedBalance()} ETH
            </Text>
        </Box>
    );
}

export default Game;
