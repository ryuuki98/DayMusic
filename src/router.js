import { createBrowserRouter } from 'react-router-dom';
import Root from './components/Root';
import Login from './components/user/Login';
import MyPage from './components/user/MyPage';
import Join from './components/user/Join';
import JoinSuccess from './components/user/JoinSuccess';
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
    ],
    {
        basename: '/DayMusic',
    }
);
export default router;