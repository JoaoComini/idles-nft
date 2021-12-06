import { useEffect, useState, useCallback } from 'react';

import { Box, Text, Button } from '@chakra-ui/react'
import { useWeb3React } from '@web3-react/core';

import { idlesToken } from '../contracts/IdlesToken';
import { itemsCollection } from '../contracts/ItemsCollection';
import { store } from '../contracts/Store';

function Game() {
    const { account, library } = useWeb3React()

    const [balance, setBalance] = useState(0);
    const [items, setItems] = useState(0);

    const getBalance = useCallback(async () => {
        setBalance(await idlesToken.methods.balanceOf(account).call());
    }, [account]);

    const getItems = useCallback(async () => {
        console.log(await itemsCollection.methods.balanceOf(account).call());
        setItems(await itemsCollection.methods.balanceOf(account).call());
    }, [account]);

    useEffect(() => {
        getBalance();
        getItems();
    }, [getBalance, getItems]);

    const formatedBalance = () => {
        return library.utils.fromWei(balance.toString());
    };

    const handleClick = async () => {
        const amount = '115792089237316195423570985008687907853269984665640564039457584007913129639935'

        const allowance = await idlesToken.methods.allowance(account, store.options.address).call();
        
        if (allowance > 0) {
            await store.methods.buyChest().send({from: account})
        } else {
            await idlesToken.methods.approve(store.options.address, amount).send({from: account})
        }
    };

    return (
        <Box>
            <Text color="white" fontSize="md">
                {items} Items
            </Text>
            <Text color="white" fontSize="md">
                {formatedBalance()} IDLE
            </Text>
            <Button onClick={handleClick}>Buy chest</Button>
        </Box>
    );
}

export default Game;
