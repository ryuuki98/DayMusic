import React, { useState, useContext } from 'react';
import InputPassword from '../item/InputPassword';
import InputId from '../item/InputId';
import { useNavigate } from 'react-router-dom';
import { Button } from '@chakra-ui/react';
import AuthContext from '../../context/AuthContext';

const Login = () => {
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext); // AuthContext에서 login 함수 가져오기
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
                        // JSON으로 파싱
                        if (response.ok) {
                            console.log('로그인 성공:', data);
                            const { id, nickname } = data; // 응답 데이터에서 id와 nickname 추출
                            login({ id, nickname }); // AuthContext의 login 함수 호출

                            navigate('/user/myPage');
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
        navigate('/user/join'); // 회원가입 페이지로 이동
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <InputId />
                <InputPassword />
                <input type="submit" value="로그인" style={{ marginRight: '8px' }} />
            </form>
            <Button colorScheme="teal" onClick={handleSignup} size="sm">
                회원가입
            </Button>
        </>
    );
};

export default Login;
