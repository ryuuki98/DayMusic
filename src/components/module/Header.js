import { Box, Heading } from '@chakra-ui/react';
import React from 'react';

const Header = () => {
    return (
        <Box>
            <Heading>{process.env.REACT_APP_SERVER_URL}</Heading>
        </Box>
    );
};

export default Header;
