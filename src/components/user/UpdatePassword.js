import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, FormControl, FormLabel, Input, Alert, AlertIcon } from '@chakra-ui/react';
import AuthContext from '../../context/AuthContext';

const UpdatePassword = () => {
    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext); // AuthContext에서 사용자 정보 가져오기
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (currentUser === null) {
            console.log("비로그인 상태");
            alert("로그인을 해야합니다.");
            navigate('/');
        } else {
            console.log("로그인 상태");
        }
    }, []); // currentUser 또는 navigate가 변경될 때마다 실행

    if (currentUser === null) {
        return null; // currentUser가 null인 경우 렌더링하지 않음
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (newPassword.trim() === '') {
            setError('새로운 비밀번호를 입력해주세요.');
            return;
        }

        const formData = {
            id: currentUser.id,
            currentPassword: currentPassword,
            newPassword: newPassword,
            command: 'updatePassword'
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/user/service`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            
            if (data.updatePassword === 'true') {
                console.log('비밀번호 변경 성공:', data);
                setSuccess('비밀번호가 변경되었습니다.');
                setError(''); // Clear any previous error messages
                alert("비밀번호가 변경 되었습니다. ");
                navigate('/user/myPage');
            } else {
                throw new Error('비밀번호 변경 실패');
            }
        } catch (error) {
            console.error('비밀번호 변경 실패:', error.message);
            setSuccess(''); // Clear any previous success messages
            setError('비밀번호 변경에 실패했습니다. 현재 비밀번호를 확인해주세요.');
        }
    };

    return (
        <Box maxW="md" mx="auto" mt={8} p={4} borderWidth="1px" borderRadius="md">
            {error && (
                <Alert status="error" mb={4}>
                    <AlertIcon />
                    {error}
                </Alert>
            )}
            {success && (
                <Alert status="success" mb={4}>
                    <AlertIcon />
                    {success}
                </Alert>
            )}
            <form onSubmit={handleSubmit}>
                <FormControl mb={6} isRequired>
                    <FormLabel>현재 비밀번호</FormLabel>
                    <Input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="현재 비밀번호를 입력하세요."
                    />
                </FormControl>
                <FormControl mb={6} isRequired>
                    <FormLabel>새로운 비밀번호</FormLabel>
                    <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="새로운 비밀번호를 입력하세요."
                    />
                </FormControl>
                <Button type="submit" colorScheme="teal" mt={4} w="100%">
                    비밀번호 변경
                </Button>
            </form>
        </Box>
    );
};

export default UpdatePassword;
