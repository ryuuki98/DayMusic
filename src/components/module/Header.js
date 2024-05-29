// Header.js
import React from 'react';
import { Box, Flex, Text, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();

    return (
        <Box as="header" bg="white" py={4}>
            <Flex align="center" justify="space-between" maxW="1200px" mx="auto" px={4}>
                <Text fontSize="xl" fontWeight="bold" color="black" cursor={"pointer"} onClick={() =>navigate("/board/search") }>
                    Day Music
                </Text>
                <Flex align="center">
                    <Button variant="link" mr={4} color="black">
                        Page
                    </Button>
                    <Button variant="link" mr={4} color="black">
                        Page
                    </Button>
                    <Button variant="link" mr={4} color="black">
                        Page
                    </Button>
                    <Button colorScheme="blackAlpha" bg="black" color="white">
                        Button
                    </Button>
                </Flex>
            </Flex>
        </Box>
    );
};

export default Header;
