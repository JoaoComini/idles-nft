import { useEffect, useState, useCallback } from 'react';

import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    Square,
    VStack,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react';

import { useWeb3React } from '@web3-react/core';

import { idlesToken } from '../contracts/IdlesToken';
import { store } from '../contracts/Store';

function Store({isOpen, onClose}) {
    const { account } = useWeb3React();

    const [allowed, setAllowed] = useState(false);

    const getAllowance = useCallback(async () => {
        const allowance = await idlesToken.methods.allowance(account, store.options.address).call();
        setAllowed(allowance >= 50 * 1E18);
    }, [account]);

    useEffect(() => {
        getAllowance();
    }, [getAllowance]);

    const handleBuy = async () => {
        await store.methods.buyChest().send({ from: account });
    };

    const handleApproval = async () => {
        const amount = '115792089237316195423570985008687907853269984665640564039457584007913129639935';
        await idlesToken.methods.approve(store.options.address, amount).send({ from: account });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Store</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack>
                        <Square size='256px' bg='gray.200'></Square>
                        {
                            allowed
                                ? <Button onClick={handleBuy}>Buy</Button>
                                : <Button onClick={handleApproval}>Approve</Button>
                        }
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}

export default Store;
