import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, FormControl, FormLabel, Input, Select, Alert, AlertIcon } from '@chakra-ui/react';
import AuthContext from '../../context/AuthContext';
import InputField from '../item/InputField';

const UpdateUserInfo = () => {
    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext);
    const [name, setName] = useState('');
    const [gender, setGender] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [telecom, setTelecom] = useState('');


    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [isValidPhone, setIsValidPhone] = useState(true);

    useEffect(() => {
        if (!currentUser) {
            console.log("비로그인 상태");
            alert("로그인을 해야합니다.");
            navigate('/');
        } else {
            console.log("로그인 상태");
            fetchUserInfo(currentUser.id);
        }
    }, []);

    const fetchUserInfo = async (userId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/user/service`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    command: 'getUserInfo',
                    id: userId
                }),
            });

            if (!response.ok) {
                throw new Error('유저 정보를 가져오는데 실패했습니다.');
            }

            const data = await response.json();
            setName(data.name);
            setGender(data.gender);
            setEmail(data.email);
            setPhone(data.phone);
            setTelecom(data.telecom);
        } catch (error) {
            console.error('유저 정보 가져오기 실패:', error.message);
            setError('유저 정보를 가져오는 데 실패했습니다.');
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isValidEmail || !isValidPhone) {
            alert("유효하지 않은 정보 변경 입니다.");
            return;
        }

        const updateData = {
            id: currentUser.id,
            name : name,
            gender : gender,
            email : email,
            phone : phone,
            telecom : telecom,
            command: 'updateInformation'
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/user/service`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });
        

            if (response.ok) {
                console.log('개인정보 변경 성공:');
                setSuccess('개인정보가 변경되었습니다.');
                setError('');
                alert("개인정보가 변경 되었습니다 ")
                navigate('/user/myPage');
            } else {
                throw new Error('개인정보 변경 실패');
            }
        } catch (error) {
            console.error('개인정보 변경 실패:', error.message);
            setSuccess('');
            setError('개인정보 변경에 실패했습니다.');
        }
    };

   
    const validateEmail = async (value) => {
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json;charset=utf-8');
    
        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({
                command: 'duplicateEmailForUpdate',
                id : currentUser.id,
                email: value,
            }),
            credentials: 'include',
        };
    
        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/user/service`, requestOptions);
        if (!response.ok) {
            return '서버 오류로 이메일 검증에 실패했습니다.';
        }
        const result = await response.json().catch(() => ({}));
    
        if(result.exists === 'true'){
            setIsValidEmail(false);
            return '이메일이 이미 존재합니다.';
        } else {
            setIsValidEmail(true);
            return '';
        }
    };
    
    const validatePhone = async (value) => {
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json;charset=utf-8');
    
        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({
                command: 'duplicatePhone',
                id : currentUser.id,
                phone: value,
            }),
            credentials: 'include',
        };
    
        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/user/service`, requestOptions);
        if (!response.ok) {
            return '서버 오류로 전화번호 검증에 실패했습니다.';
        }
        const result = await response.json().catch(() => ({}));
    
        if(result.exists === 'true'){
            setIsValidPhone(false);
            return '전화번호가 이미 존재합니다.';
        } else {
            setIsValidPhone(true);
            return '';
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
                    <FormLabel>이름</FormLabel>
                    <Input
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="이름을 입력하세요."
                    />
                </FormControl>
                <FormControl mb={6} isRequired>
                    <FormLabel>성별</FormLabel>
                    <Select
                        name="gender"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        placeholder="성별을 선택하세요."
                    >
                        <option value="M">남성</option>
                        <option value="F">여성</option>
                    </Select>
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
                <FormControl mb={6} isRequired>
                    <FormLabel>통신사</FormLabel>
                    <Select
                        name="telecom"
                        value={telecom}
                        onChange={(e) => setTelecom(e.target.value)}
                        placeholder="통신사를 선택하세요."
                    >
                        <option value="skt">SKT</option>
                        <option value="kt">KT</option>
                        <option value="lg">LG</option>
                    </Select>
                </FormControl>
                <Button type="submit" colorScheme="teal" mt={4} w="100%">
                    개인정보 수정
                </Button>
            </form>
        </Box>
    );
};

export default UpdateUserInfo;
