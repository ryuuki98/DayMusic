import { createBrowserRouter } from 'react-router-dom';
import Root from './components/Root';
<<<<<<< HEAD
import WriteBoard from './components/WriteBoard';
import Like from './components/Like';
import Login from './components/user/Login';
=======
import Main from './components/module/Main';
import Follow from './components/Follow';

// 라우터 설계
/*
GET /follow/followed_list 팔로잉 리스트
GET /follow/follower_list 팔로워 리스트
POST /follow 팔로우 추가
DELETE /follow 팔로우 취소
*/

>>>>>>> feature/follow
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
                    path: '',
                    element: (
                        <>
                            <h4>ㅇㅇ</h4>
                        </>
                    ),
                },
            ],
        },
        {
<<<<<<< HEAD
            path: '/board',
            element: <WriteBoard />,
            children: [
                {
                    path: '',
                    element: (
                        <>
                            
                        </>
                    ),
                },
                {
                    path: '',
                    element: (
                        <>
                            
                        </>
                    ),
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
            children:[
=======
            path: '/follow',
            element: <Follow />,
            children: [
>>>>>>> feature/follow

            ]
        }
    ],
    {
        basename: '/DayMusic',
    }
);
export default router;