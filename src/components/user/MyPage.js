import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MyPage = () => {
    const [userInfo, setUserInfo] = useState({ userId: '', nickname: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

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
            setUserInfo({ userId: data.userId, nickname: data.nickname });
        })
        .catch((error) => {
            setError('사용자 정보를 가져올 수 없습니다.');
            console.error('Error fetching user info:', error);
            navigate('/login'); // 사용자 정보가 없으면 로그인 페이지로 이동
        });
    }, [navigate]);

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <>
            <h1>My Page</h1>
            <p>ID: {userInfo.userId}</p>
            <p>Nickname: {userInfo.nickname}</p>
        </>
    );
};

export default MyPage;
