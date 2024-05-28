import { createBrowserRouter } from 'react-router-dom';
import Root from './components/Root';
import Like from './components/Like/Like';
import Login from './components/user/Login';

import Follow from './components/Follow/Follow';

// 라우터 설계
/*
GET /follow/followed_list 팔로잉 리스트
GET /follow/follower_list 팔로워 리스트
POST /follow 팔로우 추가
DELETE /follow 팔로우 취소
*/

import MyPage from './components/user/MyPage';
import Join from './components/user/Join';
import JoinSuccess from './components/user/JoinSuccess';
import Board from './components/Board/Board';
import UpdateBoard from './components/Board/UpdateBoard';
import WriteBoard from './components/Board/WriteBoard';
import DetailBoard from './components/Board/DetailBoard';
import UpdatePassword from './components/user/UpdatePassword';
import UpdateNickname from './components/user/UpdateNickname';
import UpdateUserInfo from './components/user/UpdateUserInfo';
import SearchBoard from './components/Board/SearchBoard';
const router = createBrowserRouter(
    [
        {
            path: '/',
            element: <Root />,
            children: [
                {
                    path: '',
                    element: <Login />,
                },
            ],
        },
        {
            path: '/user',
            element: <Root />,
            children: [
                {
                    path: 'myPage',
                    element: (
                        <>
                            <MyPage />
                        </>
                    ),
                },
                {
                    path: 'join',
                    element: (
                        <>
                            <Join />
                        </>
                    ),
                },
                {
                    path: 'joinSuccess',
                    element: (
                        <>
                            <JoinSuccess />
                        </>
                    ),
                },
                {
                    path: 'updatePassword',
                    element: (
                        <>
                            <UpdatePassword />
                        </>
                    ),
                },
                {
                    path: 'updateNickname',
                    element: (
                        <>
                            <UpdateNickname />
                        </>
                    ),
                },
                {
                    path: 'updateUserInfo',
                    element: (
                        <>
                            <UpdateUserInfo />
                        </>
                    ),
                },
            ],
        },
        {
            path: '/board',
            element: <Root />,
            children: [
                {
                    path: 'delete',
                    element: <></>,
                },
                {
                    path: 'update',
                    element: (
                        <>
                        
                        </>
                    
                ),
                },
                {
                    path: 'search',
                    element: (
                        <>
                        <SearchBoard />
                        </>
                    
                ),
                },
                {
                    path: 'detail',
                    element: (
                        <>
                        <DetailBoard />
                        </>
                    
                ),
                },
                {
                    path: 'write',
                    element: (
                        <>
                        <WriteBoard />
                        </>
                    
                ),
                },
            ],
        },
        {
            path: '/like',
            element: <Like />,
            children: [],
        },
        {
            path: '/follow',
            element: <Follow />,
            children: [],
        },
    ],
    {
        basename: '/DayMusic',
    }
);
export default router;
