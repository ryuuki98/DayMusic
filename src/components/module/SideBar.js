// Sidebar.js
import React from 'react';
import { Box, Button, VStack, useDisclosure, Input, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = React.useRef();

    const handleMyPageClick = () => {
        navigate('/user/myPage');
    };

    const handleSearch = () => {
        // 검색 로직 추가
        onClose();
    };

    return (
        <Box
            as="aside"
            position="fixed"
            left={0}
            top="60px" // 헤더 높이만큼 내립니다.
            height="calc(100vh - 60px)"
            width="200px"
            bg="white"
            p={4}
            borderRight="1px solid gray"
        >
            <VStack spacing={4} align="start">
                <Button onClick={() =>navigate("/board/search")} width="full" variant="ghost" >
                    Home
                </Button>
                <Button onClick={onOpen} width="full" variant="ghost" >
                    Search
                </Button>
                <Button onClick={handleMyPageClick} width="full" variant="ghost" >
                    MyPage
                </Button>
            </VStack>

            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            검색
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            <Input placeholder="검색어를 입력하세요" />
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                취소
                            </Button>
                            <Button colorScheme="blue" onClick={handleSearch} ml={3}>
                                검색
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Box>
    );
};

export default Sidebar;
