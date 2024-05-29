// Root.js
import React from 'react';
import Header from './module/Header';
import Footer from './module/Footer';
import Sidebar from './module/SideBar';
import { Outlet } from 'react-router-dom';
import { Box, Flex } from '@chakra-ui/react';

const Root = () => {
    return (
        <Box>
            <Header />
            <Flex>
                <Sidebar />
                <Box flex="1" ml="200px" mt="60px" p={4}> {/* Sidebar의 width만큼 margin-left를 주고, 헤더 높이만큼 margin-top을 줍니다 */}
                    <Outlet />
                </Box>
            </Flex>
            <Footer />
        </Box>
    );
};

export default Root;
