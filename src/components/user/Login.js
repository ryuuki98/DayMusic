// Login.js
import React, { useState, useContext } from 'react';
import { Box, Button, Flex, FormControl, FormLabel, Input, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const Login = () => {
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        const id = document.getElementById('id-input').value;
        const password = document.getElementById('password-input').value;
        const command = 'login';

        if (id.trim() === '' || password.trim() === '') {
            setError('ID와 비밀번호를 모두 입력해주세요.');
        } else {
            setError('');

            const myHeaders = new Headers();
            myHeaders.append('Content-Type', 'application/json;charset=utf-8');

            const requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify({
                    command: command,
                    id: id,
                    password: password,
                }),
                credentials: 'include',
            };

            fetch(`${process.env.REACT_APP_SERVER_URL}/user/service`, requestOptions)
                .then((response) => {
                    return response.json().then((data) => {
                        if (response.ok) {
                            console.log('로그인 성공:', data);
                            const { id, nickname } = data;
                            login({ id, nickname });
                            navigate('/board/search');
                        } else {
                            setError('로그인 실패. ID와 비밀번호를 확인해주세요.');
                            console.error('로그인 실패:', data);
                        }
                    });
                })
                .catch((error) => {
                    setError('로그인 중 오류가 발생했습니다. 나중에 다시 시도해주세요.');
                    console.error('로그인 오류:', error);
                });
        }
    };

    const handleSignup = () => {
        navigate('/user/join');
    };

    return (
        <Box>
            <Flex align="center" justify="center" height="80vh">
                <Box w="md" p={8} bg="white" color="black">
                    <Text fontSize="3xl" mb={4} textAlign="center">
                        Daymusic
                    </Text>
                    <Text fontSize="md" mb={6} textAlign="center" color="gray.500">
                        And a subheading describing your site, too
                    </Text>
                    <form onSubmit={handleSubmit}>
                        {error && (
                            <Text color="red.500" mb={4}>
                                {error}
                            </Text>
                        )}
                        <VStack spacing={4}>
                            <FormControl id="id-input" isRequired>
                                <FormLabel>아이디</FormLabel>
                                <Input type="text" placeholder='아이디' />
                            </FormControl>
                            <FormControl id="password-input" isRequired>
                                <FormLabel>비밀번호</FormLabel>
                                <Input type="password" placeholder='패스워드'/>
                            </FormControl>
                            <Button type="submit" bg="black" color="white" width="full">
                                로그인
                            </Button>
                        </VStack>
                    </form>

                    <Button bg="black" color="white" onClick={handleSignup} size="sm" mt={4} width="full">
                        회원가입
                    </Button>
                    <Flex justify="space-between" mt={4}>
                        <Button variant="link" colorScheme="black" onClick={() => navigate('/user/find-id')}>
                            아이디찾기
                        </Button>
                        <Button variant="link" colorScheme="black" onClick={() => navigate('/user/find-password')}>
                            비밀번호찾기
                        </Button>
                    </Flex>
                </Box>
            </Flex>
        </Box>
    );
};

export default Login;
