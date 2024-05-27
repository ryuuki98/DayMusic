import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, FormControl, FormLabel, Input } from '@chakra-ui/react';
import InputField from '../item/InputField';

const UpdateNickname = () => {
    const navigate = useNavigate();
    const [nickname, setNickname] = useState('');
    const [currentNickname, setCurrentNickname] = useState('');
    const [userId, setUserId] = useState(''); // 추가된 부분: userId를 저장할 상태
    const [error, setError] = useState('');
    const [isValidNickname, setIsValidNickname] = useState(false); // 수정된 부분: useState로 변경

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
                setCurrentNickname(data.nickname);
                setUserId(data.userId); 
            })
            .catch((error) => {
                setError('사용자 정보를 가져올 수 없습니다.');
                console.error('Error fetching user info:', error);
            });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isValidNickname) {
            alert("변경 불가능한 닉네임 입니다.");
            return;
        }

        const formData = {
            nickname: nickname,
            id: userId, 
            command: 'updateNickname'
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/user/service`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('서버 오류로 닉네임 변경에 실패했습니다.');
            }

            const data = await response.json();
            console.log('닉네임 변경 성공:', data);
            alert('닉네임이 변경 되었습니다.');
            navigate('/user/myPage'); // 회원가입이 아닌 닉네임 변경 성공 페이지로 이동
        } catch (error) {
            console.error('닉네임 변경 실패:', error.message);
        }
    };

    const validateNickname = async (value) => {
        if (currentNickname === value) {
            setIsValidNickname(true);
            return '현재 닉네임과 동일한 닉네임 입니다.';
        }

        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json;charset=utf-8');

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({
                command: 'duplicateNickname',
                nickname: value,
            }),
            credentials: 'include',
        };

        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/user/service`, requestOptions);
        if (!response.ok) {
            return '서버 오류로 닉네임 검증에 실패했습니다.';
        }
        const result = await response.json().catch(() => ({}));

        if (result.exists === 'true') {
            setIsValidNickname(false);
        } else {
            setIsValidNickname(true);
        }
        return result.exists === 'true' ? '닉네임이 이미 존재합니다.' : '';
    };

    return (
        <Box maxW="md" mx="auto" mt={8} p={4} borderWidth="1px" borderRadius="md">
            <form onSubmit={handleSubmit}>
                <FormControl mb={6}>
                    <FormLabel>현재 닉네임</FormLabel>
                    <Input value={currentNickname} isReadOnly />
                </FormControl>
                <InputField
                    id="nickname"
                    label="닉네임"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="닉네임을 입력하세요."
                    isRequired
                    validate={validateNickname}
                />

                <Button type="submit" colorScheme="teal" mt={4} w="100%">
                    닉네임 변경
                </Button>
            </form>
        </Box>
    );
};

export default UpdateNickname;
