import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Heading, Text, Stack, Alert, AlertIcon } from '@chakra-ui/react';
import AuthContext from '../../context/AuthContext';

const MyPage = () => {
    const [userInfo, setUserInfo] = useState({ userId: '', nickname: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const user = useContext(AuthContext);
    console.log("user :" ,user);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_SERVER_URL}/user/session`, {
            method: 'GET',
            credentials: 'include',
        })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('User not logged in');
            }
        })
        .then((data) => {
            console.log("nickname : ",data.nickname);
            setUserInfo({ userId: data.userId, nickname: data.nickname });
        })
        .catch((error) => {
            setError('사용자 정보를 가져올 수 없습니다.');
            console.error('Error fetching user info:', error);
            navigate('/'); // 사용자 정보가 없으면 로그인 페이지로 이동
        });
    }, []); // 빈 배열을 의존성 배열로 지정하여 컴포넌트가 처음 렌더링될 때만 실행

    if (error) {
        return (
            <Box maxW="md" mx="auto" mt={8} p={4}>
                <Alert status="error">
                    <AlertIcon />
                    {error}
                </Alert>
            </Box>
        );
    }

    return (
        <Box maxW="md" mx="auto" mt={8} p={4} borderWidth="1px" borderRadius="md" boxShadow="lg">
            <Heading as="h1" size="lg" mb={6}>My Page</Heading>
            <Text fontSize="lg" mb={2}><strong>ID:</strong> {userInfo.userId}</Text>
            <Text fontSize="lg" mb={4}><strong>Nickname:</strong> {userInfo.nickname}</Text>

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
            </Stack>
        </Box>
    );
};

export default MyPage;
