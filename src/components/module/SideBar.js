import React, { useContext, useEffect, useState } from 'react';
import {
    Box,
    Button,
    VStack,
    useDisclosure,
    Input,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
    Text,
    Alert,
    AlertIcon,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const Sidebar = () => {
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { currentUser } = useContext(AuthContext); // 로그인 정보 확인
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState('');

    const cancelRef = React.useRef();

    const handleFollowClick = () => {
        if (currentUser === null) {
            alert('로그인을 해야합니다.');
            navigate('/');
        } else {
            navigate('/follow');
        }
    };

    const handleMyPageClick = () => {
        if (currentUser === null) {
            alert('로그인을 해야합니다.');
            navigate('/');
        } else {
            navigate('/user/mypage');
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (searchQuery.trim() === '') {
                setSearchResults([]);
                return;
            }
            try {
                const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/user/service`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        //
                    },
                    body: JSON.stringify({
                        command: 'searchUserList',
                        nickname: searchQuery,
                    }),
                });

                if (!response.ok) {
                    throw new Error('검색에 실패했습니다.');
                }

                const data = await response.json();
                setSearchResults(data.results);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchSearchResults();
    }, [searchQuery]);

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
                <Button onClick={() => navigate('/board/search')} width="full" variant="ghost">
                    Home
                </Button>
                <Button onClick={onOpen} width="full" variant="ghost">
                    Search
                </Button>
                <Button onClick={handleFollowClick} width="full" variant="ghost">
                    follow
                </Button>
                <Button onClick={handleMyPageClick} width="full" variant="ghost">
                    MyPage
                </Button>
            </VStack>

            <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            검색
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            <Input
                                placeholder="검색어를 입력하세요"
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                            {error && (
                                <Alert status="error" mt={4}>
                                    <AlertIcon />
                                    {error}
                                </Alert>
                            )}
                            {searchResults.length > 0 && (
                                <VStack mt={4} spacing={2} align="start">
                                    {searchResults.map((user) => (
                                        <Text key={user.id}>{user.nickname}</Text>
                                    ))}
                                </VStack>
                            )}
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                닫기
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Box>
    );
};

export default Sidebar;
