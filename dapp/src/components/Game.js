import { useEffect, useState, useCallback } from 'react';

import {
    Spacer,
    Text,
    Button,
    Box,
    Flex,
    Center,
    useDisclosure
} from '@chakra-ui/react'

import Store from './Store';

import { useWeb3React } from '@web3-react/core';

import { idlesToken } from '../contracts/IdlesToken';

function Game() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { account, library } = useWeb3React();

    const [balance, setBalance] = useState(0);

    const getBalance = useCallback(async () => {
        setBalance(await idlesToken.methods.balanceOf(account).call());
    }, [account]);

    useEffect(() => {
        getBalance();
    }, [getBalance]);

    const formatedBalance = () => {
        return library.utils.fromWei(balance.toString());
    };

    return (
        <Box w='960px' h='540px' bg='gray.300'>
            <Store isOpen={isOpen} onClose={onClose}/>
            <Flex h='56px' p={2} bg='gray.600'>
                <Spacer />
                <Center mr={4}>
                    <Text color='white' fontSize='md'>
                        {formatedBalance()} IDLE
                    </Text>
                </Center>
                <Button onClick={onOpen}>Store</Button>
            </Flex>
            <Box w='300px' h='484px' bg='gray.500'>

            </Box>
        </Box>
    );
}

export default Game;
