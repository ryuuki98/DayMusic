import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Heading,
    Text,
    Stack,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    useDisclosure,
} from '@chakra-ui/react';

import AuthContext from '../../context/AuthContext';

const MyPage = () => {
    const { currentUser } = useContext(AuthContext); // AuthContext에서 사용자 정보 가져오기
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef();
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (currentUser === null) {
            console.log('비로그인 상태');
            alert('로그인을 해야합니다.');
            navigate('/');
        } else {
            console.log('로그인 상태');
        }
    }, [currentUser, navigate]);

    if (currentUser === null) {
        return null; // currentUser가 null인 경우 렌더링하지 않음
    }

    const handleDelete = () => {
        setIsDeleting(true);

        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json;charset=utf-8');

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({
                command: 'deleteUser',
                id: currentUser.id,
            }),
            credentials: 'include',
        };

        fetch(`${process.env.REACT_APP_SERVER_URL}/user/service`, requestOptions)
            .then((response) => {
                return response.json().then((data) => {
                    // JSON으로 파싱
                    if (response.ok) {
                        console.log('탈퇴가 완료 되었습니다:', data);
                    } else {
                        console.error('탈퇴 실패:', data);
                    }
                });
            })
            .catch((error) => {
                console.error('로그인 오류:', error);
            });

        console.log('회원 탈퇴 진행 중...');
        setTimeout(() => {
            // 탈퇴 완료 후 처리
            setIsDeleting(false);
            onClose();
            console.log('회원 탈퇴 완료');
            alert('탈퇴가 완료 되었습니다');
            navigate('/');
        }, 2000);
    };

    return (
        <Box maxW="md" mx="auto" mt={8} p={4} borderWidth="1px" borderRadius="md" boxShadow="lg">
            <Heading as="h1" size="lg" mb={6}>
                My Page
            </Heading>
            <Text fontSize="lg" mb={2}>
                <strong>ID:</strong> {currentUser.id}
            </Text>
            <Text fontSize="lg" mb={4}>
                <strong>Nickname:</strong> {currentUser.nickname}
            </Text>

            <Stack spacing={4}>
                <Button colorScheme="teal" onClick={() => navigate('/user/updateNickname')}>
                    닉네임 변경
                </Button>
                <Button colorScheme="teal" onClick={() => navigate('/user/updatePassword')}>
                    비밀번호 변경
                </Button>
                <Button colorScheme="teal" onClick={() => navigate('/user/updateUserInfo')}>
                    개인정보 수정
                </Button>
                <Button colorScheme="teal" onClick={onOpen}>
                    회원 탈퇴
                </Button>
            </Stack>

            <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            회원 탈퇴
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            회원을 탈퇴하시겠습니까? 회원 탈퇴 시 작성되었던 글이 전부 사라집니다.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                아니오
                            </Button>
                            <Button colorScheme="red" onClick={handleDelete} ml={3} isLoading={isDeleting}>
                                예
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Box>
    );
};

export default MyPage;
