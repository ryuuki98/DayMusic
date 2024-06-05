// Header.js
import React, { useContext } from 'react';
import { Box, Flex, Text, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const Header = () => {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    const test = (e) => {
        navigate('/board/write');
    };

    return (
        <Box as="header" bg="white" py={4} w="100%">
            <Flex align="center" justify="space-between" maxW="1200px" mx="auto" px={4}>
                <Text fontSize="xl" fontWeight="bold" color="black" cursor="pointer" onClick={() => navigate("/board/search")}>
                    Day Music
                </Text>
                <Flex align="center" ml="auto">
                    <Button variant="link" mr={4} color="black" onClick={() => { navigate('/'); logout(); }}>
                        Logout
                    </Button>
                    <Button variant="link" mr={4} color="black">
                        Page
                    </Button>
                    <Button variant="link" mr={4} color="black">
                        Page
                    </Button>
                    <Button colorScheme="blackAlpha" bg="black" color="white" onClick={test}>
                        Write
                    </Button>
                </Flex>
            </Flex>
        </Box>
    );
};

export default Header;
