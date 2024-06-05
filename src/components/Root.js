// Root.js
import React from 'react';
import Header from './module/Header';
import Footer from './module/Footer';
import Sidebar from './module/SideBar';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Box, Flex, Button } from '@chakra-ui/react';

const Root = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <Box>
            <Header />
            <Flex>
                <Sidebar />
                <Box flex="1" ml="200px" mt="60px" p={4}>
                    <Flex mb={4} align="center" marginLeft={"100px"}>
                        <Button
                            variant="link"
                            fontSize="2xl"
                            mr={6}
                            color={location.pathname === '/board/search' ? 'black' : 'gray.500'}
                            _hover={{ textDecoration: 'none' }}
                            _focus={{ boxShadow: 'none' }}
                            onClick={() => handleNavigation('/board/search')}
                        >
                            Home
                        </Button>
                        <Button
                            variant="link"
                            fontSize="2xl"
                            mr={6}
                            color={location.pathname === '/board/follow' ? 'black' : 'gray.500'}
                            _hover={{ textDecoration: 'none' }}
                            _focus={{ boxShadow: 'none' }}
                            onClick={() => handleNavigation('/board/follow')}
                        >
                            Follow
                        </Button>
                        <Button
                            variant="link"
                            fontSize="2xl"
                            mr={6}
                            color={location.pathname === '/rank/rankAll' ? 'black' : 'gray.500'}
                            _hover={{ textDecoration: 'none' }}
                            _focus={{ boxShadow: 'none' }}
                            onClick={() => handleNavigation('/rank/rankAll')}
                        >
                            Ranking
                        </Button>
                    </Flex>
                    <Outlet />
                </Box>
            </Flex>
            <Footer />
        </Box>
    );
};

export default Root;
