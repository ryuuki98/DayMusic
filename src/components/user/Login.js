import React, { useState } from 'react';
import InputPassword from '../module/InputPassword';
import InputId from '../module/InputId';

const Login = () => {
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const id = document.getElementById('id-input').value;
        const password = document.getElementById('password-input').value;
        
        if (id.trim() === '' || password.trim() === '') {
            setError('ID와 비밀번호를 모두 입력해주세요.');
        } else {
            setError('');
            e.target.submit(); // 폼 제출
        }
    };

    return (
        <form  action="/user/login" onSubmit={handleSubmit}>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <InputId />
            <InputPassword />
            <input type="submit" value="로그인" />
        </form>
    );
};

export default Login;
