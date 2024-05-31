// Join.js
import React, { useState } from 'react';
import { Box, Button, Radio, RadioGroup, Select, FormControl, Stack, FormLabel, Text, VStack } from '@chakra-ui/react';
import InputField from '../item/InputField';
import { useNavigate } from 'react-router-dom';

const Join = () => {
    const navigate = useNavigate();
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [gender, setGender] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [telecom, setTelecom] = useState('');
    const [nickname, setNickname] = useState('');
    const [profileImg, setProfileImg] = useState(null); 
    const [previewImg, setPreviewImg] = useState(null); 
    const [isValidId, setIsValidId] = useState(true);
    const [isValidNickname, setIsValidNickname] = useState(true);
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [isValidPhone, setIsValidPhone] = useState(true);

    const validateId = async (value) => {
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json;charset=utf-8');

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({
                command: 'duplicateId',
                id: value,
            }),
            credentials: 'include',
        };

        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/user/service`, requestOptions);
        if (!response.ok) {
            return '서버 오류로 ID 검증에 실패했습니다.';
        }
        const result = await response.json().catch(() => ({}));

        if (result.exists === 'true') {
            setIsValidId(false);
        } else {
            setIsValidId(true);
        }

        return result.exists === 'true' ? 'ID가 이미 존재합니다.' : '';
    };

    const validateEmail = async (value) => {
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json;charset=utf-8');

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({
                command: 'duplicateEmail',
                email: value,
            }),
            credentials: 'include',
        };

        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/user/service`, requestOptions);
        if (!response.ok) {
            return '서버 오류로 이메일 검증에 실패했습니다.';
        }
        const result = await response.json().catch(() => ({}));

        if (result.exists === 'true') {
            setIsValidEmail(false);
        } else {
            setIsValidEmail(true);
        }
        return result.exists === 'true' ? '이메일이 이미 존재합니다.' : '';
    };

    const validatePhone = async (value) => {
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json;charset=utf-8');

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({
                command: 'duplicatePhone',
                phone: value,
            }),
            credentials: 'include',
        };

        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/user/service`, requestOptions);
        if (!response.ok) {
            return '서버 오류로 전화번호 검증에 실패했습니다.';
        }
        const result = await response.json().catch(() => ({}));

        if (result.exists === 'true') {
            setIsValidPhone(false);
        } else {
            setIsValidPhone(true);
        }

        return result.exists === 'true' ? '전화번호가 이미 존재합니다.' : '';
    };

    const validateNickname = async (value) => {
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
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isValidId || !isValidNickname || !isValidEmail || !isValidPhone) {
            alert('유효하지 않은 가입입니다.');
            return;
        }
        const formData = new FormData();
        formData.append('id', id);
        formData.append('password', password);
        formData.append('name', name);
        formData.append('gender', gender);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('telecom', telecom);
        formData.append('nickname', nickname);
        formData.append('command', 'join');
        formData.append('profile_img_url', profileImg);

        const jsonFormData = {};
        for (const [key, value] of formData.entries()) {
            jsonFormData[key] = value;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/user/service`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jsonFormData),
            });

            if (!response.ok) {
                throw new Error('서버 오류로 회원가입에 실패했습니다.');
            }

            const data = await response.json();
            console.log('가입 성공:', data);
            alert('가입이 완료되었습니다.');
            navigate('/');
        } catch (error) {
            console.error('가입 실패:', error.message);
        }
    };

    return (
        <Box bg="white" color="black" p={8} maxW="md" mx="auto" mt={8} borderRadius="lg">
            <Text fontSize="3xl" mb={4} textAlign="center">회원가입</Text>
            <form onSubmit={handleSubmit}>
                <InputField
                    id="id"
                    label="아이디"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    placeholder="아이디를 입력하세요."
                    isRequired
                    validate={validateId}
                />
                <InputField
                    id="password"
                    label="비밀번호"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호를 입력하세요."
                    isRequired
                />
                <InputField
                    id="name"
                    label="이름"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="이름을 입력하세요."
                    isRequired
                />
                <FormControl id="gender" isRequired mt={4}>
                    <FormLabel>성별</FormLabel>
                    <RadioGroup value={gender} onChange={(value) => setGender(value)}>
                        <Stack direction="row">
                            <Radio value="M">남성</Radio>
                            <Radio value="F">여성</Radio>
                        </Stack>
                    </RadioGroup>
                </FormControl>
                <InputField
                    id="email"
                    label="이메일"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="이메일을 입력하세요."
                    isRequired
                    validate={validateEmail}
                />
                <InputField
                    id="phone"
                    label="휴대전화"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="휴대전화 번호를 입력하세요."
                    isRequired
                    validate={validatePhone}
                />
                <FormControl id="telecom" isRequired mt={4}>
                    <FormLabel>통신사</FormLabel>
                    <Select
                        value={telecom}
                        onChange={(e) => setTelecom(e.target.value)}
                        placeholder="통신사를 선택하세요."
                    >
                        <option value="kt">KT</option>
                        <option value="lg">LG U+</option>
                        <option value="skt">SKT</option>
                    </Select>
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

                <Button type="submit" bg="black" color="white" mt={4} w="100%">
                    회원가입
                </Button>
            </form>
        </Box>
    );
};

export default Join;
