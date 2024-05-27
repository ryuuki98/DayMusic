import { createBrowserRouter } from 'react-router-dom';
import Root from './components/Root';
import WriteBoard from './components/WriteBoard';
import Like from './components/Like';
import Login from './components/user/Login';

import Follow from './components/Follow';

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
import UpdateBoard from './components/UpdateBoard';import Board from './components/Board/Board';
import UpdateBoard from './components/Board/UpdateBoard';
const router = createBrowserRouter(
    [
        {
            path: '/',
            element: <Root/>,
            children: [
                {
                    path: "",
                    element: <Login/>
                }
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
                        <MyPage/>
                        </>
                    ),
                },
                {
                    path: 'join',
                    element: (
                        <>
                        <Join/>
                        </>
                    ),
                },
                {
                    path: 'joinSuccess',
                    element: (
                        <>
                        <JoinSuccess/>
                        </>
                    ),
                },
            ],
        },
        {
            path: '/board',
            element: <WriteBoard />,
            children: [
                {
                    path: 'delete',
                    element: <></>,
                },
                {
                    path: 'update',
                    element: <UpdateBoard />,
                },
                {
                    path: '',
                    element: (
                        <>
                            
                        </>
                    ),
                },
            ],
            
        },
        {
            path: '/like',
            element: <Like />,
            children:[]
        },
        {
            path: '/follow',
            element: <Follow />,
            children: []
        }
    ],
    {
        basename: '/DayMusic',
    }
);
export default router;