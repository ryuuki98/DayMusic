import { createBrowserRouter } from 'react-router-dom';
import Root from './components/Root';
import Main from './components/module/Main';
import Follow from './components/Follow';

// 라우터 설계
/*
GET /follow/followed_list 팔로잉 리스트
GET /follow/follower_list 팔로워 리스트
POST /follow 팔로우 추가
DELETE /follow 팔로우 취소
*/

const router = createBrowserRouter(
    [
        {
            path: '/',
            element: <Root />,
            children: [
                {
                    path: "",
                    element: <Main/>
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
            path: '/follow',
            element: <Follow />,
            children: [

            ]
        }
    ],
    {
        basename: '/DayMusic',
    }
);
export default router;