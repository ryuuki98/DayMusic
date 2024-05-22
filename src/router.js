import { createBrowserRouter } from 'react-router-dom';
import Root from './components/Root';
import WriteBoard from './components/WriteBoard';
import Like from './components/Like';
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
        {
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

            ]
        }
    ],
    {
        basename: '/DayMusic',
    }
);
export default router;