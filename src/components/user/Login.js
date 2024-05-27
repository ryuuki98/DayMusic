import React, { useState } from 'react';
import InputPassword from '../item/InputPassword';
import InputId from '../item/InputId';
import { useNavigate } from 'react-router-dom';
import { Button } from '@chakra-ui/react';
import AuthProvider from '../../context/AuthProvider';

const Login = () => {
    const [error, setError] = useState('');
    const navigate = useNavigate(); // useNavigate 훅을 컴포넌트 함수 최상위에서 호출

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
                    return response.text().then((result) => {
                        if (response.ok) {
                            console.log('로그인 성공:', result);
                            navigate('/user/myPage');
                        } else {
                            setError('로그인 실패. ID와 비밀번호를 확인해주세요.');
                            console.error('로그인 실패:', result);
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
        navigate('/user/join'); // 회원가입 페이지로 리디렉션
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <InputId />
                <InputPassword />
                <input type="submit" value="로그인"style={{ marginRight: '8px' }} />
            </form>
            <Button colorScheme="teal" onClick={handleSignup} size="sm">
                    회원가입
                </Button>
        </>
    );
};

export default Login;
