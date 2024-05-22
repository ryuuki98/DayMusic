import { createBrowserRouter } from 'react-router-dom';
import Root from './components/Root';
import Main from './components/module/Main';
import WriteBoard from './components/WriteBoard';
import Like from './components/Like';
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