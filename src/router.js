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
import UpdateBoard from './components/Board/UpdateBoard';
import WriteBoard from './components/Board/WriteBoard';
import DetailBoard from './components/Board/DetailBoard';
import MyBoardList from './components/Board/MyBoardList';
import MyMusicBoardList from './components/Board/MyMusicBoardList';
import UserBoardList from './components/Board/UserBoardList';
import UserMusicBoardList from './components/Board/UserMusicBoardList';
import UpdatePassword from './components/user/UpdatePassword';
import UpdateNickname from './components/user/UpdateNickname';
import UpdateUserInfo from './components/user/UpdateUserInfo';
import SearchBoard from './components/Board/SearchBoard';
import Image from './components/Image/UploadImage';
import Rank  from './components/Rank/Rank';
import UserFollow from './components/Follow/UserFollow';
import FollowBoardList from './components/Board/FollowBoard';
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
                    path: 'update',
                    element: (
                        <>
                        <UpdateBoard />
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
                    path: 'follow',
                    element: (
                        <>
                        <FollowBoardList />
                        </>
                    
                ),
                },
                {
                    path: 'myBoard',
                    element: (
                        <>
                        <MyBoardList />
                        </>
                    
                ),
                },
                {
                    path: 'myMusicBoard',
                    element: (
                        <>
                        <MyMusicBoardList />
                        </>
                    
                ),
                },
                {
                    path: 'userBoard',
                    element: (
                        <>
                        <UserBoardList />
                        </>
                    
                ),
                },
                {
                    path: 'userMusicBoard',
                    element: (
                        <>
                        <UserMusicBoardList />
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
            path: '/comment',
            element: <></>,
            children: [],
        },
        {
            path: '/like',
            element: <Like />,
            children: [],
        },
        {
            path: '/follow',
            element: <Root />,
            children: [{
                path: '/follow',
                element: (
                    <>
                        <Follow />
                    </>
                ),
            },
            ],
        },
        {
            path: '/userFollow',
            element: <Root />,
            children: [{
                path: '/userFollow',
                element: (
                    <>
                        <UserFollow />
                    </>
                ),
            },
            ],
        },
        {
            path: '/image',
            element:<Image />,
            children: [],
        },
        {
            path: '/rank',
            element:<Rank />,
            children: [],
        }
    ],
    {
        basename: '/DayMusic',
    }
);
export default router;
