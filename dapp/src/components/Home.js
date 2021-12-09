import { Flex, Button } from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';

import { injected } from '../provider';

function Home() {

    const { activate } = useWeb3React();

    const handleClick = () => {
        activate(injected);
    };

    return (
        <Flex
            alignItems="center"
            justifyContent="center"
            h="100vh"
        >
            <Button onClick={handleClick}>Connect to a wallet</Button>
        </Flex>
    );
}

export default Home;
