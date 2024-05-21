import { createBrowserRouter } from 'react-router-dom';
import Root from './components/Root';
import Login from './components/user/Login';
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
    ],
    {
        basename: '/DayMusic',
    }
);
export default router;