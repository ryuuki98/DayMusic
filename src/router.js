import { createBrowserRouter } from 'react-router-dom';
import Root from './components/Root';
import Main from './components/module/Main';
import Board from './components/Board';
import WriteBoard from './components/WriteBoard';
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
    ],
    {
        basename: '/DayMusic',
    }
);
export default router;