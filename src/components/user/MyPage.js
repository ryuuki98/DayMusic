import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Heading, Text, Stack, Alert, AlertIcon } from '@chakra-ui/react';
import AuthContext from '../../context/AuthContext';

const MyPage = () => {
    const {currentUser} = useContext(AuthContext); // AuthContext에서 사용자 정보 가져오기
    const navigate = useNavigate();

    return (
        <Box maxW="md" mx="auto" mt={8} p={4} borderWidth="1px" borderRadius="md" boxShadow="lg">
            <Heading as="h1" size="lg" mb={6}>My Page</Heading>
            <Text fontSize="lg" mb={2}><strong>ID:</strong> {currentUser.id}</Text>
            <Text fontSize="lg" mb={4}><strong>Nickname:</strong> {currentUser.nickname} </Text>

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
