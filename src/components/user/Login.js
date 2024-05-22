import React, { useState } from 'react';
import InputPassword from '../item/InputPassword';
import InputId from '../item/InputId';

const Login = () => {
    const [error, setError] = useState('');

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
                    id: id,
                    password: password,
                    command: command,
                }),

                credentials: 'include',
            };

            fetch(`${process.env.REACT_APP_SERVER_URL}/user/service?id=${id}&password=${password}`, requestOptions)
                .then((response) => response.text())
                .then((result) => {
                    // if (response.ok) {
                    //     console.log('로그인 성공:', result);
                    //     // 성공적인 로그인 후의 작업을 여기에 추가
                    // } else {
                    //     setError('로그인 실패. ID와 비밀번호를 확인해주세요.');
                    //     console.error('로그인 실패:', result);
                    // }
                })
                .catch((error) => {
                    setError('로그인 중 오류가 발생했습니다. 나중에 다시 시도해주세요.');
                    console.error('로그인 오류:', error);
                });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <InputId />
            <InputPassword />
            <input type="submit" value="로그인" />
        </form>
    );
};

export default Login;
