// Header.js
import React from 'react';
import { Box, Flex, Text, Button } from '@chakra-ui/react';

const Header = () => {
    return (
        <Box as="header" bg="white" borderBottom="1px solid" borderColor="gray.200" py={4}>
            <Flex align="center" justify="space-between" maxW="1200px" mx="auto" px={4}>
                <Text fontSize="xl" fontWeight="bold">
                    Day Music
                </Text>
                <Flex align="center">
                    <Button variant="link" mr={4}>
                        Page
                    </Button>
                    <Button variant="link" mr={4}>
                        Page
                    </Button>
                    <Button variant="link" mr={4}>
                        Page
                    </Button>
                    <Button colorScheme="blackAlpha">Button</Button>
                </Flex>
            </Flex>
        </Box>
    );
};

export default Header;
